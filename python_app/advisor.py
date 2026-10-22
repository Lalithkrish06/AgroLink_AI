import random
import time

CROP_MARKET_DATA = {
    "Paddy Rice": {
        "current_price": 42.50,
        "historical_prices": [36.0, 37.5, 39.0, 40.0, 41.5, 42.5],
        "projected_10d_price": 50.00,
        "price_change_percent": 17.6,
        "action": "HOLD",
        "action_en": "Hold & Store for 10 Days",
        "action_ta": "10 நாட்களுக்கு சேமித்து வைக்கவும் (விற்பனையை ஒத்திவைக்கவும்)",
        "recommendation_code": "HOLD_GREEN",
        "confidence": 94,
        "reason_en": "High festival demand surge expected next week. Supply in APMC mandis is down by 22%. Holding will yield +₹7.50/kg extra margin.",
        "reason_ta": "அடுத்த வாரம் பண்டிகை தேவை அதிகரிக்கும். சந்தை வரத்து 22% குறைந்துள்ளது. சேமித்து வைத்தால் கிலோவிற்கு ₹7.50 கூடுதல் லாபம் கிடைக்கும்."
    },
    "Tomato": {
        "current_price": 38.00,
        "historical_prices": [48.0, 45.0, 42.0, 40.0, 39.0, 38.0],
        "projected_10d_price": 28.00,
        "price_change_percent": -26.3,
        "action": "SELL",
        "action_en": "Sell Immediately",
        "action_ta": "உடனடியாக விற்பனை செய்யவும்",
        "recommendation_code": "SELL_RED",
        "confidence": 91,
        "reason_en": "Heavy harvest arrivals from neighboring districts expected in 3 days. Prices projected to drop by 26%. Sell now to maximize profits.",
        "reason_ta": "அடுத்த 3 நாட்களில் அண்டை மாவட்டங்களில் இருந்து அதிக வரத்து எதிர்பார்க்கப்படுகிறது. விலை 26% குறையும் என்பதால் உடனே விற்கவும்."
    },
    "Turmeric": {
        "current_price": 145.00,
        "historical_prices": [120.0, 125.0, 130.0, 138.0, 142.0, 145.0],
        "projected_10d_price": 168.00,
        "price_change_percent": 15.8,
        "action": "HOLD",
        "action_en": "Hold & Store for 10 Days",
        "action_ta": "10 நாட்களுக்கு சேமித்து வைக்கவும்",
        "recommendation_code": "HOLD_GREEN",
        "confidence": 96,
        "reason_en": "Erode turmeric auctions reporting strong export demand from Spices Board buyers. Holding guarantees top tier price band.",
        "reason_ta": "ஈரோடு மஞ்சள் ஏலத்தில் ஏற்றுமதி தேவை அதிகமாக உள்ளது. சேமித்து வைப்பது அதிகபட்ச விலையை உறுதி செய்யும்."
    },
    "Onion": {
        "current_price": 24.00,
        "historical_prices": [32.0, 30.0, 28.0, 26.0, 25.0, 24.0],
        "projected_10d_price": 19.50,
        "price_change_percent": -18.7,
        "action": "SELL",
        "action_en": "Sell Immediately",
        "action_ta": "உடனடியாக விற்பனை செய்யவும்",
        "recommendation_code": "SELL_RED",
        "confidence": 88,
        "reason_en": "Monsoon arrivals boosting mandi stock levels. Prices expected to decline further.",
        "reason_ta": "சந்தை வரத்து அதிகரித்து வருகிறது. மேலும் விலை குறைய வாய்ப்புள்ளது."
    }
}

class SmartMarketAdvisor:
    def __init__(self):
        pass

    def get_recommendation(self, crop_name="Paddy Rice", quantity=500):
        crop_data = CROP_MARKET_DATA.get(crop_name, CROP_MARKET_DATA["Paddy Rice"])
        
        current_val = crop_data["current_price"] * quantity
        projected_val = crop_data["projected_10d_price"] * quantity
        diff = projected_val - current_val

        return {
            "crop_name": crop_name,
            "quantity": quantity,
            "current_price_per_kg": crop_data["current_price"],
            "projected_10d_price_per_kg": crop_data["projected_10d_price"],
            "current_total_value": current_val,
            "projected_10d_total_value": projected_val,
            "projected_profit_loss": diff,
            "price_change_percent": crop_data["price_change_percent"],
            "historical_trend": crop_data["historical_prices"],
            "action": crop_data["action"],
            "action_en": crop_data["action_en"],
            "action_ta": crop_data["action_ta"],
            "recommendation_code": crop_data["recommendation_code"],
            "confidence": crop_data["confidence"],
            "reason_en": crop_data["reason_en"],
            "reason_ta": crop_data["reason_ta"]
        }
