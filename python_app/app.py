import os
import re
import random
import time
from flask import Flask, request, jsonify, render_template, send_from_directory
from ledger import ImmutableLedger
from advisor import SmartMarketAdvisor

app = Flask(__name__, template_folder='templates', static_folder='static')

# Initialize Security Ledger and Market Advisor Engine
ledger = ImmutableLedger()
advisor = SmartMarketAdvisor()

# In-memory storage for active demo listings
listings_db = [
    {
        "id": "LOT-2026-8801",
        "farmer_name": "Selvam Perundurai",
        "farmer_phone": "+91 98765 43210",
        "crop_name": "Paddy Rice",
        "quantity": 500,
        "unit": "kg",
        "location": "Erode, Tamil Nadu",
        "expected_price": 42.50,
        "quality_grade": "Grade A",
        "quality_code": "GRADE_A_GREEN",
        "quality_score": 94,
        "defects": "0.5% (Negligible)",
        "moisture": "11.2% (Optimal)",
        "status": "OPEN_FOR_BIDS",
        "created_at": "2026-09-09 14:30 UTC",
        "current_highest_bid": 46.00,
        "highest_bidder": "AgroCorp Wholesale Erode",
        "bids": [
            {
                "bidder": "Tamil Nadu Grain Traders",
                "amount": 44.00,
                "timestamp": "14:35 UTC",
                "tx_hash": "0x7a8f...92c1"
            },
            {
                "bidder": "AgroCorp Wholesale Erode",
                "amount": 46.00,
                "timestamp": "14:42 UTC",
                "tx_hash": "0x3e91...44a7"
            }
        ],
        "escrow": {
            "status": "FUNDS_LOCKED",
            "amount": 23000.00,
            "escrow_id": "ESC-8801-9921",
            "buyer_signature": None,
            "system_signature": None,
            "is_released": False,
            "dispute_deadline_hours": 48
        }
    },
    {
        "id": "LOT-2026-8802",
        "farmer_name": "Kavitha Raman",
        "farmer_phone": "+91 91234 56789",
        "crop_name": "Turmeric",
        "quantity": 300,
        "unit": "kg",
        "location": "Gobichettipalayam, Erode",
        "expected_price": 145.00,
        "quality_grade": "Grade A",
        "quality_code": "GRADE_A_GREEN",
        "quality_score": 96,
        "defects": "0.2%",
        "moisture": "8.5%",
        "status": "ESCROW_LOCKED",
        "created_at": "2026-09-09 11:15 UTC",
        "current_highest_bid": 152.00,
        "highest_bidder": "Kongu Spices Export Ltd",
        "bids": [
            {
                "bidder": "Kongu Spices Export Ltd",
                "amount": 152.00,
                "timestamp": "12:00 UTC",
                "tx_hash": "0x1b4c...88f2"
            }
        ],
        "escrow": {
            "status": "FUNDS_LOCKED",
            "amount": 45600.00,
            "escrow_id": "ESC-8802-1102",
            "buyer_signature": "SIG_BUYER_KONGUSPICES_09092026",
            "system_signature": None,
            "is_released": False,
            "dispute_deadline_hours": 32
        }
    }
]

# Initial block log for sample data
ledger.add_block(
    event_type="ESCROW_LOCKED",
    data={"listing_id": "LOT-2026-8801", "escrow_amount": 23000.00, "buyer": "AgroCorp Wholesale Erode"},
    sms_phone="+91 98765 43210",
    sms_text="[AgroLink Escrow] ₹23,000 locked in Escrow by AgroCorp Wholesale Erode for 500kg Paddy Rice. Pending delivery signature."
)

@app.route('/')
def index():
    return render_template('index.html')

# 1. PASSWORDLESS AUTH API
@app.route('/api/auth/otp/send', methods=['POST'])
def send_otp():
    data = request.get_json() or {}
    phone = data.get('phone', '9876543210').strip()
    otp = str(random.randint(100000, 999999))
    
    # Push SMS log
    ledger.add_sms_log(
        recipient=phone,
        message=f"[AgroLink Aadhaar Auth] Your One-Time Security Code is: {otp}. Valid for 5 minutes. Do not share."
    )
    
    return jsonify({
        "success": True,
        "message": f"OTP successfully sent via Aadhaar Mobile Gateway to {phone}",
        "demo_otp": otp,
        "phone": phone
    })

