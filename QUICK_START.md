# Quick Start Guide

## ⚡ Running the App Locally

The project structure has changed! Follow these steps:

### 1. Stop Old Servers
Stop any servers running in the `frontend` directory (the old structure).

### 2. Start Frontend (Root Directory)
```bash
# From c:/Users/purch/CRM
npm run dev
```
This will start the React app (usually on http://localhost:5173)

### 3. Start Backend (API Directory)
In a separate terminal:
```bash
# From c:/Users/purch/CRM
cd api
uvicorn index:app --reload --port 8000
```
This will start the Python API on http://localhost:8000

### 4. Open Browser
Navigate to the URL shown by Vite (usually http://localhost:5173)

## ⚠️ Current Issue Fix

If you see a blank white page:

1. **Check browser console** (F12) for errors
2. **Ensure you're accessing the RIGHT port** shown by Vite
3. **Clear browser cache** (Ctrl+Shift+R)

## Port Numbers
- Frontend: Usually 5173 (Vite may use 5174, 5175, etc. if port is busy)
- Backend: 8000

---

**The app is now running from the ROOT directory, not from `frontend/`!**
