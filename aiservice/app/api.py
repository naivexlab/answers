from fastapi import APIRouter, HTTPException, Body
from app.llm import get_llm_response
from app.utils import logger
from typing import Optional
from pydantic import BaseModel

router = APIRouter()

class ApiResponse(BaseModel):
    message: str
    text: Optional[str] = None

class ApiRequest(BaseModel):
    prompt: str
    model: str  # e.g., "gemini-2.0-flash", "gemini-pro", "gpt-3.5-turbo", "claude-3-opus"

@router.post("/ai/llm", response_model=ApiResponse)
async def get_llm_response_post_endpoint(request: ApiRequest = Body(...)):
    logger.info(f"Received request with prompt: {request.prompt} and model: {request.model} in the body.")
    llm_response = get_llm_response(request.prompt, model=request.model)
    if llm_response:
        api_response = ApiResponse(message="LLM response generated successfully.", text=llm_response)
        return api_response
    else:
        raise HTTPException(status_code=500, detail="Failed to get response from LLM")
