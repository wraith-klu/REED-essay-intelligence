"""
Text Preprocessing module based on the System Methodology (Slide 6 & Slide 11):
- Tokenization
- Stop-word removal
- Lemmatization
"""
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import WordNetLemmatizer

# Ensure necessary NLTK models/data are downloaded
for resource in ['punkt', 'punkt_tab', 'stopwords', 'wordnet', 'omw-1.4']:
    try:
        nltk.download(resource, quiet=True)
    except Exception:
        pass

class TextPreprocessor:
    def __init__(self):
        try:
            self.stop_words = set(stopwords.words('english'))
        except Exception:
            self.stop_words = set()
        self.lemmatizer = WordNetLemmatizer()

    def clean_text(self, text: str) -> str:
        # Standardize whitespace and remove unusual control characters
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    def tokenize_words(self, text: str):
        try:
            tokens = word_tokenize(text)
        except Exception:
            tokens = re.findall(r'\b\w+\b', text)
        return tokens

    def tokenize_sentences(self, text: str):
        try:
            sentences = sent_tokenize(text)
        except Exception:
            sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
        return sentences

    def remove_stopwords_and_lemmatize(self, tokens):
        filtered_lemmas = []
        for word in tokens:
            clean_word = word.lower()
            if clean_word.isalpha() and clean_word not in self.stop_words:
                lemma = self.lemmatizer.lemmatize(clean_word)
                filtered_lemmas.append(lemma)
        return filtered_lemmas

    def preprocess(self, text: str):
        cleaned = self.clean_text(text)
        sentences = self.tokenize_sentences(cleaned)
        words = self.tokenize_words(cleaned)
        lemmatized_tokens = self.remove_stopwords_and_lemmatize(words)
        return {
            "cleaned_text": cleaned,
            "sentences": sentences,
            "words": words,
            "lemmas": lemmatized_tokens
        }
