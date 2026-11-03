"""
FastAPI Application Entrypoint (Slide 8, 10, 11):
Exposes REST endpoints:
- POST /api/grade : Runs full NLP + Feature Extraction + ML scoring + Feedback + DB Logging
- GET /api/prompts : Retrieves available essay topics
- GET /api/history : Retrieves recent graded essays (Teacher / Student history)
- GET /api/health : Health check
"""
import json
import io
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

from preprocessor import TextPreprocessor
from feature_extractor import FeatureExtractor
from ml_model import EssayScoringModel
from feedback_generator import FeedbackGenerator
import database

# Initialize database
database.init_db()

# Initialize AI & ML components
preprocessor = TextPreprocessor()
feature_extractor = FeatureExtractor()
scoring_model = EssayScoringModel(model_type="random_forest")
scoring_model.load_or_train()

app = FastAPI(
    title="Automated Essay Grading System API",
    description="NLP and Machine Learning driven automated essay evaluation and feedback pipeline",
    version="1.0.0"
)

# Enable CORS for React frontend (default Vite port 5173 or other local ports)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CreatePromptRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    description: str = Field(..., min_length=5)

class EssaySubmissionRequest(BaseModel):
    student_name: Optional[str] = Field(default="Student", description="Name of student submitting")
    prompt_id: Optional[int] = Field(default=None, description="Selected prompt ID")
    custom_prompt_title: Optional[str] = Field(default=None, description="Custom prompt title")
    custom_prompt_desc: Optional[str] = Field(default=None, description="Custom prompt description / rubric scope")
    essay_text: str = Field(..., min_length=10, description="The complete essay text")

@app.get("/")
def root():
    return {
        "detail": "Active",
        "status": "online",
        "engine": "Reed — Essay Intelligence Engine",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/api/health")
def health():
    return {"status": "online", "model_trained": scoring_model.is_trained}

@app.get("/api/prompts")
def list_prompts():
    return database.get_all_prompts()

@app.post("/api/prompts")
def create_prompt(payload: CreatePromptRequest):
    new_id = database.create_custom_prompt(payload.title, payload.description)
    return {"id": new_id, "title": payload.title, "description": payload.description}

@app.get("/api/history")
def list_history():
    rows = database.get_recent_submissions()
    for row in rows:
        if "feedback_json" in row and row["feedback_json"]:
            try:
                row["feedback"] = json.loads(row["feedback_json"])
            except Exception:
                row["feedback"] = None
    return rows

@app.post("/api/upload-file")
async def extract_text_from_file(file: UploadFile = File(...)):
    """
    Accepts PDF, DOCX, TXT, and Markdown files, extracts textual content,
    and returns word count and sanitized text.
    """
    filename = (file.filename or "").lower()
    contents = await file.read()
    extracted_text = ""

    try:
        if filename.endswith(".pdf"):
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(contents))
            if reader.is_encrypted:
                try:
                    reader.decrypt("")
                except Exception:
                    raise HTTPException(
                        status_code=400,
                        detail="The uploaded PDF is password-protected. Please upload an unprotected PDF."
                    )
            pages_text = []
            for page in reader.pages:
                try:
                    text = page.extract_text()
                    if text:
                        import re
                        text = re.sub(r'(\w+)-\n(\w+)', r'\1\2', text)
                        pages_text.append(text)
                except Exception:
                    continue
            extracted_text = "\n\n".join(pages_text).strip()
        elif filename.endswith(".docx"):
            import docx
            doc = docx.Document(io.BytesIO(contents))
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            extracted_text = "\n\n".join(paragraphs).strip()
        elif filename.endswith((".txt", ".md", ".csv", ".rtf", ".log")) or not "." in filename:
            # Multi-encoding decode
            for enc in ["utf-8-sig", "utf-8", "utf-16", "latin-1", "cp1252"]:
                try:
                    extracted_text = contents.decode(enc).strip()
                    break
                except (UnicodeDecodeError, Exception):
                    continue
            else:
                extracted_text = contents.decode("latin-1", errors="ignore").strip()

            # Clean basic RTF tags if it's an RTF format
            if filename.endswith(".rtf") and extracted_text.startswith("{\\rtf"):
                import re
                extracted_text = re.sub(r'\\[a-z]+(-?\d+)? ?', ' ', extracted_text)
                extracted_text = re.sub(r'[{}]', '', extracted_text).strip()
                extracted_text = re.sub(r'\s+', ' ', extracted_text)
        elif filename.endswith(".doc"):
            raise HTTPException(
                status_code=400,
                detail="Legacy Word (.doc) binary format is not supported. Please save or export your file as modern Word (.docx) or PDF (.pdf) and upload again."
            )
        else:
            for enc in ["utf-8-sig", "utf-8", "latin-1", "cp1252"]:
                try:
                    extracted_text = contents.decode(enc).strip()
                    break
                except UnicodeDecodeError:
                    continue
            if not extracted_text:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported file format '{file.filename}'. Please upload a PDF (.pdf), Word document (.docx), or text file (.txt, .md)."
                )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

    if not extracted_text:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file appears to be empty or contains scanned images without extractable digital text. Please ensure the document contains selectable text."
        )

    words = extracted_text.split()
    return {
        "filename": file.filename,
        "text": extracted_text,
        "word_count": len(words),
        "char_count": len(extracted_text)
    }

