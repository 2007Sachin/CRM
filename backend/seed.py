import asyncio
import random
import sys
import os
from datetime import datetime, timedelta

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import supabase

# Constants
INDUSTRIES = ['BFSI', 'Health Tech', 'Ecommerce', 'EdTech', 'Hospitality']
PLANS = ['Enterprise', 'Pro', 'Free']
PLAN_WEIGHTS = [0.15, 0.25, 0.6]  # 15% Enterprise, 25% Pro, 60% Free

STACK_PRESETS = [
    {"llm": "gpt-4", "tts": "elevenlabs", "telephony": "twilio"},       # High Cost
    {"llm": "gpt-3.5-turbo", "tts": "deepgram", "telephony": "plivo"},  # Low Cost
    {"llm": "claude-3-opus", "tts": "openai-tts", "telephony": "twilio"}, # Mixed
    {"llm": "gpt-4", "tts": "deepgram", "telephony": "twilio"},         # Medium Cost
    {"llm": "gpt-3.5-turbo", "tts": "elevenlabs", "telephony": "plivo"} # Mixed Low
]

# Provider Costs (per minute)
COSTS = {
    "llm": {"gpt-4": 0.06, "gpt-3.5-turbo": 0.002, "claude-3-opus": 0.04},
    "tts": {"elevenlabs": 0.05, "deepgram": 0.015, "openai-tts": 0.02},
    "telephony": {"twilio": 0.015, "plivo": 0.010}
}

FIRST_NAMES = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 
               'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 
               'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy',
               'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra',
               'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna',
               'Joshua', 'Michelle', 'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Dorothy']

LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 
              'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 
              'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 
              'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson']

COMPANIES = ['TechCorp', 'Innovate', 'GlobalSol', 'NextGen', 'AlphaSys', 'BetaInc', 
             'CloudNet', 'DataFlow', 'SmartSoft', 'WebWorks', 'CyberDyne', 'BlueSky', 
             'RedRock', 'GreenField', 'SilverLining', 'CodeCraft', 'ByteForge', 
             'PixelPerfect', 'QuantumLeap', 'NeuralNet', 'FutureVision', 'SwiftScale']

def calculate_unit_economics(stack_config):
    """Calculate cost_per_min, price_per_min, and margin_percent"""
    llm = stack_config.get("llm", "gpt-3.5-turbo")
    tts = stack_config.get("tts", "deepgram")
    telephony = stack_config.get("telephony", "twilio")
    
    cost_per_min = (
        COSTS["llm"].get(llm, 0.002) +
        COSTS["tts"].get(tts, 0.015) +
        COSTS["telephony"].get(telephony, 0.015)
    )
    
    # Price strategy: Cost + $0.02 markup
    price_per_min = cost_per_min + 0.02
    
    # Calculate margin
    if price_per_min > 0:
        margin_percent = ((price_per_min - cost_per_min) / price_per_min) * 100
    else:
        margin_percent = 0
    
    return {
        "cost_per_min": round(cost_per_min, 4),
        "price_per_min": round(price_per_min, 4),
        "margin_percent": round(margin_percent, 1)
    }

def generate_user_data(index):
    first_name = random.choice(FIRST_NAMES)
    last_name = random.choice(LAST_NAMES)
    company = random.choice(COMPANIES) + " " + random.choice(['LLC', 'Inc', 'Group', 'Systems', 'Solutions', 'Technologies'])
    
    industry = random.choice(INDUSTRIES)
    plan = random.choices(PLANS, weights=PLAN_WEIGHTS, k=1)[0]
    stack_config = random.choice(STACK_PRESETS)
    
    # Calculate unit economics
    economics = calculate_unit_economics(stack_config)
    
    # Generate realistic usage counts and revenue based on plan
    if plan == 'Enterprise':
        usage_count = random.randint(8000, 25000)
        revenue = random.randint(2000, 10000)
        usage_trend = random.choice(['Stable', 'Stable', 'Increasing'])  # Mostly stable/increasing
        # Industry multiplier for Enterprise
        if industry == 'BFSI':
            usage_count = int(usage_count * 1.5)
            revenue = int(revenue * 1.5)
        elif industry == 'Ecommerce':
            usage_count = int(usage_count * 1.2)
    elif plan == 'Pro':
        usage_count = random.randint(1000, 8000)
        revenue = random.randint(200, 2000)
        usage_trend = random.choice(['Stable', 'Increasing', 'Decreasing'])
    else:  # Free
        usage_count = random.randint(0, 1000)
        revenue = 0
        usage_trend = random.choice(['Stable', 'Increasing'])
    
    # Signup date (random within last 180 days)
    days_ago = random.randint(0, 180)
    signup_date = (datetime.now() - timedelta(days=days_ago)).isoformat()
    
    return {
        "name": f"{first_name} {last_name}",
        "company": company,
        "industry": industry,
        "plan": plan,
        "stack_config": stack_config,
        "usage_count": usage_count,
        "revenue": revenue,
        "usage_trend": usage_trend,
        "signup_date": signup_date,
        "status": "Active" if usage_count > 0 else "Inactive",
        "is_whale": plan == 'Enterprise' and usage_count > 15000,
        **economics
    }

def seed_users(num_users=50):
    print(f"🌱 Seeding {num_users} Users...")
    
    users_to_insert = []
    for i in range(num_users):
        user_data = generate_user_data(i)
        users_to_insert.append(user_data)
        
    try:
        data = supabase.table("users").insert(users_to_insert).execute()
        print(f"✅ Seeded {len(data.data)} Users successfully!")
        return True
    except Exception as e:
        print(f"❌ Error seeding users: {e}")
        print("\nIMPORTANT: Please run the UPDATED 'schema.sql' in your Supabase SQL Editor.")
        print("New columns added: revenue, usage_trend, signup_date, cost_per_min, price_per_min, margin_percent")
        return False

if __name__ == "__main__":
    # Clear existing users first
    print("⚠️  Clearing existing users...")
    try:
        supabase.table("users").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
        print("✅ Cleared existing users")
    except Exception as e:
        print(f"⚠️  Could not clear users: {e}")
    
    # Seed 50 users
    success = seed_users(50)
    
    if success:
        print("\n🎉 Database seeded with 50 users!")
        print("\n� Data Distribution:")
        print("   - ~8 Enterprise users (whales)")
        print("   - ~13 Pro users")
        print("   - ~30 Free users")
        print("\n�💡 Next step: Generate call traffic data")
        print("   Run this PowerShell command 5 times:")
        print("   Invoke-RestMethod -Method POST -Uri http://localhost:8000/api/simulate-traffic")
