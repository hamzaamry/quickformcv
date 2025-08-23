ANALYZE_FIRST_IMPRESSION = """
Evaluate resume first impression based on:
{metrics}

Assess four areas for entry-level/students:

1. READABILITY (scanning ease, spacing, clarity)
2. DESIGN (fonts, formatting, professionalism)  
3. SUMMARY (effectiveness - include text excerpt)
4. APPEARANCE (overall layout/organization)

Requirements:
- User-friendly, non-technical language
- Brief, actionable suggestions
- Practical improvement tips

Format exactly as:

SECTION: READABILITY
SCORE: [0.0-1.0]
EXPLANATION: [scanning ease assessment]
SUGGESTION: [one layout tip]

SECTION: DESIGN  
SCORE: [0.0-1.0]
EXPLANATION: [visual appeal note]
SUGGESTION: [design tweak]

SECTION: SUMMARY
SUMMARY_TEXT: [brief excerpt]
SCORE: [0.0-1.0]
EXPLANATION: [effectiveness]
SUGGESTION: [improvement]

SECTION: APPEARANCE
SCORE: [0.0-1.0]
EXPLANATION: [layout assessment]
SUGGESTION: [organization tip]
"""