import os
import subprocess

#TODO: FIX LINT ISSUES
def clean_old_configs():
    """Remove any existing isort config files to prevent conflicts."""
    old_configs = [".isort.cfg", ".isort.cfg.bak"]
    for config in old_configs:
        if os.path.exists(config):
            os.remove(config)


def format_code():
    """Format Python code using autoflake, isort, and black."""
    try:
        # Remove old config files
        clean_old_configs()

        print("1. Removing unused imports and variables...")
        subprocess.run(
            [
                "autoflake",
                "--in-place",
                "--recursive",
                "--remove-all-unused-imports",
                "--remove-unused-variables",
                ".",
            ],
            check=True,
        )

        print("2. Sorting imports...")
        subprocess.run(
            [
                "isort",
                ".",
                "--profile",
                "black",
                "--line-length",
                "120",
                "--multi-line",
                "3",
                "--lines-after-imports",
                "1",
            ],
            check=True,
        )

        print("3. Formatting code...")
        subprocess.run(["black", ".", "--line-length", "140"], check=True)

        print("Done! ✨")

    except subprocess.CalledProcessError as e:
        print(f"\nError during formatting: {e}")
        print("Please check the error message above and try again.")


if __name__ == "__main__":
    format_code()
