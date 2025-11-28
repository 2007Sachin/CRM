# BolnaOS Revenue Command Center

A full-stack CRM application with Unit Economics tracking, built as a Vercel Monorepo.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Python FastAPI
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (Monorepo)

## 📁 Project Structure

```
/
├── api/                    # Python Backend
│   ├── index.py            # FastAPI entry point
│   ├── database.py         # Supabase client
│   ├── config.py           # Configuration
│   ├── services/           # Business logic
│   │   └── pricing_engine.py
│   └── requirements.txt    # Python dependencies
├── src/                    # React Frontend
│   ├── components/         # React components
│   ├── data/               # Mock data
│   └── lib/                # Utilities
├── public/                 # Static assets
├── package.json            # Node dependencies
├── vite.config.ts          # Vite configuration
└── vercel.json             # Vercel routing
```

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- Python 3.9+
- Supabase account

### Setup

1. **Install Dependencies**
```bash
# Frontend
npm install

# Backend
cd api
pip install -r requirements.txt
```

2. **Environment Variables**
Create a `.env` file in the root:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

3. **Database Setup**
Run the SQL in `schema.sql` in your Supabase SQL Editor, then seed data:
```bash
python backend/seed.py
```

4. **Run Development Servers**

Frontend:
```bash
npm run dev
```

Backend (in another terminal):
```bash
cd api
uvicorn index:app --reload
```

## 📦 Deployment to Vercel

### One-Click Deploy

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
4. Deploy!

### How It Works

The `vercel.json` configuration routes:
- `/api/*` → Python FastAPI backend
- `/*` → React SPA frontend

No additional configuration needed!

## 🔧 Key Features

- **Multi-level Drill-down**: Navigate from overview → lists → user details
- **Unit Economics**: Track cost, revenue, and margin per call
- **Industry Analysis**: Segment by BFSI, EdTech, Health Tech, etc.
- **Real-time Alerts**: Identify low-margin users and churn risks

## 📊 API Endpoints

- `POST /api/simulate-traffic` - Generate test call data
- `GET /api/analytics/pulse` - Latest 50 calls
- `GET /api/analytics/funnel` - Conversion funnel metrics
- `GET /api/analytics/sectors` - Revenue by industry
- `GET /api/users/risk` - High-risk users

## 🛠️ Tech Stack

Frontend:
- React 18
- TypeScript
- Vite
- TailwindCSS
- Shadcn UI
- Recharts
- Axios

Backend:
- FastAPI
- Supabase Python Client
- Pydantic

## 📝 License

MIT
