JSON_EXTRACTION_PATTERNS = [
    r'```json\n(.*?)```',
    r'```\n(.*?)```',
    r'\{.*?\}',
]

DEFAULT_RESUME_SECTIONS = [
    {
        "section_type": "summary",
        "section_data": {
            "name": "Summary",
            "columns": 1,
            "content": ""
        }
    },
    {
        "section_type": "socials",
        "section_data": {
            "name": "Socials",
            "columns": 1,
            "items": []
        }
    },
    {
        "section_type": "experiences",
        "section_data": {
            "name": "Experiences",
            "columns": 1,
            "items": []
        }
    },
    {
        "section_type": "education",
        "section_data": {
            "name": "Education",
            "columns": 1,
            "items": []
        }
    },
    {
        "section_type": "skills",
        "section_data": {
            "name": "Skills",
            "columns": 1,
            "items": []
        }
    },
    {
        "section_type": "certifications",
        "section_data": {
            "name": "Certifications",
            "columns": 1,
            "items": []
        }
    },
    {
        "section_type": "languages",
        "section_data": {
            "name": "Languages",
            "columns": 1,
            "items": []
        }
    }
]
LLM_SUMMARY_SUGGESTION = """You are an expert resume writer. Based on the resume data below, create a powerful, concise professional summary.

Resume Data:
{resume_data}

### INSTRUCTIONS ###
- Write a professional summary in **exactly 2-3 sentences**
- Focus on: experience level, core skills, value proposition, and career focus
- Be selective — highlight only the most relevant strengths
- Use confident, active language (e.g., "Proven track record...")
- DO NOT include ANY of the following:
  - Introductory phrases ("Here is", "This is", "Professional summary:")
  - Explanations about what you're doing
  - Meta-comments or formatting instructions
  - Quotes, titles, or labels
- Return **ONLY** the raw summary text — nothing before or after
- Never say "Here is" or "Below is" — just write the summary

### OUTPUT FORMAT ###
[One paragraph, 2-3 sentences, no bullet points, no markdown]

Now write the summary:
"""