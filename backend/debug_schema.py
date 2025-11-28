import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import supabase

print("Attempting minimal insert...")
try:
    data = supabase.table("users").insert({"name": "Test User"}).execute()
    print("Minimal insert success:", data.data)
except Exception as e:
    print("Minimal insert failed:", e)

print("Attempting insert with company_name...")
try:
    data = supabase.table("users").insert({"name": "Test User 2", "company_name": "Test Corp"}).execute()
    print("Company insert success:", data.data)
except Exception as e:
    print("Company insert failed:", e)
    
print("Attempting insert with company...")
try:
    data = supabase.table("users").insert({"name": "Test User 3", "company": "Test Corp"}).execute()
    print("Company (new) insert success:", data.data)
except Exception as e:
    print("Company (new) insert failed:", e)
