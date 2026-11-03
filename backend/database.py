"""
Database module for storing student essay submissions, scores, and prompts.
Uses SQLite for robust, portable zero-configuration relational storage.
"""
import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "essay_grading.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH, timeout=20.0)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Prompts table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS prompts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            sample_reference TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Essays table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS essays (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_name TEXT NOT NULL,
            prompt_id INTEGER,
            essay_text TEXT NOT NULL,
            word_count INTEGER NOT NULL,
            sentence_count INTEGER NOT NULL,
            score_100 REAL NOT NULL,
            score_10 REAL NOT NULL,
            vocabulary_quality TEXT NOT NULL,
            feedback_json TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (prompt_id) REFERENCES prompts(id)
        )
    """)

    # Populate sample prompts if empty
    cursor.execute("SELECT COUNT(*) FROM prompts")
    if cursor.fetchone()[0] == 0:
        sample_prompts = [
            (
                "Impact of Artificial Intelligence on Modern Education",
                "Discuss the benefits and challenges of integrating AI technologies into school and university curricula. Consider issues of accessibility, personalized learning, and academic integrity.",
                "Artificial intelligence transforms modern educational paradigms by facilitating customized learning paths, intelligent tutoring systems, and data-driven assessments while demanding vigilant policies on ethics and plagiarism."
            ),
            (
                "Climate Change and Renewable Energy Solutions",
                "Analyze the viability of replacing fossil fuels with solar, wind, and hydroelectric energy over the coming two decades. Address environmental and socioeconomic implications.",
                "Transitioning to sustainable green energy requires substantial infrastructural investments in photovoltaic systems, wind turbines, grid modernization, and international climate agreements."
            ),
            (
                "The Influence of Social Media on Youth Mental Health",
                "Examine how widespread smartphone and social platform usage affects adolescent development, self-esteem, peer relationships, and focus.",
                "Social media networks engender both unprecedented social connectivity and notable risks including screen addiction, algorithmic echo chambers, distorted self-worth, and digital anxiety."
            )
        ]
        cursor.executemany(
            "INSERT INTO prompts (title, description, sample_reference) VALUES (?, ?, ?)",
            sample_prompts
        )

    conn.commit()
    conn.close()

def save_submission(student_name: str, prompt_id: int | None, essay_text: str,
                    word_count: int, sentence_count: int, score_100: float,
                    score_10: float, vocabulary_quality: str, feedback_json: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO essays 
        (student_name, prompt_id, essay_text, word_count, sentence_count, score_100, score_10, vocabulary_quality, feedback_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (student_name, prompt_id, essay_text, word_count, sentence_count, score_100, score_10, vocabulary_quality, feedback_json))
    essay_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return essay_id

def get_recent_submissions(limit: int = 20):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT e.*, p.title as prompt_title 
        FROM essays e 
        LEFT JOIN prompts p ON e.prompt_id = p.id
        ORDER BY e.created_at DESC 
        LIMIT ?
    """, (limit,))
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows

def get_all_prompts():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM prompts ORDER BY id ASC")
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows
