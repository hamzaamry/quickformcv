ANALYZE_APPEARANCE = """
Evaluate resume appearance based on:
{metrics}

Assess:
1. Visual Presentation (professional polish)
2. Margin Consistency (balanced spacing)
3. Design Consistency (fonts, bullets, spacing)
4. Page Formatting (breaks, headers, structure)

Requirements:
- Specific to provided metrics
- Unique suggestions per aspect
- Follow professional standards

Format each exactly as:
SCORE: [0.0-1.0]
EXPLANATION: [brief assessment]
SUGGESTION: [specific tip]
"""