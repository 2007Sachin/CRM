# 🔧 BLACK PAGE FIX

## Problem
The frontend couldn't connect to the backend API because Vite wasn't configured to proxy `/api/*` requests.

## What Was Fixed

### 1. Updated `vite.config.ts`
Added proxy configuration to forward `/api` requests to `http://localhost:8000` (backend).

### 2. Updated `DashboardHome.tsx`
- Added loading state with spinner
- Fetches real stats from API
- Shows fallback values on error

## ✅ Solution: Restart Frontend Server

The Vite dev server needs to be restarted to load the new proxy configuration.

### Steps:

1. **Stop the current frontend server**:
   - Go to the terminal running `npm run dev` in `c:/Users/purch/CRM`
   - Press `Ctrl+C` to stop it

2. **Start it again**:
   ```bash
   cd c:/Users/purch/CRM
   npm run dev
   ```

3. **Ensure backend is running**:
   ```bash
   # In another terminal
   cd c:/Users/purch/CRM/api
   python -m uvicorn index:app --reload --port 8000
   ```

4. **Open browser**:
   - Go to the URL shown by Vite (e.g., `http://localhost:5176`)
   - Press `Ctrl+Shift+R` to hard refresh

## Verification

You should now see:
- ✅ Loading spinner briefly
- ✅ Dashboard with real data from Supabase
- ✅ Funnel chart, sector chart, and action tiles

## Still Black?

Check browser console (F12) for errors:
- **"Failed to fetch"**: Backend not running on port 8000
- **"Network Error"**: Check if backend URL is correct in vite.config.ts
- **Other errors**: Check the error message and fix accordingly

---

**The proxy configuration will make `/api` requests work in development!**
