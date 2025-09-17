class DatabaseConstants:
    REQUIRED_TABLES = {
        "users",
        "refresh_tokens",
        "user_login_history",
        "resumes",
        "resume_sections",
        "resume_metadata"
    }

    # Database pool settings
    POOL_SIZE = 5
    MAX_OVERFLOW = 10
    POOL_TIMEOUT = 30
    ECHO_SQL = False

    # Connection retry settings
    MAX_RETRIES = 3
    RETRY_DELAY = 5
