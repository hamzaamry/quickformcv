RESUME_SECTION_ANALYSIS = """
Analyze resume sections based on:
{metrics}

Evaluate:

1. SECTION LABELING:
- Clear section headers
- Format consistency

2. SECTION ORDER:
- Strategic qualification placement
- Logical flow
- Industry standards

3. WORK HISTORY ORDER:
- Chronological accuracy
- Date consistency
- Career progression
- Gap presentation

Format exactly as:
=== SECTION LABELING ===
SCORE: [0.0-1.0]
EXPLANATION: [clarity assessment]
SUGGESTION: [one improvement]

=== SECTION ORDER ===
SCORE: [0.0-1.0]
EXPLANATION: [flow assessment] 
SUGGESTION: [one improvement]

=== WORK HISTORY ORDER ===
SCORE: [0.0-1.0]
EXPLANATION: [progression assessment]
SUGGESTION: [one improvement]

Keep responses simple and jargon-free.
"""