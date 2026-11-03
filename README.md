# Reed — Essay Intelligence Engine

> An objective, reproducible automated essay evaluation and qualitative feedback platform driven by Natural Language Processing and supervised Machine Learning.

---

## ⚡ Overview

**Reed** evaluates written essays across lexical variety, syntactic depth, and semantic proximity to benchmark rubrics. Designed with editorial craftsmanship and silicon precision, Reed eliminates subjective evaluation fatigue and delivers instant, calibrated scores and developmental critique.

- **Multi-Format Ingestion**: Direct extraction and parsing from `.pdf`, `.docx`, `.txt`, and `.md` files.
- **Quantitative Telemetry**: Type-Token Ratio (TTR / Lexical Diversity), average sentence length, syllable distribution, and semantic TF-IDF cosine similarity.
- **Supervised ML Regressor**: Cross-validated ensemble model calibrated against academic rubrics (Quadratic Weighted Kappa optimization).
- **4-Dimension Rubric Scoring**: Topic Alignment (25), Lexical Sophistication (25), Syntactic Complexity (25), and Readability & Mechanics (25).
- **In-Draft Diagnostics**: Real-time detection of high-repetition vocabulary, run-on sentences (>32 words), and lexical density.
- **Editorial Feedback Generation**: Structured qualitative feedback detailing demonstrated strengths, developmental opportunities, and editorial suggestions.
- **Export & Printable PDF**: One-click clipboard export and clean `@media print` academic evaluation sheet.
- **Submissions Ledger**: Transactional history ledger with search filtering and cohort aggregate statistics.

---

## 🛠️ Architecture & Tech Stack

### Backend (`/backend`)
* **Framework**: FastAPI (Python 3.11+)
* **NLP Pipeline**: NLTK (WordNet lemmatization, tokenization, stop-word elimination)
* **Feature Extraction**: scikit-learn (TF-IDF vectorizer, Type-Token Ratio, syllable complexity)
* **Model**: Calibrated Random Forest Regressor (`trained_model.joblib`)
* **Document Extraction**: `pypdf`, `python-docx`
* **Storage**: SQLite relational logging (`database.py`)

### Frontend (`/frontend`)
* **Framework**: React 19 + Vite
* **Design System**: Editorial craftsmanship tokenized palette (Terracotta Brick accent, Obsidian Midnight dark mode, Japanese Linen light mode)
* **Zero Hardcoded CSS**: Pure CSS variable token architecture with seamless light/dark mode transitions
* **Self-Contained SVGs**: Pure inline vector icons with zero external icon font dependencies

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python**: 3.11 or 3.12 installed
- **Node.js**: v18+ and npm installed

### 2. Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Download required NLTK corpora
python -c "import nltk; nltk.download('punkt'); nltk.download('punkt_tab'); nltk.download('stopwords'); nltk.download('wordnet')"

# Start FastAPI server
python -m uvicorn main:app --host 127.0.0.1 --port 8080 --reload
```
* Backend API: `http://127.0.0.1:8080`
* Swagger API Documentation: `http://127.0.0.1:8080/docs`

### 3. Frontend Setup
```bash
cd frontend

# Install packages
npm install

# Start Vite development server
npm run dev
```
* Frontend Application: `http://localhost:5173/`

---

## 📄 License
MIT License
