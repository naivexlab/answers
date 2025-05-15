from fastapi import FastAPI
from app.api import router
from config import PORT
from app.utils import logger

app = FastAPI()
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    logger.info(f'AIService Server starting on port: {PORT}')
    uvicorn.run(app, host="0.0.0.0", port=PORT)
