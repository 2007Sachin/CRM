import asyncio
import random
import os
import sys
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

class CallRequest(BaseModel):
    user_id: str

@app.get("/api")
def read_root():
    return {"message": "BolnaOS CRM API is running"}

@app.get("/api/users")
def get_users():
    """Fetch all users from Supabase"""
    try:
        response = supabase.table("users").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/simulate-traffic")
def simulate_traffic():
    # 1. Fetch all users
    response = supabase.table("users").select("*").execute()
    users = response.data
    
    if not users:
        return {"message": "No users found to simulate traffic for"}
    
    simulated_calls = []
    spikes_detected = 0
    
    # 2. Loop 20 times to simulate 20 live calls
    for _ in range(20):
        user = random.choice(users)
        
        # Generate random latency (weighted)
        if random.random() < 0.2: # 20% chance of spike
            latency_ms = random.randint(800, 2000)
            spikes_detected += 1
        else:
            latency_ms = random.randint(50, 300)
            
        # Generate random duration (30s to 300s)
        duration_seconds = random.randint(30, 300)
        
        # Determine status
        status = "completed" if random.random() < 0.9 else "failed"
        
        # 3. Apply Business Logic (Economics)
        # Use user's stack_config if available, else random default
        stack_config = user.get("stack_config")
        if not stack_config:
             stacks = [
                {"llm": "gpt-4", "tts": "elevenlabs", "telephony": "twilio"},
                {"llm": "gpt-3.5-turbo", "tts": "deepgram", "telephony": "plivo"},
                {"llm": "gpt-4", "tts": "deepgram", "telephony": "twilio"}
            ]
             stack_config = random.choice(stacks)
        
        economics = calculate_call_economics(stack_config, duration_seconds)
        
        # 4. Save to DB
        call_data = {
            "user_id": user["id"],
            "status": status,
            "latency_ms": latency_ms,
            "duration_seconds": duration_seconds,
            "total_cost": economics["total_cost"],
            "bolna_revenue": economics["revenue"],
            "margin_percent": economics["margin_percent"],
            "transcript": "Simulated traffic call"
        }
        
        try:
            supabase.table("calls").insert(call_data).execute()
            simulated_calls.append(call_data)
        except Exception as e:
            print(f"Error inserting call: {e}")
            
    return {
        "message": f"Simulated {len(simulated_calls)} live calls",
        "spikes_detected": spikes_detected,
        "details": simulated_calls
    }

# --- Analytics Endpoints ---

@app.get("/api/analytics/pulse")
def get_analytics_pulse():
    # Fetch latest 50 calls for the heartbeat chart
    response = supabase.table("calls").select("created_at, latency_ms").order("created_at", desc=True).limit(50).execute()
    return response.data

@app.get("/api/analytics/funnel")
def get_analytics_funnel():
    # 1. Total Signups (Total Users)
    users_resp = supabase.table("users").select("id, plan, usage_count").execute()
    users = users_resp.data
    
    total_signups = len(users)
    
    # 2. Paid Users (Plan != 'Free')
    paid_users = len([u for u in users if u.get('plan') != 'Free'])
    
    # 3. Active Trials (Users who have made calls / have usage)
    active_trials = len([u for u in users if u.get('usage_count', 0) > 0])
    
    return {
        "signups": total_signups,
        "trials": active_trials,
        "paid": paid_users
    }

@app.get("/api/analytics/sectors")
def get_analytics_sectors():
    # Fetch users with revenue and industry
    users_resp = supabase.table("users").select("industry, revenue").execute()
    
    sector_revenue = {}
    for user in users_resp.data:
        industry = user.get('industry', 'Unknown')
        revenue = user.get('revenue', 0)
        
        sector_revenue[industry] = sector_revenue.get(industry, 0) + revenue
        
    return sector_revenue

@app.get("/api/users/risk")
def get_users_risk():
    # Fetch recent calls to calc averages (limit to last 2000 to prevent OOM)
    calls_resp = supabase.table("calls").select("user_id, margin_percent, latency_ms").order("created_at", desc=True).limit(2000).execute()
    
    user_stats = {}
    for call in calls_resp.data:
        uid = call.get('user_id')
        if uid not in user_stats:
            user_stats[uid] = {'margins': [], 'latencies': []}
        
        if call.get('margin_percent') is not None:
            user_stats[uid]['margins'].append(call['margin_percent'])
        if call.get('latency_ms') is not None:
            user_stats[uid]['latencies'].append(call['latency_ms'])
            
    risk_users = []
    
    # Fetch user details for names
    users_resp = supabase.table("users").select("id, name, company").execute()
    users_map = {u['id']: u for u in users_resp.data}
    
    for uid, stats in user_stats.items():
        avg_margin = sum(stats['margins']) / len(stats['margins']) if stats['margins'] else 0
        avg_latency = sum(stats['latencies']) / len(stats['latencies']) if stats['latencies'] else 0
        
        reasons = []
        if avg_margin < 15:
            reasons.append("Low Profit")
        if avg_latency > 600:
            reasons.append("Tech Risk")
            
        if reasons:
            user_info = users_map.get(uid, {"name": "Unknown", "company": "Unknown"})
            risk_users.append({
                "user_id": uid,
                "name": user_info['name'],
                "company": user_info['company'],
                "avg_margin": round(avg_margin, 1),
                "avg_latency": round(avg_latency, 0),
                "reasons": reasons
            })
            
    return risk_users
