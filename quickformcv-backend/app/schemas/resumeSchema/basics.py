from typing import List
from pydantic import BaseModel, Field
from .base import UrlSchema, CustomField, Picture

class Basics(BaseModel):
    firstName: str = ""
    lastName: str = ""
    headline: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    url: UrlSchema = Field(default_factory=UrlSchema)
    custom_fields: List[CustomField] = Field(default_factory=list)
    picture: Picture = Field(default_factory=Picture)

    class Config:
        from_attributes = True