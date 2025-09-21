from typing import List, Literal
from pydantic import BaseModel, Field

class PageOptions(BaseModel):
    break_line: bool = True
    page_numbers: bool = True

class PageConfig(BaseModel):
    margin: int = 18
    format: Literal["a4", "letter"] = "a4"
    options: PageOptions = Field(default_factory=PageOptions)

class CssConfig(BaseModel):
    value: str = ".section {\n\toutline: 1px solid #000;\n\toutline-offset: 4px;\n}"
    visible: bool = False

class ThemeConfig(BaseModel):
    background: str = "#ffffff"
    text: str = "#000000"
    primary: str = "#dc2626"

class FontConfig(BaseModel):
    family: str = "IBM Plex Serif"
    subset: str = "latin"
    variants: List[str] = ["regular"]
    size: int = 14

class TypographyConfig(BaseModel):
    font: FontConfig = Field(default_factory=FontConfig)
    line_height: float = 1.5
    hide_icons: bool = False
    underline_links: bool = True

class Metadata(BaseModel):
    template: str = "colorcraft"
    layout: List[List[List[str]]] = [[
        ["profiles", "summary", "experience", "education", "projects", "volunteer", "references"],
        ["skills", "interests", "certifications", "awards", "publications", "languages"]
    ]]
    css: CssConfig = Field(default_factory=CssConfig)
    page: PageConfig = Field(default_factory=PageConfig)
    theme: ThemeConfig = Field(default_factory=ThemeConfig)
    typography: TypographyConfig = Field(default_factory=TypographyConfig)
    notes: str = ""
