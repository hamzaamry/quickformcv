import json
import http.client
from typing import List, Dict, Optional
from app.services.shared.GroqService import GroqService

class JobQueryGenerator:
    def __init__(self, groq_service: GroqService):
        self.groq_service = groq_service
        self.rapidapi_key = "90a404199amsh18e88469e568409p1bbdf3jsn485e7e79ffbc"

    def generate_job_queries(self, resume_data: Dict) -> List[str]:
        """
        Generates 4 skill-focused job search queries from resume data
        """
        print("📊 Extracting resume insights...")
        insights = self._extract_key_insights(resume_data)
        print(f"✅ Insights extracted: {insights}")

        print("🤖 Generating AI queries...")
        prompt = self._create_prompt(insights)

        ai_response = self.groq_service.get_AI_response_sync(prompt)
        print(f"🔍 AI Response: {ai_response}")

        if ai_response:
            queries = self._parse_queries(ai_response)
            print(f"✅ Parsed queries: {queries}")
            if len(queries) >= 2:
                return queries

        print("⚠️ AI parsing failed, using fallback queries...")
        fallback = self._fallback_queries(insights)
        print(f"🔄 Fallback queries: {fallback}")
        return fallback

    def _extract_key_insights(self, resume_data: Dict) -> Dict:
        """
        Extracts only essential information for query generation
        """
        basics = resume_data.get('basics', {})
        headline = basics.get('headline', 'Developer')

        # Get top skills
        skills = []
        for section in resume_data.get('sections', []):
            if section.get('section_type') == 'skills':
                skill_items = section.get('section_data', {}).get('items', [])
                skills = [item.get('skill', '') for item in skill_items[:3]]
                break

        career_level = self._get_career_level(resume_data)

        return {
            'headline': headline,
            'skills': skills,
            'career_level': career_level
        }

    def _get_career_level(self, resume_data: Dict) -> str:
        """
        Determines career level from experience data
        """
        for section in resume_data.get('sections', []):
            if section.get('section_type') == 'experiences':
                experiences = section.get('section_data', {}).get('items', [])
                if experiences:
                    latest_role = experiences[0].get('title', '').lower()
                    start_year = int(experiences[0].get('startYear', 2023))
                    years_exp = 2025 - start_year

                    if 'senior' in latest_role or 'lead' in latest_role or years_exp > 5:
                        return 'senior'
                    elif 'junior' in latest_role or years_exp < 2:
                        return 'junior'
                    else:
                        return 'mid'
        return 'entry'

    def _create_prompt(self, insights: Dict) -> str:
        """
        Creates a focused prompt that generates realistic job titles
        """
        skills_text = ', '.join(insights['skills']) if insights['skills'] else 'General Development'

        return f"""Create 4 realistic job search terms. Use actual job titles that exist in the market.

Role: {insights['headline']}
Skills: {skills_text}
Level: {insights['career_level']}

RULES:
- Use real job titles only (e.g. "Javascript Frontend Developer", "AI Software Engineer", "Python Developer")
- Each term should be 1-5 words maximum
- No random skill combinations
- No location names

Format: term1, term2, term3, term4

Response:"""

    def _parse_queries(self, ai_response: str) -> List[str]:
        """
        Robust parsing of AI response to extract queries
        """
        cleaned = ai_response.strip()

        lines = cleaned.split('\n')
        for line in lines:
            line = line.strip()
            if ',' in line and not line.startswith(('Based on', 'Here are', 'Generate')):
                queries = [q.strip().strip('"\'') for q in line.split(',')]
                valid_queries = [q for q in queries if q and len(q) > 3 and len(q) < 50]
                if len(valid_queries) >= 4:
                    return valid_queries[:4]
                elif len(valid_queries) >= 2:
                    return valid_queries
        return []

    def _fallback_queries(self, insights: Dict) -> List[str]:
        """
        Generate reliable fallback queries if AI parsing fails
        """
        headline = insights['headline'].title()
        primary_skill = insights['skills'][0] if insights['skills'] else 'Software'

        # Create two different approaches
        queries = [
            headline,  # e.g., "Full Stack Developer"
            f"{primary_skill} Developer"  # e.g., "JavaScript Developer"
        ]

        # Add level prefix for junior roles
        if insights['career_level'] == 'junior':
            queries.append(f"Junior {headline}")

        return queries[:2]

    def search_jobs(self, query: str, page: int = 1) -> Optional[Dict]:
        """
        Searches for jobs using the JSearch API
        """
        try:
            conn = http.client.HTTPSConnection("jsearch.p.rapidapi.com")
            encoded_query = query.replace(' ', '%20')
            endpoint = f"/search?query={encoded_query}&page={page}&num_pages=1&date_posted=3days"

            headers = {
                'x-rapidapi-key': self.rapidapi_key,
                'x-rapidapi-host': "jsearch.p.rapidapi.com"
            }

            conn.request("GET", endpoint, headers=headers)
            res = conn.getresponse()
            data = res.read()

            return json.loads(data.decode("utf-8"))

        except Exception as e:
            print(f"Error searching jobs: {e}")
            return None

    async def generate_and_search(self, resume_data: Dict) -> Dict[str, Dict]:
        """
        Complete workflow: generate skill-focused queries and search jobs
        """
        queries = self.generate_job_queries(resume_data)
        results = {}

        for i, query in enumerate(queries, 1):
            print(f"Searching with Query {i}: {query}")
            job_results = self.search_jobs(query)
            results[f"query_{i}"] = {
                "query": query,
                "results": job_results
            }

        return results