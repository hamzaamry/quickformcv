import logging
import os
import sys
from logging.handlers import RotatingFileHandler

import colorlog


def configure_logging():
    """
    Configure comprehensive logging with colorful console output and file logging.

    Returns:
        logging.Logger: Configured logger instance
    """
    logs_dir = "logs"
    os.makedirs(logs_dir, exist_ok=True)
    logger = colorlog.getLogger()
    logger.setLevel(logging.DEBUG)

    # Clear any existing handlers to prevent duplicate logs
    logger.handlers.clear()

    file_formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Colorful console formatter
    console_formatter = colorlog.ColoredFormatter(
        "%(log_color)s%(asctime)s - %(levelname)s - %(message)s",
        datefmt="%H:%M:%S",
        log_colors={
            "DEBUG": "cyan",
            "INFO": "green",
            "WARNING": "yellow",
            "ERROR": "red",
            "CRITICAL": "red,bg_white",
        },
    )

    file_handler = RotatingFileHandler(
        os.path.join(logs_dir, "app.log"),
        maxBytes=10_485_760,
        backupCount=5,
        encoding="utf-8",
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(file_formatter)

    error_handler = RotatingFileHandler(
        os.path.join(logs_dir, "error.log"),
        maxBytes=10_485_760,
        backupCount=5,
        encoding="utf-8",
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(file_formatter)

    console_handler = colorlog.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(console_formatter)

    logger.addHandler(file_handler)
    logger.addHandler(error_handler)
    logger.addHandler(console_handler)

    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

    return logger


# Global logger instance
logger = configure_logging()
