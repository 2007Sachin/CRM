# 🎯 Complete Data Population Guide

## Step 1: Update Supabase Schema

Copy and run the **ENTIRE** contents of `schema.sql` in your Supabase SQL Editor.

This will:
- Drop old tables
- Create new tables with all required columns
- Set up RLS policies

## Step 2: Seed Users (50 Users)

```bash
python backend/seed.py
```

This creates:
- **~8 Enterprise users** (high revenue, high usage, "whales")
- **~13 Pro users** (medium revenue, medium usage)
- **~30 Free users** (no revenue, varying usage, potential conversions)

Each user has:
- ✅ Realistic stack configurations
- ✅ Unit economics (cost_per_min, price_per_min, margin_percent)
- ✅ Industry segmentation
- ✅ Usage trends (Stable, Increasing, Decreasing)

## Step 3: Generate Call Traffic Data

Run this command **5 times** to generate 100 calls (20 calls per run):

```powershell
Invoke-RestMethod -Method POST -Uri http://localhost:8000/api/simulate-traffic
```

Or use this loop to run it 5 times automatically:

```powershell
1..5 | ForEach-Object {
    Write-Host "Generating batch $_/5..."
    Invoke-RestMethod -Method POST -Uri http://localhost:8000/api/simulate-traffic
    Start-Sleep -Seconds 1
}
```

This creates:
- **100 call records** with real economics data
- Revenue, cost, and margin for each call
- Latency and duration metrics
- Timestamps for time-series analysis

## Step 4: Verify Data

Open your browser and visit: **http://localhost:5176**

You should see:
- ✅ **Funnel Chart**: Shows signup → trial → paid conversion
- ✅ **Sector Revenue Chart**: Revenue breakdown by industry
- ✅ **Action Tiles**: Real counts (Cash Cows, Conversion Targets, etc.)
- ✅ **Customer Lists**: Click any tile to see filtered users
- ✅ **User Details**: Click any user to see their 360° view with unit economics

## 📊 What You'll Be Able to Explore

1. **Industry Performance**: Which verticals generate most revenue?
2. **Unit Economics**: Which users have low margins?
3. **Conversion Opportunities**: High-usage free users ready to upgrade
4. **Churn Risks**: Premium users with decreasing usage
5. **Provider Cost Analysis**: Impact of stack choices on profitability

---

**Now you have a rich dataset to explore all dashboard features! 🚀**
