from pydantic import BaseModel, HttpUrl, Field, field_validator
from typing import Union, List

class UrlSchema(BaseModel):
    label: str = ""
    href: Union[str, HttpUrl] = ""

    @field_validator('href', mode='before')
    def allow_empty_url(cls, v):
        if v == "":
            return v
        return v

class CustomField(BaseModel):
    id: str = ""
    icon: str = ""
    name: str = ""
    value: str = ""

class PictureEffects(BaseModel):
    hidden: bool = False
    border: bool = False
    grayscale: bool = False

class Picture(BaseModel):
    url: str = ""
    size: int = 64
    aspect_ratio: float = 1.0
    border_radius: int = 0
    effects: PictureEffects = Field(default_factory=PictureEffects)

    @classmethod
    def default(cls) -> 'Picture':
        return cls(
            url="",
            size=64,
            aspect_ratio=1.0,
            border_radius=0,
            effects=PictureEffects()
        )

class DateRange(BaseModel):
    start: str = ""
    end: str = ""

class PageSection(BaseModel):
    id: int
    name: str
    sections: List[str]

class Pages(BaseModel):
    pages: List[PageSection] = []
    activePageId: int = 1

class PagesUpdate(BaseModel):
    pages: List[PageSection] = []
    activePageId: int = 1