@app.route('/api/auth/otp/verify', methods=['POST'])
def verify_otp():
    data = request.get_json() or {}
    phone = data.get('phone', '9876543210')
    otp = data.get('otp', '')

    block = ledger.add_block(
        event_type="FARMER_AUTH_SUCCESS",
        data={"phone": phone, "auth_method": "AADHAAR_MOBILE_OTP", "status": "VERIFIED"},
        sms_phone=phone,
        sms_text=f"[AgroLink Security] Login verified via Aadhaar OTP for {phone}. Session secured."
    )

    return jsonify({
        "success": True,
        "message": "Passwordless Aadhaar OTP verification successful!",
        "farmer": {
            "name": "Selvam Perundurai",
            "aadhaar_masked": "XXXX-XXXX-8921",
            "phone": phone,
            "location": "Erode, Tamil Nadu"
        },
        "block_hash": block["hash"]
    })

@app.route('/api/auth/biometric', methods=['POST'])
def verify_biometric():
    data = request.get_json() or {}
    bio_type = data.get('bio_type', 'fingerprint')
    phone = data.get('phone', '+91 98765 43210')

    block = ledger.add_block(
        event_type="BIOMETRIC_AUTH_SUCCESS",
        data={"phone": phone, "bio_type": bio_type, "status": "MATCH_CONFIRMED_100%"},
        sms_phone=phone,
        sms_text=f"[AgroLink Security] Biometric ({bio_type.upper()}) authenticated successfully for {phone}."
    )

    return jsonify({
        "success": True,
        "message": f"Biometric ({bio_type.capitalize()}) verified successfully with Aadhaar vault!",
        "farmer": {
            "name": "Selvam Perundurai",
            "aadhaar_masked": "XXXX-XXXX-8921",
            "phone": phone,
            "location": "Erode, Tamil Nadu"
        },
        "block_hash": block["hash"]
    })

# 2. FORMLESS VOICE INPUT NLP PARSER
@app.route('/api/voice/parse', methods=['POST'])
def parse_voice_command():
    data = request.get_json() or {}
    transcript = data.get('transcript', '').strip()
    
    # NLP keyword extractions for Tamil and English
    crop_name = "Paddy Rice"
    if any(w in transcript.lower() for w in ['rice', 'paddy', 'அரிசி', 'நெல்']):
        crop_name = "Paddy Rice"
    elif any(w in transcript.lower() for w in ['tomato', 'தக்காளி']):
        crop_name = "Tomato"
    elif any(w in transcript.lower() for w in ['turmeric', 'மஞ்சள்']):
        crop_name = "Turmeric"
    elif any(w in transcript.lower() for w in ['onion', 'வெங்காயம்']):
        crop_name = "Onion"

    # Extract numbers (quantity & price)
    numbers = [int(s) for s in re.findall(r'\d+', transcript)]
    
    quantity = 500
    expected_price = 45.0

    if len(numbers) >= 1:
        quantity = numbers[0]
    if len(numbers) >= 2:
        expected_price = float(numbers[1])

    # Location extraction
    location = "Erode, Tamil Nadu"
    if 'salem' in transcript.lower() or 'சேலம்' in transcript:
        location = "Salem, Tamil Nadu"
    elif 'gobichettipalayam' in transcript.lower() or 'கோபி' in transcript:
        location = "Gobichettipalayam, Erode"
    elif 'namakkal' in transcript.lower() or 'நாமக்கல்' in transcript:
        location = "Namakkal, Tamil Nadu"

    return jsonify({
        "success": True,
        "transcript_processed": transcript,
        "parsed_data": {
            "crop_name": crop_name,
            "quantity": quantity,
            "unit": "kg",
            "location": location,
            "expected_price": expected_price
        },
        "confidence_score": 0.98
    })

# 3. COMPUTER VISION IMAGE QUALITY GRADING
@app.route('/api/quality/grade', methods=['POST'])
def grade_crop_image():
    # Simulate computer vision image histogram & texture analysis
    seed_val = random.randint(1, 100)
    
    if seed_val > 25:
        # Grade A (Green)
        grade = "Grade A"
        code = "GRADE_A_GREEN"
        score = random.randint(88, 98)
        defects = "0.3% (Negligible)"
        moisture = "11.0% (Optimal)"
        badge_color = "#2d6a4f"
        message_en = "Grade A Premium Quality: +15% Price Discovery Premium Applied"
        message_ta = "முதல் தரம் (Grade A): +15% கூடுதல் சந்தை விலை தகுதி பெற்றுள்ளது"
    elif seed_val > 10:
        # Grade B (Yellow)
        grade = "Grade B"
        code = "GRADE_B_YELLOW"
        score = random.randint(70, 85)
        defects = "2.8% (Minor variance)"
        moisture = "13.5% (Acceptable)"
        badge_color = "#e9c46a"
        message_en = "Grade B Standard Quality: Eligible for Standard APMC Benchmark Pricing"
        message_ta = "இரண்டாம் தரம் (Grade B): நிலையான சந்தை விலைக்கு தகுதியானது"
    else:
        # Grade C (Red)
        grade = "Grade C"
        code = "GRADE_C_RED"
        score = random.randint(50, 68)
        defects = "6.5% (Moisture/Discoloration detected)"
        moisture = "16.2% (High moisture)"
        badge_color = "#e63946"
        message_en = "Grade C Fair Quality: Recommending immediate drying or processing"
        message_ta = "மூன்றாம் தரம் (Grade C): உலர்த்திய பின் விற்பனை செய்ய பரிந்துரைக்கப்படுகிறது"

    return jsonify({
        "success": True,
        "quality_grade": grade,
        "quality_code": code,
        "quality_score": score,
        "defects": defects,
        "moisture": moisture,
        "badge_color": badge_color,
        "message_en": message_en,
        "message_ta": message_ta
    })

