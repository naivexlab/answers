FROM python:3.12-slim-bookworm

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHON_MODULE=main
ENV PYTHON_ATTR=app
ENV HOST=0.0.0.0
ENV AISERVICE_PORT=5000


ENTRYPOINT ["/bin/sh", "-c"]
CMD ["uvicorn $PYTHON_MODULE:$PYTHON_ATTR --host $HOST --port $AISERVICE_PORT --reload"]