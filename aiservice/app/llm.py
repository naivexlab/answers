from langchain_google_genai import GoogleGenerativeAI
from langchain.prompts import PromptTemplate
from config import GEMINI_API_KEY
from app.utils import logger

def get_llm_response(prompt: str, model) -> str | None:
    """Calls the LLM with the given prompt and returns the raw text response."""

    # TODO: other models
    
    model = "gemini-2.0-flash"
    if not GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not found in configuration.")
        return None

    llm = GoogleGenerativeAI(model=model, GEMINI_API_KEY=GEMINI_API_KEY)

    try:
        response = llm.invoke(prompt)
        return response
    except Exception as e:
        logger.error(f"Error getting response from LLM: {e}")
        return None

def test_llm(topic: str):
    """Generates a raw LLM response for a 5-question multiple-choice quiz on the given topic."""
    prompt_template = """
    Generate a multiple-choice quiz with exactly 5 questions about the topic: '{topic}'.
    For each question, provide the question text and four distinct options labeled A, B, C, and D.
    """
    prompt = PromptTemplate(template=prompt_template, input_variables=["topic"])
    formatted_prompt = prompt.format(topic=topic)
    llm_response = get_llm_response(formatted_prompt)
    return llm_response

if __name__ == "__main__":
    raw_response = test_llm("World History")
    if raw_response:
        print("Raw LLM Response:")
        print(raw_response)
    else:
        print("Failed to get LLM response.")