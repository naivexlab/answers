import os
from dotenv import load_dotenv

if os.getenv("PYTHON_ENV", "local") == "local":
    load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", None)

PORT=int(os.getenv("AISERVICE_PORT", 5000))