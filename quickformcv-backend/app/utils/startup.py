import time

from rich.align import Align
from rich.console import Console
from rich.live import Live
from rich.panel import Panel
from rich.text import Text


def create_clara_logo(frame):
    """
    Generate Clara's ASCII art logo with changing friendly expressions

    Args:
        frame (int): Current animation frame

    Returns:
        str: Clara ASCII art
    """
    expressions = ["(◠‿◠)", "(❀‿❀)", "(★‿★)", "(♥‿♥)"]
    expression = expressions[frame % len(expressions)]

    clara_art = f"""
    ╔═══════════════════════════════════════════════════╗
    ║   ██████╗  ██╗        █████╗   ██████╗    █████╗  ║
    ║  ██╔════╝  ██║       ██╔══██╗  ██╔══██╗  ██╔══██  ║
    ║  ██║       ██║       ███████║  ██████╔╝  ███████  ║
    ║  ██║       ██║       ██╔══██║  ██╔══██╗  ██╔══██  ║
    ║  ╚██████╗  ███████╗  ██║  ██║  ██║  ██║  ██║  ██  ║
    ╚═══════════════════════════════════════════════════╝
          ◄ ClaraHire: Your Career Growth Partner ►
                  ⚡ ACTIVE   {expression}
    """
    return clara_art


def display_startup_sequence(logger=None):
    """
    Display an animated startup sequence for Clara

    Args:
        logger (logging.Logger, optional): Logger to use for logging startup steps
    """
    console = Console()
    console.clear()

    if logger:
        logger.info("Clara AI Assistant - System Initialization Started")

    frames = 6
    panel_width = console.width - 70

    with Live(refresh_per_second=4, vertical_overflow="crop") as live:
        for frame in range(frames):
            banner_text = Text()
            banner_text.append("\n")
            banner_text.append(create_clara_logo(frame), style="bright_blue")
            banner_text.append("\n")

            loading_messages = [
                "Initializing AI assistant...",
                "Loading resume analysis modules...",
                "Preparing job matching algorithms...",
                "Calibrating interview preparation tools...",
                "Setting up career guidance systems...",
                "Clara is ready to help! 🚀",
            ]

            banner_text.append(
                f"⌛ [{('█'*frame).ljust(5)}] {loading_messages[frame]}",
                style="bright_green",
            )

            panel = Panel(
                Align.center(banner_text, width=panel_width),
                border_style="blue",
                padding=(1, 2),
                title="✦ CLARA STARTUP ✦",
                subtitle="AI-Powered Career Assistant",
                title_align="center",
                width=panel_width,
            )

            live.update(panel)
            time.sleep(0.4)

    banner_text = Text()
    banner_text.append(create_clara_logo(frames - 1), style="bright_blue")
    banner_text.append("\n")
    banner_text.append("Ready to enhance your career journey!", style="bright_green")

    final_panel = Panel(
        Align.center(banner_text, width=panel_width),
        border_style="blue",
        padding=(1, 2),
        title="✦ Clara is Ready! ✦",
        subtitle="AI-Powered Career Assistant",
        title_align="center",
        width=panel_width,
    )
    console.print("\033c", end="")
    console.print(final_panel)

    if logger:
        logger.info("Clara AI Assistant - System Successfully Initialized")
