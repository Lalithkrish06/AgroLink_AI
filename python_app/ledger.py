import hashlib
import json
import time

class Block:
    def __init__(self, index, timestamp, event_type, data, previous_hash='0'*64):
        self.index = index
        self.timestamp = timestamp
        self.event_type = event_type
        self.data = data
        self.previous_hash = previous_hash
        self.nonce = 0
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "event_type": self.event_type,
            "data": self.data,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode('utf-8')).hexdigest()

    def to_dict(self):
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "event_type": self.event_type,
            "data": self.data,
            "previous_hash": self.previous_hash,
            "hash": self.hash,
            "nonce": self.nonce
        }

class ImmutableLedger:
    def __init__(self):
        self.chain = []
        self.sms_logs = []
        self.create_genesis_block()

    def create_genesis_block(self):
        genesis_block = Block(
            index=0,
            timestamp=time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime()),
            event_type="GENESIS_BLOCK",
            data={"message": "AgroLink Immutable Multi-Sig Escrow Ledger Initialized", "network": "Mainnet-V1-Audit"},
            previous_hash="0000000000000000000000000000000000000000000000000000000000000000"
        )
        self.chain.append(genesis_block)
        self.add_sms_log("SYSTEM", "Aadhaar Escrow Security Core Initialized. Network status: SECURE.")

    def get_latest_block(self):
        return self.chain[-1]

    def add_block(self, event_type, data, sms_phone=None, sms_text=None):
        previous_block = self.get_latest_block()
        new_block = Block(
            index=len(self.chain),
            timestamp=time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime()),
            event_type=event_type,
            data=data,
            previous_hash=previous_block.hash
        )
        # Simple proof-of-work simulation (hash starts with 0)
        while not new_block.hash.startswith('0'):
            new_block.nonce += 1
            new_block.hash = new_block.calculate_hash()

        self.chain.append(new_block)

        if sms_text:
            self.add_sms_log(sms_phone or "FARMER", sms_text)

        return new_block.to_dict()

    def add_sms_log(self, recipient, message):
        log_entry = {
            "id": f"SMS_{int(time.time() * 1000)}",
            "timestamp": time.strftime('%H:%M:%S', time.localtime()),
            "recipient": recipient,
            "message": message,
            "status": "DELIVERED"
        }
        self.sms_logs.insert(0, log_entry)
        if len(self.sms_logs) > 30:
            self.sms_logs.pop()

    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]

            if current_block.hash != current_block.calculate_hash():
                return False, f"Hash mismatch at block index {current_block.index}"

            if current_block.previous_hash != previous_block.hash:
                return False, f"Previous hash mismatch at block index {current_block.index}"

        return True, "Blockchain audit verification passed: 100% Tamper-Proof"

    def get_chain_dict(self):
        return [block.to_dict() for block in self.chain]
