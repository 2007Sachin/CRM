# 🚀 Vercel Deployment Checklist

## Prerequisites ✓
- [x] GitHub account
- [x] Vercel account (free tier works)
- [x] Supabase database configured
- [x] Project restructured for monorepo

## Pre-Deployment Steps

### 1. Verify Local Build
```bash
# Test frontend build
npm run build

# Test backend locally
cd api
uvicorn index:app --reload
```

### 2. Environment Variables Needed

In Vercel dashboard, add these:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key-here
```

### 3. Verify Files

Essential files present:
- [x] `vercel.json` (routing configuration)
- [x] `api/index.py` (backend entry point)
- [x] `api/requirements.txt` (Python dependencies)
- [x] `package.json` (Node dependencies)
- [x] `.gitignore` (exclude unnecessary files)

## Deployment Process

### Option A: Vercel CLI (Fastest)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Add environment variables when prompted

### Option B: GitHub Integration (Recommended)

1. **Create GitHub Repository**:
```bash
git init
git add .
git commit -m "Initial commit - Vercel monorepo"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

2. **Import to Vercel**:
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your repository
   - Framework Preset: **Vite**
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add `SUPABASE_URL`
   - Add `SUPABASE_KEY`

4. **Deploy!**

## Post-Deployment Verification

### Test These Endpoints

1. **Root**: `https://your-app.vercel.app/`
   - Should load React app

2. **API Health**: `https://your-app.vercel.app/api/`
   - Should return: `{"message": "BolnaOS CRM API is running"}`

3. **Funnel Data**: `https://your-app.vercel.app/api/analytics/funnel`
   - Should return JSON with signups, trials, paid

## Troubleshooting

### Issue: API routes return 404
**Fix**: Verify `vercel.json` exists and has correct routing

### Issue: Environment variables not working
**Fix**: Redeploy after adding env vars (Settings → Redeploy)

### Issue: Python dependencies fail
**Fix**: Ensure `api/requirements.txt` is correctly formatted

### Issue: CORS errors
**Fix**: API uses `/api/*` relative paths (already configured)

## Success Criteria

- ✅ Frontend loads at root URL
- ✅ API responds at `/api/`
- ✅ Database queries work
- ✅ Charts load with real data
- ✅ No CORS errors

---

**Need help?** Check Vercel docs: https://vercel.com/docs
