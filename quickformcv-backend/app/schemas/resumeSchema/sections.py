from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class SectionItemAdd(BaseModel):
    item_data: Dict[str, Any]

class BaseSection(BaseModel):
    name: str
    columns: int = 1

class SummarySection(BaseSection):
    content: str = ""

class SummaryUpdate(BaseModel):
    content: str

class ItemsSection(BaseSection):
    items: List[Dict[str, Any]] = []

class CustomSection(BaseSection):
    id: str
    items: List[Dict[str, Any]] = []

class LanguageItem(BaseModel):
    id: Optional[str] = None
    language: str = ""
    proficiency: str = ""

class LanguageItemAdd(BaseModel):
    language: str
    proficiency: str

class LanguageItemUpdate(BaseModel):
    language: Optional[str] = None
    proficiency: Optional[str] = None

class LanguagesSection(BaseSection):
    items: List[LanguageItem] = []

class AISuggestionRequest(BaseModel):
    model_config = {"arbitrary_types_allowed": True}
    resume_data: dict

class AISuggestionResponse(BaseModel):
    success: bool
    summary_suggestion: str