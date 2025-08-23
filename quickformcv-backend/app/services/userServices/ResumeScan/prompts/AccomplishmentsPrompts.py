ANALYZE_ACCOMPLISHMENTS = """
Based on the provided analysis: 
{metrics}

Evaluate my resume's accomplishments section considering entry-level candidates and students.
Assess:
1. Career accomplishments (quality, relevance, presentation)
2. Quantification (results, impact, metrics)
3. Responsibilities vs. achievements distinction

Requirements:
- Tailor feedback to provided metrics
- Avoid repetition across sections
- Use conversational, personalized tone

Format each section exactly as:
SCORE: [0.0-1.0]
EXPLANATION: [brief assessment]
SUGGESTION: [one improvement tip]
"""