# 4. LISTINGS API & LIVE BIDDING
@app.route('/api/listings', methods=['GET', 'POST'])
def handle_listings():
    if request.method == 'POST':
        data = request.get_json() or {}
        
        new_id = f"LOT-2026-{random.randint(8803, 9999)}"
        new_listing = {
            "id": new_id,
            "farmer_name": data.get("farmer_name", "Selvam Perundurai"),
            "farmer_phone": data.get("farmer_phone", "+91 98765 43210"),
            "crop_name": data.get("crop_name", "Paddy Rice"),
            "quantity": Number_or_default(data.get("quantity"), 500),
            "unit": "kg",
            "location": data.get("location", "Erode, Tamil Nadu"),
            "expected_price": Number_or_default(data.get("expected_price"), 45.0),
            "quality_grade": data.get("quality_grade", "Grade A"),
            "quality_code": data.get("quality_code", "GRADE_A_GREEN"),
            "quality_score": Number_or_default(data.get("quality_score"), 94),
            "defects": data.get("defects", "0.5%"),
            "moisture": data.get("moisture", "11.2%"),
            "status": "OPEN_FOR_BIDS",
            "created_at": time.strftime('%Y-%m-%d %H:%M UTC', time.gmtime()),
            "current_highest_bid": Number_or_default(data.get("expected_price"), 45.0),
            "highest_bidder": None,
            "bids": [],
            "escrow": {
                "status": "WAITING_FOR_BIDS",
                "amount": 0,
                "escrow_id": f"ESC-{new_id.split('-')[-1]}-{random.randint(1000, 9999)}",
                "buyer_signature": None,
                "system_signature": None,
                "is_released": False,
                "dispute_deadline_hours": 48
            }
        }
        
        listings_db.insert(0, new_listing)
        
        # Log to Immutable Ledger
        block = ledger.add_block(
            event_type="CROP_LOT_LISTED",
            data={
                "listing_id": new_id,
                "crop": new_listing["crop_name"],
                "quantity": new_listing["quantity"],
                "price": new_listing["expected_price"],
                "grade": new_listing["quality_grade"]
            },
            sms_phone=new_listing["farmer_phone"],
            sms_text=f"[AgroLink] Your {new_listing['quantity']}kg {new_listing['crop_name']} lot ({new_listing['quality_grade']}) is now LIVE for buyer bidding."
        )

        return jsonify({
            "success": True,
            "message": "Crop lot published successfully to Live Market!",
            "listing": new_listing,
            "block_hash": block["hash"]
        })
    else:
        return jsonify({
            "success": True,
            "listings": listings_db
        })

@app.route('/api/bids/place', methods=['POST'])
def place_bid():
    data = request.get_json() or {}
    listing_id = data.get("listing_id")
    bidder_name = data.get("bidder_name", "Verified APMC Buyer")
    bid_amount = float(data.get("bid_amount", 0))

    listing = next((item for item in listings_db if item["id"] == listing_id), None)
    if not listing:
        return jsonify({"success": False, "message": "Listing not found"}), 404

    if bid_amount <= listing["current_highest_bid"]:
        return jsonify({
            "success": False,
            "message": f"Bid must be higher than current top bid ₹{listing['current_highest_bid']}/kg"
        }), 400

    # Non-reductable bid placement
    listing["current_highest_bid"] = bid_amount
    listing["highest_bidder"] = bidder_name
    
    # Automatically transition to Escrow Locked if bid is accepted/winning
    total_val = round(bid_amount * listing["quantity"], 2)
    listing["escrow"]["amount"] = total_val
    listing["escrow"]["status"] = "FUNDS_LOCKED"
    listing["status"] = "ESCROW_LOCKED"

    # Block creation
    block = ledger.add_block(
        event_type="NON_REDUCTABLE_BID_PLACED",
        data={
            "listing_id": listing_id,
            "bidder": bidder_name,
            "bid_amount_per_kg": bid_amount,
            "total_escrow_amount": total_val
        },
        sms_phone=listing["farmer_phone"],
        sms_text=f"[AgroLink Bid Alert] New Top Bid! {bidder_name} bid ₹{bid_amount}/kg for {listing['crop_name']} (Total ₹{total_val:,}). Funds locked in Escrow."
    )

    new_bid_entry = {
        "bidder": bidder_name,
        "amount": bid_amount,
        "timestamp": time.strftime('%H:%M UTC', time.gmtime()),
        "tx_hash": block["hash"][:12] + "..."
    }
    listing["bids"].insert(0, new_bid_entry)

    return jsonify({
        "success": True,
        "message": f"Non-reductable bid of ₹{bid_amount}/kg placed! Escrow locked.",
        "listing": listing,
        "block_hash": block["hash"]
    })

