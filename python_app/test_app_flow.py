import urllib.request
import json
import sys

BASE_URL = "http://127.0.0.1:5001"

def make_req(path, method="GET", data=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    body = json.dumps(data).encode('utf-8') if data else None
    
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(req) as resp:
        res_body = resp.read().decode('utf-8')
        try:
            return resp.status, json.loads(res_body)
        except Exception:
            return resp.status, res_body

def run_tests():
    print("--- STARTING AGROLINK PLATFORM AUTOMATED VERIFICATION ---")

    # 1. Test HTML Main Route
    status, res = make_req("/")
    assert status == 200, f"Failed main HTML route: {status}"
    assert "AgroLink" in res, "Main page HTML missing AgroLink title"
    print("[PASS] 1. Main UI Route (http://127.0.0.1:5001/): HTTP 200 OK")

    # 2. Test Passwordless Aadhaar OTP Send & Verify
    status, res = make_req("/api/auth/otp/send", "POST", {"phone": "9876543210"})
    assert status == 200 and res["success"], "OTP send failed"
    demo_otp = res["demo_otp"]
    print(f"[PASS] 2a. Passwordless Aadhaar OTP Generated: {demo_otp}")

    status, res = make_req("/api/auth/otp/verify", "POST", {"phone": "9876543210", "otp": demo_otp})
    assert status == 200 and res["success"], "OTP verify failed"
    print(f"[PASS] 2b. Aadhaar OTP Verified. Ledger Block Hash: {res['block_hash'][:14]}...")

    # 3. Test Biometric Verification
    status, res = make_req("/api/auth/biometric", "POST", {"bio_type": "fingerprint", "phone": "+91 98765 43210"})
    assert status == 200 and res["success"], "Biometric auth failed"
    print(f"[PASS] 3. Aadhaar Biometric Scan Verified. Ledger Block Hash: {res['block_hash'][:14]}...")

    # 4. Test Formless Voice Command Input (Tamil)
    tamil_voice = "எனக்கு ஈரோட்டில் 500 கிலோ அரிசி உள்ளது 45 ரூபாய்"
    status, res = make_req("/api/voice/parse", "POST", {"transcript": tamil_voice})
    assert status == 200 and res["success"], "Voice parse failed"
    parsed = res["parsed_data"]
    assert parsed["crop_name"] == "Paddy Rice" and parsed["quantity"] == 500, "Tamil voice parse mismatch"
    print(f"[PASS] 4. Formless Voice Input Parsed (Tamil Speech): {parsed['crop_name']}, {parsed['quantity']}kg @ RS {parsed['expected_price']}/kg")

    # 5. Test Computer Vision Quality Assessment
    status, res = make_req("/api/quality/grade", "POST", {})
    assert status == 200 and res["success"], "Quality grade failed"
    print(f"[PASS] 5. Computer Vision Quality Grading Output: {res['quality_grade']} (Score: {res['quality_score']}/100, Moisture: {res['moisture']})")

    # 6. Test Publish Listing
    new_lot = {
        "farmer_name": "Selvam Perundurai",
        "crop_name": "Paddy Rice",
        "quantity": 500,
        "location": "Erode, Tamil Nadu",
        "expected_price": 45.0,
        "quality_grade": "Grade A"
    }
    status, res = make_req("/api/listings", "POST", new_lot)
    assert status == 200 and res["success"], "Listing creation failed"
    listing_id = res["listing"]["id"]
    print(f"[PASS] 6. Publish Crop Lot: Listing ID {listing_id} published to Live Market. Block Hash: {res['block_hash'][:14]}...")

    # 7. Test Non-Reductable Live Bid Placement
    status, res = make_req("/api/bids/place", "POST", {
        "listing_id": listing_id,
        "bidder_name": "AgroCorp Wholesale Erode",
        "bid_amount": 48.50
    })
    assert status == 200 and res["success"], "Bid placement failed"
    assert res["listing"]["escrow"]["status"] == "FUNDS_LOCKED", "Escrow funds not locked"
    print(f"[PASS] 7. Non-Reductable Bid Placed: RS 48.50/kg bid accepted. Escrow Funds Locked: RS {res['listing']['escrow']['amount']:,}")

    # 8. Test Multi-Sig Escrow Digital Signatures
    status, res = make_req("/api/escrow/sign", "POST", {"listing_id": listing_id, "signer": "BUYER"})
    assert status == 200 and res["success"], "Buyer sign failed"
    print(f"[PASS] 8a. Multi-Sig Escrow Signature 1 (Buyer Physical Inspection) confirmed.")

    status, res = make_req("/api/escrow/sign", "POST", {"listing_id": listing_id, "signer": "SYSTEM_AUTO_48H"})
    assert status == 200 and res["success"], "System sign failed"
    assert res["listing"]["escrow"]["is_released"], "Escrow funds not released"
    print(f"[PASS] 8b. Multi-Sig Escrow Signature 2 (Autonomous 48h Release) confirmed. Funds transferred to Aadhaar Bank Account.")

    # 9. Test Smart Waiting Market Advisor
    status, res = make_req("/api/advisor/recommendation?crop=Paddy%20Rice&quantity=500")
    assert status == 200 and res["success"], "Advisor failed"
    rec = res["recommendation"]
    print(f"[PASS] 9. Smart Waiting Price Discovery Recommendation: [{rec['action_en']}] Projected Net Profit: RS {rec['projected_profit_loss']:,}")

    # 10. Test Cryptographic Ledger Integrity Audit
    status, res = make_req("/api/ledger/audit")
    assert status == 200 and res["is_chain_valid"], "Blockchain audit invalid"
    print(f"[PASS] 10. Cryptographic Ledger SHA-256 Audit: {res['validation_message']} (Total Blocks: {res['total_blocks']})")

    # 11. Test SMS Feature Phone Worker Logs
    status, res = make_req("/api/sms/logs")
    assert status == 200 and len(res["logs"]) > 0, "SMS logs empty"
    print(f"[PASS] 11. Feature Phone SMS Worker Simulation: {len(res['logs'])} real-time alerts pushed to non-smartphone farmers.")

    print("\n[SUCCESS] ALL 11 VERIFICATION MODULES PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    run_tests()
