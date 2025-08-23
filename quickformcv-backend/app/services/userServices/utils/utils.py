import statistics
from typing import Dict, List, Set, Tuple


def get_average_score(
    readability_score: float,
    design_score: float,
    summary_score: float,
    appearance_score: float,
) -> float:
    scores = [readability_score, design_score, summary_score, appearance_score]
    return round(statistics.mean(scores), 2)


def calculate_margin_balance(margins: Dict[str, float]) -> float:
    """Calculate the balance ratio of margins."""
    left_right_ratio = margins["left"] / margins["right"] if margins["right"] != 0 else float("inf")
    top_bottom_ratio = margins["top"] / margins["bottom"] if margins["bottom"] != 0 else float("inf")

    # Average the ratios, handling potential infinity values
    if left_right_ratio == float("inf") or top_bottom_ratio == float("inf"):
        return 2.0  # Indicate significant imbalance

    return (left_right_ratio + top_bottom_ratio) / 2


def analyze_line_spacing(line_heights: List[float]) -> Tuple[float, str]:
    """Analyze line spacing metrics."""
    if not line_heights:
        return 0, "No line height data"

    avg_height = statistics.mean(line_heights)
    variance = statistics.variance(line_heights) if len(line_heights) > 1 else 0
    consistency = "Consistent" if variance < 5 else "Variable"

    return avg_height, consistency


def analyze_margins(margins: Dict[str, float], page_width: float) -> float:
    """Calculate margin ratio."""
    return (margins["left"] + margins["right"]) / page_width


def analyze_fonts(page_fonts: set, common_fonts: set) -> Tuple[int, float]:
    """Analyze font usage and professionalism."""
    page_fonts_lower = {font.lower() for font in page_fonts}
    professional_fonts = len(page_fonts_lower.intersection(common_fonts))
    professionalism_ratio = professional_fonts / len(page_fonts) if page_fonts else 0
    return professional_fonts, professionalism_ratio


def analyze_bullets(bullets: List[Dict]) -> Tuple[set, str]:
    """Analyze bullet point consistency."""
    bullet_types = {bullet["text"].strip() for bullet in bullets}
    consistency = "Consistent" if len(bullet_types) <= 1 else "Mixed"
    return bullet_types, consistency


def extract_llm_components(response: str) -> Tuple[float, str, str]:
    """Extract score, explanation, and suggestion from LLM response."""
    try:
        score_line = next(line for line in response.split("\n") if line.startswith("SCORE:"))
        explanation_line = next(line for line in response.split("\n") if line.startswith("EXPLANATION:"))
        suggestion_line = next(line for line in response.split("\n") if line.startswith("SUGGESTION:"))

        score = float(score_line.split(":")[1].strip())
        explanation = explanation_line.split(":")[1].strip()
        suggestion = suggestion_line.split(":")[1].strip()

        return min(max(score, 0.0), 1.0), explanation, suggestion
    except Exception as e:
        return 0.5, f"Error processing analysis: {str(e)}", ""

def extract_score_blocks(response: str) -> List[str]:
    """Helper method to extract score blocks from the AI response."""
    score_blocks = []
    current_block = []

    for line in response.split('\n'):
        line = line.strip()
        if not line:
            if current_block:
                score_blocks.append('\n'.join(current_block))
                current_block = []
        elif line.startswith(('SCORE:', 'EXPLANATION:', 'SUGGESTION:')):
            current_block.append(line)

    if current_block:
        score_blocks.append('\n'.join(current_block))

    return score_blocks

def analyze_content_distribution(page_word_count: int, avg_words_per_page: float) -> str:
    """Analyze content distribution on a page."""
    if avg_words_per_page <= 0:
        return "Unknown"

    density = page_word_count / avg_words_per_page
    if 0.7 <= density <= 1.3:
        return "Balanced"
    return "Heavy" if density > 1.3 else "Light"


def prepare_readability_analysis(metadata: List[Dict]) -> List[str]:
    """Prepare readability analysis points from metadata."""
    analysis_points = []
    for page in metadata:
        avg_height, consistency = analyze_line_spacing(page["line_heights"])
        margin_ratio = analyze_margins(page["margins"], page["width"])

        analysis_points.extend(
            [
                f"Page {page['page']}:",
                f"- Average line spacing: {avg_height:.2f}",
                f"- Line spacing consistency: {consistency}",
                f"- Margin ratio: {margin_ratio:.2f}",
                f"- Word count: {page['word_count']}",
            ]
        )
    return analysis_points


def prepare_design_analysis(metadata: List[Dict], common_fonts: Set[str]) -> Tuple[List[str], float, int]:
    """Prepare design analysis points and metrics from metadata."""
    design_points = []
    total_professional_fonts = 0
    total_fonts = 0
    all_bullet_types = set()

    for page in metadata:
        prof_fonts, prof_ratio = analyze_fonts(page["fonts"].keys(), common_fonts)
        total_professional_fonts += prof_fonts
        total_fonts += len(page["fonts"])

        bullet_types, consistency = analyze_bullets(page["bullets"])
        all_bullet_types.update(bullet_types)

        design_points.extend(
            [
                f"Page {page['page']}:",
                f"- Font choices: {'Professional' if prof_ratio >= 0.8 else 'Mixed'}",
                f"- Font consistency: {'Consistent' if len(page['fonts']) <= 2 else 'Various'}",
                f"- Bullet style: {consistency}",
            ]
        )

    return design_points, total_professional_fonts, total_fonts


def prepare_appearance_analysis(metadata: List[Dict]) -> Tuple[List[str], float]:
    """Prepare appearance analysis points from metadata."""
    total_words = sum(page["word_count"] for page in metadata)
    total_pages = len(metadata)
    avg_words_per_page = total_words / total_pages if total_pages > 0 else 0

    appearance_points = [
        f"Resume Overview:",
        f"- Total length: {total_pages} pages",
        f"- Content density: {avg_words_per_page:.0f} words per page",
        f"- Total content: {total_words} words",
    ]

    for page in metadata:
        margin_ratio = analyze_margins(page["margins"], page["width"])
        content_distribution = analyze_content_distribution(page["word_count"], avg_words_per_page)

        appearance_points.extend(
            [
                f"\nPage {page['page']} Analysis:",
                f"- Space utilization: {'Balanced' if 0.8 <= margin_ratio <= 1.2 else 'Uneven'}",
                f"- Content distribution: {content_distribution}",
                f"- Structure: {len(page['bullets'])} bullet points",
            ]
        )

    return appearance_points, avg_words_per_page
