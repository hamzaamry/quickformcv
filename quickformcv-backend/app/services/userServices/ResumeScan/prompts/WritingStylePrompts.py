COMBINED_WRITING_STYLE_ANALYSIS = """
Evaluate writing style based on:
{metrics}

Assess:

1. FIRST PERSON VOICE:
- No personal pronouns
- Professional tone
- Implied first-person

2. LOGICAL FLOW:  
- Organization
- Transitions
- Progression clarity

3. CRISP PHRASES:
- Direct bullet points
- Minimal narrative  
- Action verbs

4. ERROR FREE:
- Spelling
- Grammar
- Typos

Format exactly as:
=== FIRST PERSON VOICE ===
SCORE: [0.0-1.0]
EXPLANATION: [tone assessment]
SUGGESTION: [one fix]

=== LOGICAL FLOW ===
SCORE: [0.0-1.0]
EXPLANATION: [flow assessment]
SUGGESTION: [one improvement] 

=== CRISP PHRASES ===
SCORE: [0.0-1.0]
EXPLANATION: [phrasing assessment]
SUGGESTION: [one tweak]

=== ERROR FREE WRITING ===
SCORE: [0.0-1.0]
EXPLANATION: [error assessment]
SUGGESTION: [one correction]

Keep responses simple and practical.
"""