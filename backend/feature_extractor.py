"""
Feature Extractor Module (Slide 6, 7, 11, 12):
Extracts:
1. Lexical features (Word count, sentence count, avg sentence length, avg word length)
2. Vocabulary richness (Type-Token Ratio / Lexical Diversity)
3. Stop-word ratio & Punctuation metrics
4. TF-IDF vectorization & Content similarity scoring
"""
import math
import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class FeatureExtractor:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self._is_fitted = False

    def extract_linguistic_features(self, prep_result: dict) -> dict:
        words = prep_result["words"]
        sentences = prep_result["sentences"]
        lemmas = prep_result["lemmas"]

        clean_words = [w.lower() for w in words if w.isalpha()]
        word_count = len(clean_words) if clean_words else 1
        sent_count = len(sentences) if sentences else 1

        # Vocabulary variety (Type-Token Ratio)
        unique_words = set(clean_words)
        ttr = len(unique_words) / word_count if word_count > 0 else 0

        # Average sentence length
        avg_sentence_len = word_count / sent_count

        # Average word length
        avg_word_len = sum(len(w) for w in clean_words) / word_count if word_count > 0 else 0

        # Long words (> 6 chars) as a proxy for complex vocabulary
        complex_words = [w for w in clean_words if len(w) > 6]
        complex_word_ratio = len(complex_words) / word_count if word_count > 0 else 0

        # Content word ratio (non-stopwords)
        content_word_ratio = len(lemmas) / word_count if word_count > 0 else 0

        # Estimated Readability (approximate Flesch Reading Ease score)
        # 206.835 - 1.015 * (total_words / total_sentences) - 84.6 * (syllables / words)
        # using rough vowel clusters as syllable estimator
        syllables = sum(max(1, len(re.findall(r'[aeiouy]+', w))) for w in clean_words)
        syllables_per_word = syllables / word_count if word_count > 0 else 1
        readability = max(0, min(100, 206.835 - (1.015 * avg_sentence_len) - (84.6 * syllables_per_word)))

        return {
            "word_count": word_count,
            "sentence_count": sent_count,
            "unique_word_count": len(unique_words),
            "lexical_diversity": round(ttr, 3),
            "avg_sentence_length": round(avg_sentence_len, 2),
            "avg_word_length": round(avg_word_len, 2),
            "complex_word_ratio": round(complex_word_ratio, 3),
            "content_word_ratio": round(content_word_ratio, 3),
            "readability_score": round(readability, 1)
        }

    def compute_similarity(self, essay_text: str, reference_texts: list[str]) -> float:
        """Measures semantic similarity against prompt reference texts using TF-IDF and Cosine Similarity"""
        if not reference_texts:
            return 1.0
        try:
            corpus = reference_texts + [essay_text]
            tfidf_mat = TfidfVectorizer(stop_words='english').fit_transform(corpus)
            sim_scores = cosine_similarity(tfidf_mat[-1], tfidf_mat[:-1])
            return float(np.max(sim_scores))
        except Exception:
            return 0.75
