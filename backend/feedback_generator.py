"""
Feedback Generator Module (Slide 6, 11, 12):
Generates actionable, rubric-aligned feedback covering:
1. Overall performance appraisal
2. Vocabulary & lexical diversity
3. Sentence structure & coherence
4. Content length & development
5. Concrete suggestions for revision
"""

class FeedbackGenerator:
    @staticmethod
    def generate(score: float, features: dict) -> dict:
        strengths = []
        weaknesses = []
        suggestions = []

        # Word count analysis
        wc = features.get("word_count", 0)
        if wc >= 350:
            strengths.append(f"Excellent length and comprehensive idea development ({wc} words).")
        elif wc >= 200:
            strengths.append(f"Adequate essay length ({wc} words) providing sufficient context.")
        else:
            weaknesses.append(f"Essay is relatively brief ({wc} words). Arguments feel underdeveloped.")
            suggestions.append("Expand on each key thesis point by adding concrete examples, counter-arguments, and illustrations.")

        # Lexical diversity analysis
        lex_div = features.get("lexical_diversity", 0.0)
        if lex_div >= 0.60:
            strengths.append(f"High lexical variety ({int(lex_div*100)}% unique vocabulary) showing strong word choice.")
        elif lex_div >= 0.45:
            strengths.append("Healthy vocabulary variation across paragraphs.")
        else:
            weaknesses.append(f"Repetitive word usage detected (lexical variety: {int(lex_div*100)}%).")
            suggestions.append("Replace frequently repeated verbs and adjectives with richer synonyms to improve tone.")

        # Sentence structure
        avg_sent = features.get("avg_sentence_length", 0.0)
        if 14 <= avg_sent <= 26:
            strengths.append(f"Balanced sentence structure with an average of {avg_sent} words per sentence.")
        elif avg_sent < 14:
            weaknesses.append("High prevalence of short, choppy sentences.")
            suggestions.append("Combine interrelated ideas using subordinating and coordinating conjunctions (e.g., however, furthermore, although).")
        else:
            weaknesses.append(f"Very long sentences on average ({avg_sent} words/sentence) which may impair clarity.")
            suggestions.append("Break down sprawling, run-on sentences into distinct, punchy assertions.")

        # Complex words
        comp_ratio = features.get("complex_word_ratio", 0.0)
        if comp_ratio >= 0.22:
            strengths.append(f"Advanced academic vocabulary evident ({int(comp_ratio*100)}% multi-syllabic terms).")
        else:
            suggestions.append("Incorporate domain-specific terminology relevant to the prompt topic.")

        # Readability
        readability = features.get("readability_score", 50.0)
        if readability > 70:
            readability_label = "Very Easy to Read"
        elif readability > 50:
            readability_label = "Standard / Moderate"
        else:
            readability_label = "Complex / Academic"

        # Summary appraisal
        if score >= 85:
            summary = "Outstanding submission demonstrating sophisticated arguments, excellent vocabulary, and cohesive structure."
        elif score >= 70:
            summary = "Competent essay displaying clear organization and good communication with minor areas for lexical refinement."
        elif score >= 50:
            summary = "Satisfactory start with reasonable central ideas, though greater depth, vocabulary diversity, and structural polish are recommended."
        else:
            summary = "Foundational attempt. Needs significant development in length, grammatical cohesion, and analytical elaboration."

        return {
            "score_100": score,
            "score_10": round(score / 10.0, 1),
            "summary": summary,
            "readability_label": readability_label,
            "strengths": strengths if strengths else ["Essay demonstrates baseline topical understanding."],
            "weaknesses": weaknesses if weaknesses else ["Minor stylistic adjustments only."],
            "suggestions": suggestions if suggestions else ["Maintain this high standard and continue refining nuanced phrasing."]
        }
