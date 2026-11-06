import time

from rich.align import Align
from rich.console import Console
from rich.live import Live
from rich.panel import Panel
from rich.text import Text


def create_clara_logo(frame):
    """
    Generate QuickForm CV's ASCII art logo with changing friendly expressions

    Args:
        frame (int): Current animation frame

    Returns:
        str: QuickForm CV ASCII art
    """
    expressions = ["(◠‿◠)", "(❀‿❀)", "(★‿★)", "(♥‿♥)"]
    expression = expressions[frame % len(expressions)]

    clara_art = f"""
        ◄ QuickForm CV: Build Your Perfect Resume ►
              ⚡ ACTIVE   {expression}   📄✨
    """
    return clara_art


def display_startup_sequence(logger=None):
    """
    Display an animated startup sequence for QuickForm CV

    Args:
        logger (logging.Logger, optional): Logger to use for logging startup steps
    """
    console = Console()
    console.clear()

    if logger:
        logger.info("QuickForm CV - Resume Builder System Initialization Started")

    frames = 6
    panel_width = console.width - 70

    with Live(refresh_per_second=4, vertical_overflow="crop") as live:
        for frame in range(frames):
            banner_text = Text()
            banner_text.append("\n")
            banner_text.append(create_clara_logo(frame), style="bright_blue")
            banner_text.append("\n")

            loading_messages = [
                "Initializing resume builder...",
                "Loading CV templates and formatting...",
                "Setting up job search algorithms...",
                "Preparing resume optimization tools...",
                "Connecting to job matching database...",
                "QuickForm CV is ready to build! 🚀",
            ]

            banner_text.append(
                f"⌛ [{('█'*frame).ljust(5)}] {loading_messages[frame]}",
                style="bright_green",
            )

            panel = Panel(
                Align.center(banner_text, width=panel_width),
                border_style="blue",
                padding=(1, 2),
                title="✦ QUICKFORM CV STARTUP ✦",
                subtitle="Professional Resume Builder",
                title_align="center",
                width=panel_width,
            )

            live.update(panel)
            time.sleep(0.4)

    banner_text = Text()
    banner_text.append(create_clara_logo(frames - 1), style="bright_blue")
    banner_text.append("\n")
    banner_text.append("Ready to create your perfect resume!", style="bright_green")

    final_panel = Panel(
        Align.center(banner_text, width=panel_width),
        border_style="blue",
        padding=(1, 2),
        title="✦ QuickForm CV is Ready! ✦",
        subtitle="Professional Resume Builder + Job Search",
        title_align="center",
        width=panel_width,
    )
    console.print("\033c", end="")
    console.print(final_panel)

    if logger:
        logger.info("QuickForm CV - Resume Builder System Successfully Initialized")