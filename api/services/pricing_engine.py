from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, Any

COSTS = {
    "llm": {"gpt-4": Decimal("0.06"), "gpt-3.5": Decimal("0.002")},
    "tts": {"elevenlabs": Decimal("0.05"), "deepgram": Decimal("0.015")},
    "telephony": {"twilio": Decimal("0.015")}
}

def calculate_call_economics(stack_config: Dict[str, str], duration_seconds: int) -> Dict[str, Any]:
    """
    Calculates the unit economics of a call based on the stack configuration and duration.
    """
    llm_provider = stack_config.get("llm", "").lower()
    tts_provider = stack_config.get("tts", "").lower()
    telephony_provider = stack_config.get("telephony", "").lower()
    
    llm_cost_per_min = COSTS["llm"].get(llm_provider, Decimal("0"))
    tts_cost_per_min = COSTS["tts"].get(tts_provider, Decimal("0"))
    telephony_cost_per_min = COSTS["telephony"].get(telephony_provider, Decimal("0"))
    
    cost_per_min = llm_cost_per_min + tts_cost_per_min + telephony_cost_per_min
    
    duration_min = Decimal(str(duration_seconds)) / Decimal("60")
    total_cost = cost_per_min * duration_min
    
    # Revenue Strategy: Cost + $0.02 Markup per minute
    markup_per_min = Decimal("0.02")
    revenue_per_min = cost_per_min + markup_per_min
    total_revenue = revenue_per_min * duration_min
    
    margin_percent = Decimal("0")
    if total_revenue > 0:
        margin_percent = ((total_revenue - total_cost) / total_revenue) * 100
        
    is_low_margin = margin_percent < 20
    
    return {
        "total_cost": float(total_cost.quantize(Decimal("0.0001"), rounding=ROUND_HALF_UP)),
        "revenue": float(total_revenue.quantize(Decimal("0.0001"), rounding=ROUND_HALF_UP)),
        "margin_percent": float(margin_percent.quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)),
        "is_low_margin": is_low_margin
    }
