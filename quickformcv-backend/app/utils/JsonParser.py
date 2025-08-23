import ast
import json
import re

from .logging_config import logger


def CleanJsonString(s: str) -> str:
    """
    Clean and prepare a JSON string for parsing.

    Args:
        s (str): Input string potentially containing JSON

    Returns:
        str: Cleaned JSON string
    """
    if not s:
        raise ValueError("Empty input string")

    try:
        # Remove any non-JSON prefixes and suffixes
        # Uses regex to extract first valid JSON object or array
        json_match = re.search(r"(\{.*\}|\[.*\])", s, re.DOTALL)

        if json_match:
            cleaned = json_match.group(1)
        else:
            # Fallback: remove all non-structural characters
            cleaned = re.sub(r'[^\{\}\[\]:,"\d\w\.]', "", s)

        return cleaned.strip()

    except Exception as e:
        logger.error(f"JSON cleaning error: {e}")
        raise ValueError(f"Could not clean JSON string: {e}")


def ParseJsonResponse(response: str) -> dict:
    """
    Parse a JSON response with multiple fallback mechanisms.
    """
    if not response:
        raise ValueError("No response received")

    # If response is already a dictionary, return it
    if isinstance(response, dict):
        return response

    parsing_methods = [
        # Standard JSON parsing
        lambda s: json.loads(s),
        # AST literal evaluation
        lambda s: ast.literal_eval(s),
        # Regex-based extraction and parsing with more flexible matching
        lambda s: json.loads(re.search(r"(\{.*\})", s, re.DOTALL | re.MULTILINE).group(1)),
        # Try removing code block markers if present
        lambda s: json.loads(s.replace("```json", "").replace("```", "").strip()),
    ]

    errors = []

    for method in parsing_methods:
        try:
            cleaned_response = CleanJsonString(response)
            parsed_data = method(cleaned_response)

            if isinstance(parsed_data, dict):
                return parsed_data

        except Exception as e:
            errors.append(str(e))

    error_message = f"JSON Parsing Failed. Errors: {'; '.join(errors)}"
    logger.error(f"Original Response: {response}")  # Log original response for debugging
    logger.error(error_message)
    raise ValueError(error_message)
