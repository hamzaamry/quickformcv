from typing import Dict, List
import pdfplumber


def extract_metadata(file_path: str) -> List[Dict]:
    metadata = []
    try:
        with pdfplumber.open(file_path) as pdf:
            for page_num, page in enumerate(pdf.pages):
                words = page.extract_words(keep_blank_chars=True, x_tolerance=3, y_tolerance=3)
                chars = page.chars

                # Extract fonts
                fonts = {}
                for char in chars:
                    font_name = char.get("fontname", "").split("+")[-1].lower()
                    fonts[font_name] = fonts.get(font_name, 0) + 1

                # Extract bullets
                bullets = [word for word in words if word["text"].strip() in {"•", "-", "∙", "○", "▪", "▫"}]

                # Calculate line heights
                line_heights = [
                    words[i]["top"] - words[i - 1]["top"] for i in range(1, len(words)) if words[i]["top"] != words[i - 1]["top"]
                ]

                # Extract text for language detection
                text = " ".join(word["text"] for word in words)

                metadata.append(
                    {
                        "page": page_num + 1,
                        "fonts": fonts,
                        "bullets": bullets,
                        "line_heights": line_heights,
                        "text": text,
                        "margins": {
                            "left": min(w["x0"] for w in words) if words else 0,
                            "right": (page.width - max(w["x1"] for w in words) if words else 0),
                            "top": min(w["top"] for w in words) if words else 0,
                            "bottom": (page.height - max(w["bottom"] for w in words) if words else 0),
                        },
                        "width": page.width,
                        "height": page.height,
                        "word_count": len(words),
                    }
                )
        return metadata
    except Exception as e:
        print(f"Error extracting metadata: {e}")
        return []
