<div align="center">

# 🎓 REED — Essay Intelligence

**Recursive Evaluation & Editorial Diagnostics**

*An end-to-end NLP + Machine Learning system for automated academic essay assessment*

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.7.1-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![NLTK](https://img.shields.io/badge/NLTK-3.9.1-154360?style=for-the-badge)](https://www.nltk.org)

[![Backend Live](https://img.shields.io/badge/Backend-Render%20%E2%80%94%20Live-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://reed-essay-intelligence-backend.onrender.com/api/health)
[![Frontend Live](https://img.shields.io/badge/Frontend-Vercel%20%E2%80%94%20Live-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://reed-essay-intelligence.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

*REED evaluates essays across four linguistic dimensions using a trained Random Forest model, NLTK text preprocessing, TF-IDF semantic alignment, and a React diagnostics interface — producing calibrated scores, rubric breakdowns, and actionable editorial feedback.*

</div>

---

## 📋 Table of Contents

| Section | Description |
|---|---|
| [🏗 System Architecture](#-system-architecture) | Full end-to-end component map |
| [🔬 NLP Pipeline](#-nlp-pipeline) | Text preprocessing stages |
| [🧬 Feature Extraction](#-feature-extraction) | All features fed to the ML model |
| [🤖 Machine Learning Model](#-machine-learning-model) | Random Forest algorithm deep dive |
| [📐 4-Dimension Rubric](#-4-dimension-rubric) | Scoring breakdown |
| [📊 TF-IDF & Cosine Similarity](#-tf-idf--cosine-similarity) | Semantic alignment math |
| [💾 Database Schema](#-database-schema) | SQLite entity relationships |
| [🔁 API Request Lifecycle](#-api-request-lifecycle) | Frontend ↔ Backend sequence |
| [📡 API Reference](#-api-reference) | All endpoints |
| [🚀 Running Locally](#-running-locally) | Setup instructions |
| [🧰 Tech Stack](#-tech-stack) | Full dependency list |

---

## 🏗 System Architecture

REED is a full-stack system with five distinct layers: input ingestion, NLP preprocessing, ML inference, persistence, and presentation.

```mermaid
flowchart TD
    A["📄 Essay Input\n(Text / PDF / DOCX / TXT)"] --> B

    subgraph BACKEND ["⚙️ Backend — FastAPI + Python 3.11"]
        B["📥 /api/upload-file\nFile Parsing\n(pypdf · python-docx · raw text)"]
        B --> C["🔬 Preprocessor\n(NLTK Pipeline)"]
        C --> D["🧬 Feature Extractor\n(6 numerical features)"]
        D --> E["🤖 ML Model\n(RandomForestRegressor · scikit-learn 1.7.1)"]
        E --> F["💬 Feedback Generator\n(Qualitative synthesis)"]
        F --> G["💾 SQLite Database\n(essay_grading.db)"]
    end

    subgraph FRONTEND ["🖥 Frontend — React 19 + Vite"]
        H["📝 Essay Composition Panel"]
        I["📊 Evaluation Analytics Panel"]
        J["🌲 NLP Pipeline Tree\n(Live step tracker)"]
        K["📈 4-Dimension Rubric\n(Topic · Lexical · Syntactic · Readability)"]
    end

    A --> H
    H -->|"POST /api/grade"| E
    G --> I
    C -.->|"Stage updates"| J
    E --> K

    style BACKEND fill:#1a1a2e,stroke:#e07a38,color:#fff
    style FRONTEND fill:#16213e,stroke:#61DAFB,color:#fff
```

---

## 🔬 NLP Pipeline

REED's preprocessing pipeline transforms raw essay text into a clean, normalized token sequence before feature extraction.

```mermaid
flowchart TD
    RAW["📄 Raw Essay Text\ne.g. 'The students are studying...'"]
    
    RAW --> T1

    subgraph PREPROCESS ["🔬 NLTK Preprocessing Pipeline"]
        T1["① Sentence Tokenization\nnltk.sent_tokenize(text)\n→ ['The students are studying...', ...]"]
        T1 --> T2
        T2["② Word Tokenization\nnltk.word_tokenize(sentence)\n→ ['The', 'students', 'are', 'studying', ...]"]
        T2 --> T3
        T3["③ Lowercasing\ntoken.lower()\n→ ['the', 'students', 'are', 'studying', ...]"]
        T3 --> T4
        T4["④ Punctuation & Symbol Removal\ntoken.isalpha() filter\n→ ['the', 'students', 'are', 'studying', ...]"]
        T4 --> T5
        T5["⑤ Stopword Removal\nnltk.corpus.stopwords (English)\n→ ['students', 'studying', ...]"]
        T5 --> T6
        T6["⑥ Lemmatization\nWordNetLemmatizer().lemmatize(token)\n→ ['student', 'study', ...]"]
    end

    T6 --> OUT["✅ Clean Token List\nReady for Feature Extraction"]

    style PREPROCESS fill:#0d1b2a,stroke:#4ecdc4,color:#fff
    style RAW fill:#2c3e50,color:#ecf0f1,stroke:#e07a38
    style OUT fill:#27ae60,color:#fff,stroke:#2ecc71
```

### Pipeline Stage Details

| Stage | Library / Method | Purpose |
|---|---|---|
| Sentence Boundary Detection | `nltk.sent_tokenize()` | Splits text into individual sentences for syntactic analysis |
| Word Tokenization | `nltk.word_tokenize()` | Splits sentences into individual word tokens |
| Lowercasing | `str.lower()` | Normalizes case for consistent vocabulary matching |
| Non-alpha Filtering | `str.isalpha()` | Removes punctuation, numbers, and special characters |
| Stopword Removal | `nltk.corpus.stopwords.words('english')` | Removes high-frequency function words (the, is, at...) |
| Lemmatization | `WordNetLemmatizer().lemmatize()` | Reduces words to their base/dictionary form |

---

## 🧬 Feature Extraction

After preprocessing, REED computes a **6-dimensional numerical feature vector** that is fed directly into the Random Forest model.

```mermaid
flowchart LR
    TOKENS["🧹 Clean Tokens\n+ Original Text\n+ Prompt Text"]

    TOKENS --> F1
    TOKENS --> F2
    TOKENS --> F3
    TOKENS --> F4
    TOKENS --> F5
    TOKENS --> F6

    subgraph FEATURES ["Feature Extraction Layer"]
        F1["📊 Word Count\nlen(tokens)\nRaw essay length"]
        F2["📏 Sentence Count\nlen(sent_tokenize)\nStructural density"]
        F3["📐 Avg Sentence Length\nwords ÷ sentences\nSyntactic complexity"]
        F4["🎨 Lexical Diversity\nType-Token Ratio\nunique_tokens ÷ total_tokens"]
        F5["🔤 Complex Word Ratio\nSyllable distribution\nmulti-syllable words ÷ total"]
        F6["🎯 Semantic Similarity\nTF-IDF + Cosine\nessay vs prompt alignment"]
    end

    F1 --> VEC
    F2 --> VEC
    F3 --> VEC
    F4 --> VEC
    F5 --> VEC
    F6 --> VEC

    VEC["📦 Feature Vector\n[wc, sc, asl, ttr, cwr, sim]\nShape: (1, 6)"]
    VEC --> ML["🤖 RandomForestRegressor"]

    style FEATURES fill:#1a0a2e,stroke:#9b59b6,color:#fff
    style VEC fill:#8e44ad,color:#fff
    style ML fill:#e07a38,color:#fff
```

### Feature Vector Specification

| Index | Feature Name | Formula / Method | Range | Contribution |
|---|---|---|---|---|
| 0 | `word_count` | `len(tokens)` | 0 → ∞ | Essay length baseline |
| 1 | `sentence_count` | `len(sent_tokenize(text))` | 1 → ∞ | Structural paragraph density |
| 2 | `avg_sentence_length` | `word_count / sentence_count` | 1 → 60 | Syntactic maturity |
| 3 | `lexical_diversity` | `unique_tokens / total_tokens` (TTR) | 0.0 → 1.0 | Vocabulary richness |
| 4 | `complex_word_ratio` | `polysyllabic_words / total_words` | 0.0 → 1.0 | Academic register |
| 5 | `semantic_similarity` | TF-IDF cosine similarity vs. prompt | 0.0 → 1.0 | On-topic alignment |

---

## 🤖 Machine Learning Model

### Algorithm: Random Forest Regressor

REED uses `sklearn.ensemble.RandomForestRegressor` — an ensemble learning method that builds multiple decision trees and averages their predictions to produce a continuous score.

```mermaid
flowchart TD
    INPUT["📦 Feature Vector\n[word_count, sentence_count, avg_sent_len,\nlexical_diversity, complex_word_ratio, semantic_sim]"]
    
    INPUT --> FOREST

    subgraph FOREST ["🌲 Random Forest — N Decision Trees"]
        subgraph T1 ["Tree 1 (Bootstrap Sample)"]
            direction TD
            R1["avg_sent_len > 15?"]
            R1 -->|Yes| R1Y["semantic_sim > 0.6?"]
            R1 -->|No| R1N["lexical_div > 0.55?"]
            R1Y -->|Yes| L1["Score: 8.4"]
            R1Y -->|No| L2["Score: 6.1"]
            R1N -->|Yes| L3["Score: 7.2"]
            R1N -->|No| L4["Score: 4.8"]
        end

        subgraph T2 ["Tree 2 (Bootstrap Sample)"]
            direction TD
            R2["semantic_sim > 0.5?"]
            R2 -->|Yes| R2Y["complex_word > 0.3?"]
            R2 -->|No| L5["Score: 3.9"]
            R2Y -->|Yes| L6["Score: 8.7"]
            R2Y -->|No| L7["Score: 6.5"]
        end

        subgraph TN ["Tree N (Bootstrap Sample)"]
            direction TD
            RN["word_count > 300?"]
            RN -->|Yes| LN1["Score: 7.8"]
            RN -->|No| LN2["Score: 5.3"]
        end
    end

    T1 --> AVG
    T2 --> AVG
    TN --> AVG

    AVG["📊 Average Aggregation\nscore = mean(tree_1, tree_2, ..., tree_N)\nVariance reduction via ensemble"]
    AVG --> SCALE["🔢 Score Scaling\nRegression output (1–10)\n× 10 = Final Score (10–100)"]
    SCALE --> OUTPUT["✅ Final Grade: 78 / 100"]

    style FOREST fill:#0d1b2a,stroke:#27ae60,color:#fff
    style AVG fill:#27ae60,color:#fff
    style OUTPUT fill:#e07a38,color:#fff
```

### Why Random Forest?

| Property | Benefit for Essay Grading |
|---|---|
| **Ensemble averaging** | Reduces overfitting to individual quirky training essays |
| **Non-linear decision boundaries** | Captures complex interactions between features (e.g., high vocab + low coherence) |
| **Feature importance** | Identifies which linguistic features matter most |
| **Regression output** | Produces continuous scores (not just class labels) |
| **Robust to outliers** | Single unusual essays don't skew the entire model |
| **No feature scaling required** | Works directly on raw feature magnitudes |

### Model Artifact

```
backend/trained_model.joblib   — 4.56 MB
Trained with: scikit-learn 1.7.1
Input shape:  (n_samples, 6)
Output range: 1.0 – 10.0  (calibrated 10-band regression)
Final output: score × 10 → 10 – 100 point scale
```

---

## 📐 4-Dimension Rubric

REED breaks the total score (100 points) across four equally-weighted linguistic dimensions (25 points each).

```mermaid
flowchart LR
    TOTAL["🏆 Total Score\n100 Points"]

    TOTAL --> D1
    TOTAL --> D2
    TOTAL --> D3
    TOTAL --> D4

    subgraph D1 ["🎯 Dimension 1"]
        DIM1["Topic Alignment\n25 Points\n\nMeasured by TF-IDF cosine\nsimilarity between essay\nand prompt reference text.\n\nHigh score = essay stays\ndirectly on topic."]
    end

    subgraph D2 ["📚 Dimension 2"]
        DIM2["Lexical Sophistication\n25 Points\n\nMeasured by Type-Token\nRatio (TTR) and complex\nword ratio.\n\nHigh score = rich, varied\nacademic vocabulary."]
    end

    subgraph D3 ["📐 Dimension 3"]
        DIM3["Syntactic Complexity\n25 Points\n\nMeasured by average\nsentence length and\nsentence count.\n\nHigh score = well-structured,\nvaried sentence patterns."]
    end

    subgraph D4 ["📖 Dimension 4"]
        DIM4["Readability & Mechanics\n25 Points\n\nMeasured by syllable\ndistribution and\noverall flow.\n\nHigh score = clear,\nwell-paced prose."]
    end

    D1 --> SCORE["🎓 Final Grade\ne.g. 18 + 21 + 19 + 20 = 78/100"]
    D2 --> SCORE
    D3 --> SCORE
    D4 --> SCORE

    style D1 fill:#1a3a1a,stroke:#27ae60,color:#fff
    style D2 fill:#1a1a3a,stroke:#3498db,color:#fff
    style D3 fill:#3a1a1a,stroke:#e74c3c,color:#fff
    style D4 fill:#3a2a1a,stroke:#f39c12,color:#fff
    style TOTAL fill:#e07a38,color:#fff
    style SCORE fill:#8e44ad,color:#fff
```

### Rubric Band Labels

| Score Range | Band Label | Descriptor |
|---|---|---|
| 90 – 100 | **Exceptional** | Publication-ready academic writing |
| 80 – 89 | **Proficient** | Strong academic writing, minor refinements needed |
| 70 – 79 | **Developing** | Competent writing with notable areas for growth |
| 60 – 69 | **Emerging** | Basic structure present; significant revision needed |
| 50 – 59 | **Beginning** | Foundational issues in most dimensions |
| < 50 | **Needs Attention** | Substantial revision across all dimensions |

---

## 📊 TF-IDF & Cosine Similarity

REED uses **Term Frequency–Inverse Document Frequency (TF-IDF)** to measure how semantically aligned an essay is with the prompt topic.

### TF-IDF Formula

For a term $t$ in document $d$ from corpus $D$:

$$\text{TF-IDF}(t, d, D) = \underbrace{\frac{f_{t,d}}{\sum_{t' \in d} f_{t',d}}}_{\text{Term Frequency}} \times \underbrace{\log\left(\frac{|D|}{|\{d \in D : t \in d\}|}\right)}_{\text{Inverse Document Frequency}}$$

Where:
- $f_{t,d}$ = raw count of term $t$ in document $d$
- $|D|$ = total number of documents
- $|\{d \in D : t \in d\}|$ = number of documents containing $t$

### Cosine Similarity Formula

$$\text{similarity}(A, B) = \cos(\theta) = \frac{\vec{A} \cdot \vec{B}}{|\vec{A}|\ |\vec{B}|}= \frac{\sum_{i=1}^{n} A_i B_i}{\sqrt{\sum_{i=1}^{n} A_i^2}\ \sqrt{\sum_{i=1}^{n} B_i^2}}$$

Where $\vec{A}$ = TF-IDF vector of the essay, $\vec{B}$ = TF-IDF vector of the prompt reference.

**Result**: A value in $[0.0, 1.0]$ where 1.0 means the essay perfectly mirrors the prompt's vocabulary distribution.

```mermaid
flowchart LR
    E["Essay Text\n'AI improves learning\nthrough personalization...'"]
    P["Prompt Reference\n'Discuss AI in education,\npersonalized learning...'"]

    E --> TV["TF-IDF Vectorizer\nsklearn.TfidfVectorizer()"]
    P --> TV

    TV --> VE["Essay Vector\n[0.0, 0.43, 0.0, 0.71, ...]"]
    TV --> VP["Prompt Vector\n[0.0, 0.38, 0.0, 0.69, ...]"]

    VE --> COS["Cosine Similarity\ncosine_similarity(ve, vp)"]
    VP --> COS

    COS --> SIM["Semantic Score\n0.847 → Topic Alignment: 21/25"]

    style TV fill:#1a3a5c,stroke:#3498db,color:#fff
    style COS fill:#1a5c3a,stroke:#27ae60,color:#fff
    style SIM fill:#e07a38,color:#fff
```

---

## 📐 Type-Token Ratio (TTR)

TTR quantifies **lexical diversity** — the variety of vocabulary used in an essay.

$$\text{TTR} = \frac{|\text{unique tokens}|}{|\text{total tokens}|}$$

**Example:**
- Essay: *"The cat sat on the mat. The cat ate the rat."*
- Tokens: `[the, cat, sat, on, the, mat, the, cat, ate, the, rat]` → 11 total
- Unique: `[the, cat, sat, on, mat, ate, rat]` → 7 unique
- **TTR = 7/11 = 0.636**

| TTR Range | Interpretation |
|---|---|
| 0.80 – 1.00 | Exceptional lexical diversity |
| 0.60 – 0.79 | Good vocabulary range |
| 0.40 – 0.59 | Average — some repetition |
| 0.20 – 0.39 | High repetition, limited vocabulary |
| 0.00 – 0.19 | Very repetitive writing |

> **Note:** TTR is length-sensitive — shorter texts naturally score higher. REED combines TTR with complex word ratio to produce a robust `lexical_diversity` feature.

---

## 💾 Database Schema

REED stores all grading submissions and custom prompts in a local SQLite database (`essay_grading.db`).

```mermaid
erDiagram
    PROMPTS {
        INTEGER id PK
        TEXT title
        TEXT description
        TEXT reference_text
        INTEGER is_default
        DATETIME created_at
    }

    SUBMISSIONS {
        INTEGER id PK
        TEXT student_name
        TEXT essay_text
        REAL final_score
        REAL topic_alignment
        REAL lexical_sophistication
        REAL syntactic_complexity
        REAL readability_mechanics
        TEXT feedback_strengths
        TEXT feedback_weaknesses
        TEXT feedback_suggestions
        TEXT readability_label
        INTEGER prompt_id FK
        DATETIME submitted_at
    }

    PROMPTS ||--o{ SUBMISSIONS : "evaluated against"
```

---

## 🔁 API Request Lifecycle

```mermaid
sequenceDiagram
    actor User
    participant FE as React Frontend
    participant API as FastAPI Backend
    participant PP as Preprocessor
    participant FX as Feature Extractor
    participant ML as ML Model
    participant DB as SQLite

    User->>FE: Paste essay + select prompt
    FE->>FE: Validate input (min length check)
    FE->>API: POST /api/grade<br/>{student_name, prompt_id, essay_text}

    API->>DB: SELECT prompt WHERE id=prompt_id
    DB-->>API: {title, description, reference_text}

    API->>PP: preprocess(essay_text)
    PP-->>API: clean_tokens[]

    API->>FX: extract_features(tokens, essay_text, reference_text)
    FX->>FX: compute TTR, avg_sentence_len,<br/>complex_word_ratio, TF-IDF cosine_sim
    FX-->>API: feature_vector [6 floats]

    API->>ML: model.predict([feature_vector])
    ML-->>API: raw_score (1.0 – 10.0)

    API->>API: scale_score(raw × 10)<br/>compute rubric dimensions<br/>generate feedback

    API->>DB: INSERT INTO submissions (...)
    DB-->>API: submission_id

    API-->>FE: {score, rubric, feedback, readability_label}
    FE->>FE: Animate score ring<br/>Render rubric bars<br/>Display pipeline tree
    FE-->>User: Full evaluation report
```

---

## 🌲 NLP Pipeline Execution Tree (UI)

When a grade request is submitted, the frontend displays a **live execution tree** tracking each pipeline stage in real time:

```
🌲 NLP Pipeline Execution
│
├── ① Tokenization & Boundary Lemmatization          ✅ Complete
│       NLTK word + sentence tokenizers
│
├── ② Linguistic Feature Extraction                   ✅ Complete
│       TTR · avg sentence length · syllable count
│
├── ③ Semantic Cosine Alignment                       ⟳ Running...
│       TF-IDF vectorizer · cosine similarity
│
├── ④ Supervised ML Regression                        ⏳ Pending
│       RandomForestRegressor · feature vector (1×6)
│
└── ⑤ Actionable Editorial Synthesis                  ⏳ Pending
        Strengths · weaknesses · improvement suggestions
```

Each stage lights up sequentially with animated status indicators during API processing.

---

## 📡 API Reference

**Base URL:** `https://reed-essay-intelligence-backend.onrender.com`

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `GET` | `/api/health` | Health check — returns status + version | — |
| `GET` | `/api/prompts` | List all evaluation prompts | — |
| `POST` | `/api/prompts` | Create a custom prompt | `{title, description, reference_text}` |
| `POST` | `/api/grade` | Grade an essay | `{student_name, prompt_id, essay_text}` |
| `POST` | `/api/upload-file` | Parse PDF/DOCX/TXT → plain text | `multipart/form-data: file` |
| `GET` | `/api/history` | Fetch recent submission history | `?limit=20` |

### `POST /api/grade` — Request / Response

**Request:**
```json
{
  "student_name": "Jane Doe",
  "prompt_id": 1,
  "essay_text": "Artificial intelligence is transforming..."
}
```

**Response:**
```json
{
  "score": 78,
  "rubric": {
    "topic_alignment": 20,
    "lexical_sophistication": 21,
    "syntactic_complexity": 19,
    "readability_mechanics": 18
  },
  "feedback": {
    "strengths": ["Strong semantic alignment with the prompt topic"],
    "weaknesses": ["Average sentence length could be increased"],
    "suggestions": ["Vary sentence structure with compound-complex sentences"]
  },
  "readability_label": "Developing",
  "features": {
    "word_count": 412,
    "sentence_count": 22,
    "avg_sentence_length": 18.7,
    "lexical_diversity": 0.61,
    "complex_word_ratio": 0.28,
    "semantic_similarity": 0.79
  }
}
```

---

## 🚀 Running Locally

### Prerequisites

- Python 3.11.x
- Node.js 20+
- pnpm (or npm)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
python -m nltk.downloader punkt stopwords wordnet

uvicorn main:app --host 127.0.0.1 --port 8080 --reload
```

Backend will be live at: `http://127.0.0.1:8080`  
API docs (Swagger UI): `http://127.0.0.1:8080/docs`

### Frontend

```bash
cd frontend
pnpm install

# Create .env.local
echo VITE_API_URL=http://127.0.0.1:8080/api > .env.local

pnpm run dev
```

Frontend will be live at: `http://localhost:5173`

### Full Local Stack (single command — PowerShell)

```powershell
# Terminal 1 — Backend
cd backend; python -m uvicorn main:app --port 8080 --reload

# Terminal 2 — Frontend
cd frontend; pnpm run dev
```

---

## 🧰 Tech Stack

### Backend

| Package | Version | Role |
|---|---|---|
| FastAPI | 0.115.6 | REST API framework |
| Uvicorn | 0.32.1 | ASGI server |
| scikit-learn | 1.7.1 | RandomForestRegressor, TfidfVectorizer |
| NLTK | 3.9.1 | Tokenization, stopwords, lemmatization |
| NumPy | 2.2.0 | Numerical feature array operations |
| SciPy | 1.17.1 | Statistical utilities |
| Pydantic | 2.10.4 | Request/response validation |
| pypdf | 5.1.0 | PDF text extraction |
| python-docx | 1.1.2 | DOCX text extraction |
| python-dotenv | 1.2.4 | Environment variable management |
| joblib | (via sklearn) | Model serialization |
| SQLite3 | (stdlib) | Persistent submission storage |

### Frontend

| Package | Version | Role |
|---|---|---|
| React | 19 | UI component framework |
| Vite | 8 | Build tool + dev server |
| CSS Variables | — | Design token system (terracotta `#e07a38`) |

### Infrastructure

| Service | Platform | URL |
|---|---|---|
| Backend API | Render (Free) | https://reed-essay-intelligence-backend.onrender.com |
| Frontend | Vercel (Hobby) | https://reed-essay-intelligence.vercel.app |
| Version Control | GitHub | https://github.com/wraith-klu/REED-essay-intelligence |

---

## 🗂 Project Structure

```
REED-essay-intelligence/
├── backend/
│   ├── main.py                 # FastAPI app + all route handlers
│   ├── ml_model.py             # RandomForestRegressor loader
│   ├── preprocessor.py         # NLTK tokenize → lemmatize pipeline
│   ├── feature_extractor.py    # TTR, cosine sim, syllable features
│   ├── feedback_generator.py   # Qualitative feedback synthesis
│   ├── database.py             # SQLite schema + CRUD operations
│   ├── trained_model.joblib    # Serialized trained model (4.56 MB)
│   ├── requirements.txt        # Python dependencies (pinned)
│   └── .python-version         # 3.11.9 (Render compatibility)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main React component
│   │   └── App.css             # CSS variable design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .python-version             # 3.11.9
├── .gitignore
└── README.md
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ for academic assessment automation

**REED** · Recursive Evaluation & Editorial Diagnostics

</div>
