import argparse

from Database.database import reset_database


def main():
    parser = argparse.ArgumentParser(description="Database management commands")
    parser.add_argument(
        "command",
        choices=["reset"],
        help="Command to execute (e.g., reset for resetting the database)",
    )
    args = parser.parse_args()

    if args.command == "reset":
        reset_database()


if __name__ == "__main__":
    main()
