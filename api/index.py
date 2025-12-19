import asyncio
import random
import os
import sys
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add api directory to path for imports
sys.path.insert(0, os.path.dirname(__file__))

from database import supabase
from services.pricing_engine import calculate_call_economics

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MOCK DATA FOR DEMO MODE ---
MOCK_USERS = [
    {"id": f"u{i}", "name": name, "company": comp, "industry": ind, "plan": plan, "usage_count": usage, "revenue": rev, "usage_trend": trend, "margin_percent": margin}
    for i, (name, comp, ind, plan, usage, rev, trend, margin) in enumerate([
        ("Alice Sterling", "Sterling Corp", "BFSI", "Enterprise", 15420, 12500, "Stable", 24.5),
        ("Robert Chen", "Chen Dynamics", "Health Tech", "Enterprise", 12300, 9800, "Increasing", 31.2),
        ("Sarah Jenkins", "Jenkins Global", "Ecommerce", "Enterprise", 9800, 7500, "Stable", 18.4),
        ("Michael Ross", "Ross Logistics", "BFSI", "Enterprise", 11250, 8900, "Increasing", 22.1),
        ("Emily Blunt", "Blunt Innovations", "EdTech", "Pro", 4500, 1200, "Decreasing", 15.2),
        ("John Doe", "Tech Start", "Ecommerce", "Free", 450, 0, "Stable", 0),
        ("Jane Smith", "Design Labs", "Hospitality", "Free", 120, 0, "Decreasing", 0),
        ("Harvey Specter", "Specter Litt", "BFSI", "Enterprise", 20000, 25000, "Increasing", 42.0),
        ("Donna Paulsen", "Paulsen Consulting", "Health Tech", "Enterprise", 18900, 15000, "Stable", 35.5),
        ("Louis Litt", "Litt Wheeler", "BFSI", "Pro", 13400, 5600, "Decreasing", 12.8),
    ])
]

MOCK_CALLS = [
    {
        "created_at": (datetime.now() - timedelta(minutes=i*2)).isoformat(),
        "latency_ms": random.randint(100, 800) if random.random() > 0.1 else random.randint(1200, 2500),
        "user_id": random.choice(MOCK_USERS)["id"],
        "margin_percent": random.uniform(10, 45)
    }
    for i in range(50)
]

class CallRequest(BaseModel):
    user_id: str

@app.get("/api")
def read_root():
    return {"message": "BolnaOS CRM API is running (Demo Mode)"}

@app.get("/api/users")
def get_users():
    """Fetch all users (Mocked for Demo)"""
    return MOCK_USERS

@app.post("/api/simulate-traffic")
def simulate_traffic():
    # In Demo Mode, we just return a success message
    return {
        "message": "Simulated 20 live calls (Demo Mode - Data not persisted)",
        "spikes_detected": random.randint(1, 5),
        "details": MOCK_CALLS[:20]
    }

# --- Analytics Endpoints ---

@app.get("/api/analytics/pulse")
def get_analytics_pulse():
    # Return mock calls for the heartbeat chart
    return [{"created_at": c["created_at"], "latency_ms": c["latency_ms"]} for c in MOCK_CALLS]

@app.get("/api/analytics/funnel")
def get_analytics_funnel():
    return {
        "signups": 150,
        "trials": 85,
        "paid": 42
    }

@app.get("/api/analytics/sectors")
def get_analytics_sectors():
    sector_revenue = {}
    for user in MOCK_USERS:
        industry = user.get('industry', 'Unknown')
        revenue = user.get('revenue', 0)
        sector_revenue[industry] = sector_revenue.get(industry, 0) + revenue
    return sector_revenue

@app.get("/api/users/risk")
def get_users_risk():
    risk_users = []
    for user in MOCK_USERS:
        reas = []
        if user["margin_percent"] < 15: reas.append("Low Profit")
        if user["usage_trend"] == "Decreasing": reas.append("Usage Drop")
        
        if reas:
            risk_users.append({
                "user_id": user["id"],
                "name": user["name"],
                "company": user["company"],
                "avg_margin": user["margin_percent"],
                "avg_latency": random.randint(200, 400),
                "reasons": reas
            })
    return risk_users

@app.get("/api/user-history/{user_id}")
def get_user_history(user_id: str):
    # Mock history for the drawer charts
    return [
        {"day": f"Day {i}", "calls": random.randint(50, 200), "latency": random.randint(150, 600)}
        for i in range(14)
    ]

@app.get("/api/command-center-data")
def get_command_center_data():
    return {
        "churn_risk": MOCK_USERS[6:8],
        "new_arrivals": MOCK_USERS[4:6],
        "top_performers": MOCK_USERS[0:2]
    }
