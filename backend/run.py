"""
Runner script for KisanSetu AI FastAPI backend
"""
import os
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = "0.0.0.0"
    print(f"Starting KisanSetu AI Backend on http://{host}:{port}...")
    uvicorn.run("app.main:app", host=host, port=port)