# 5. MULTI-SIG ESCROW TRACKER API
@app.route('/api/escrow/sign', methods=['POST'])
def sign_escrow():
    data = request.get_json() or {}
    listing_id = data.get("listing_id")
    signer_role = data.get("signer", "BUYER") # "BUYER" or "SYSTEM_AUTO_48H"

    listing = next((item for item in listings_db if item["id"] == listing_id), None)
    if not listing:
        return jsonify({"success": False, "message": "Listing not found"}), 404

    escrow = listing["escrow"]
    sig_id = f"SIG_{signer_role}_{int(time.time())}"

    if signer_role == "BUYER":
        escrow["buyer_signature"] = sig_id
        event_name = "ESCROW_BUYER_PHYSICAL_INSPECTION_SIGNED"
        log_msg = f"[AgroLink Escrow] Buyer signed Physical Inspection & Delivery receipt for {listing['id']}."
    else:
        escrow["system_signature"] = sig_id
        event_name = "ESCROW_48H_AUTONOMOUS_SYSTEM_SIGNED"
        log_msg = f"[AgroLink Escrow] 48-Hour Dispute Window expired. Autonomous System signed release for {listing['id']}."

    # Check if both or either signature triggers release
    if escrow["buyer_signature"] or escrow["system_signature"]:
        escrow["status"] = "FUNDS_RELEASED_TO_FARMER"
        escrow["is_released"] = True
        listing["status"] = "COMPLETED_PAYMENT_RELEASED"

        release_text = f"[AgroLink Bank Transfer] 🎉 SUCCESS! Escrow funds ₹{escrow['amount']:,} released to {listing['farmer_name']} Bank Account (Aadhaar Linked UPI/DBT)."
        block = ledger.add_block(
            event_type="ESCROW_FUNDS_RELEASED",
            data={
                "listing_id": listing_id,
                "escrow_amount": escrow["amount"],
                "buyer_sig": escrow["buyer_signature"],
                "system_sig": escrow["system_signature"],
                "recipient": listing["farmer_name"]
            },
            sms_phone=listing["farmer_phone"],
            sms_text=release_text
        )
    else:
        block = ledger.add_block(
            event_type=event_name,
            data={"listing_id": listing_id, "signature": sig_id},
            sms_phone=listing["farmer_phone"],
            sms_text=log_msg
        )

    return jsonify({
        "success": True,
        "message": f"Escrow Digital Signature ({signer_role}) applied successfully!",
        "listing": listing,
        "block_hash": block["hash"]
    })

# 6. LEDGER AUDIT API
@app.route('/api/ledger/audit', methods=['GET'])
def get_ledger_audit():
    is_valid, validation_msg = ledger.is_chain_valid()
    return jsonify({
        "success": True,
        "is_chain_valid": is_valid,
        "validation_message": validation_msg,
        "total_blocks": len(ledger.chain),
        "chain": ledger.get_chain_dict()
    })

# 7. MARKET ADVISOR API
@app.route('/api/advisor/recommendation', methods=['GET'])
def get_market_advisor():
    crop = request.args.get('crop', 'Paddy Rice')
    qty = int(request.args.get('quantity', 500))
    rec = advisor.get_recommendation(crop, qty)
    return jsonify({
        "success": True,
        "recommendation": rec
    })

# 8. SIMULATED SMS LOGS API
@app.route('/api/sms/logs', methods=['GET'])
def get_sms_logs():
    return jsonify({
        "success": True,
        "logs": ledger.sms_logs
    })

def Number_or_default(val, default):
    try:
        return float(val)
    except (ValueError, TypeError):
        return default

if __name__ == '__main__':
    print("[STARTING] AgroLink Secure & Accessible Farmer Platform on http://127.0.0.1:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
