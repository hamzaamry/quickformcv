import os
import time
from typing import Dict, Optional, Union

from dotenv import load_dotenv
from groq import AsyncGroq, Groq  # Import both AsyncGroq and regular Groq

from app.utils import logger

load_dotenv()


class GroqService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("GROQ API key is not set.")
        self.async_client = AsyncGroq(api_key=self.api_key)
        self.sync_client = Groq(api_key=self.api_key)  # Add a synchronous client

    async def get_AI_response(self, query: str) -> Optional[Union[Dict, str]]:
        """Sends a GROQ query and retrieves the response asynchronously."""
        try:
            chat_completion = await self.async_client.chat.completions.create(
                messages=[{"role": "user", "content": query}],
                model="llama3-8b-8192",
                temperature=0.25,
                max_tokens=4096,
            )
            response = chat_completion.choices[0].message.content.strip()
            return response

        except Exception as e:
            logger.error(f"Error communicating with GROQ API: {e}")
            return None

    def get_AI_response_sync(self, query: str) -> Optional[Union[Dict, str]]:
        """Sends a GROQ query and retrieves the response synchronously."""
        try:
            # Use the synchronous client
            chat_completion = self.sync_client.chat.completions.create(
                messages=[{"role": "user", "content": query}],
                model="llama3-8b-8192",
                temperature=0.25,
                max_tokens=4096,
            )
            response = chat_completion.choices[0].message.content.strip()
            return response

        except Exception as e:
            logger.error(f"Error communicating with GROQ API: {e}")
            return None