@app.post("/api/grade")
def grade_essay(payload: EssaySubmissionRequest):
    essay_text = payload.essay_text.strip()
    if len(essay_text.split()) < 5:
        raise HTTPException(status_code=400, detail="Essay is too short to evaluate. Please write at least 5 words.")

    # 1. Text Preprocessing (Tokenization, stop words, lemmatization)
    prep_data = preprocessor.preprocess(essay_text)

    # 2. Feature Extraction (Lexical variety, sentence structure, readability)
    features = feature_extractor.extract_linguistic_features(prep_data)

    # Reference prompt similarity check (Cosine similarity on TF-IDF)
    ref_text = ""
    assigned_prompt_id = payload.prompt_id

    if payload.custom_prompt_desc and payload.custom_prompt_desc.strip():
        ref_text = payload.custom_prompt_desc.strip()
        custom_title = (payload.custom_prompt_title or "Custom Evaluation Topic").strip()
        assigned_prompt_id = database.create_custom_prompt(custom_title, ref_text)
    elif payload.prompt_id:
        prompts = database.get_all_prompts()
        for p in prompts:
            if p["id"] == payload.prompt_id:
                ref_text = p.get("sample_reference") or p.get("description", "")
                break
    similarity = feature_extractor.compute_similarity(essay_text, [ref_text] if ref_text else [])
    features["semantic_similarity"] = round(similarity, 3)

    # 3. Machine Learning Score Prediction
    pred_score = scoring_model.predict(features)

    # Vocabulary Tier
    lex_div = features["lexical_diversity"]
    if lex_div >= 0.65:
        vocab_tier = "Excellent"
    elif lex_div >= 0.50:
        vocab_tier = "Good"
    elif lex_div >= 0.35:
        vocab_tier = "Average"
    else:
        vocab_tier = "Basic"

    # 4. Feedback Generation
    feedback = FeedbackGenerator.generate(pred_score, features)
    feedback["vocabulary_tier"] = vocab_tier

    # 5. Persist to Database
    essay_id = database.save_submission(
        student_name=payload.student_name or "Anonymous",
        prompt_id=assigned_prompt_id,
        essay_text=essay_text,
        word_count=features["word_count"],
        sentence_count=features["sentence_count"],
        score_100=pred_score,
        score_10=feedback["score_10"],
        vocabulary_quality=vocab_tier,
        feedback_json=json.dumps(feedback)
    )

    return {
        "id": essay_id,
        "score_100": pred_score,
        "score_10": feedback["score_10"],
        "metrics": features,
        "vocabulary_tier": vocab_tier,
        "feedback": feedback
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
