@echo off
title LLM App Launcher
echo Starting LLM App...

REM ─── Activate Python venv and start FastAPI ───
start cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

REM ─── Start Local Model Server ───
start cmd /k "cd backend && venv\Scripts\activate && python local_model_server.py"

REM ─── Start React Frontend ───
start cmd /k "cd frontend && npm start"

echo All processes launched. You can close this window.
pause
