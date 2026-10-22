// AgroLink Full-Stack Mobile-First Controller (Problem ID 26132)

let currentLang = 'en'; // 'en' or 'ta'
let currentListingId = 'LOT-2026-8801';
let marketChartInstance = null;

// DUAL LANGUAGE DICTIONARY (ENGLISH & TAMIL)
const I18N = {
  en: {
    'app-title': 'AgroLink Security Core',
    'app-subtitle': 'Problem ID 26132 • Market Linkages & Price Discovery',
    'lang-text': 'தமிழ் (Tamil)',
    'lbl-sms-btn': 'SMS Alerts',
    'lbl-audit-btn': 'Ledger Audit',
    'hero-title': 'Formless Crop Listing & Multi-Sig Escrow',
    'hero-desc': 'Speak crop details, upload a photo for AI quality grading, and lock buyer funds in multi-sig escrow.',
    'btn-hero-voice': 'Formless Voice Input',
    'btn-hero-escrow': 'Multi-Sig Escrow',
    'txt-voice-title': '1. Formless Voice Input & AI Quality Grade',
    'txt-formless-badge': 'Zero Manual Typing',
    'txt-mic-status': 'Tap microphone to speak (Tamil or English)',
    'txt-preset-label': 'Or click a simulated Tamil/English voice command:',
    'txt-cv-title': '📷 Image-Only AI Quality Assessor',
    'txt-cv-sub': 'Upload crop photo for instant computer vision analysis',
    'btn-take-photo': 'Take Photo / Upload Image',
    'btn-sample-photo': 'Analyze Sample Harvest',
    'lbl-qscore': 'Quality Index',
    'lbl-moisture': 'Moisture Level',
    'lbl-defects': 'Defect Rate',
    'txt-preview-title': 'Parsed Listing Data (Auto-Filled)',
    'lbl-crop-name': 'Crop Name',
    'lbl-qty': 'Quantity (kg)',
    'lbl-location': 'Location',
    'lbl-expected-price': 'Expected Price (₹/kg)',
    'txt-btn-publish': 'Publish Crop Lot to Live Market',
    'txt-advisor-title': '2. Smart Waiting Price Discovery Advisor',
    'txt-ai-badge': 'AI Predictive Engine',
    'lbl-select-crop': 'Select Crop for Price Forecast:',
    'lbl-curr-val': 'Sell Today Value',
    'lbl-proj-val': '10-Day Forecast Value',
    'lbl-gain-val': 'Projected Net Gain',
    'lbl-gain-sub': 'Extra Profit by Holding',
    'txt-escrow-title': '3. Bank-Grade Multi-Sig Escrow Tracker & Bidding',
    'txt-bank-badge': 'Multi-Sig Escrow Core',
    'txt-bidding-title': 'Active Market Bids & Non-Reductable Auctions',
    'txt-tracker-title': 'Multi-Sig Escrow Progress Timeline',
    'txt-step1-title': 'Step 1: Funds Locked in Escrow',
    'txt-step1-desc': 'Buyer AgroCorp deposited funds in multi-sig vault upon bid win.',
    'txt-step2-title': 'Step 2: Signature 1 - Buyer Delivery Inspection',
    'txt-step2-desc': 'Buyer signs digital receipt after inspecting physical crop quality at delivery.',
    'btn-sign-buyer': 'Sign & Release Funds (Buyer)',
    'txt-step3-title': 'Step 3: Signature 2 - Autonomous 48H Release',
    'txt-step3-desc': 'Auto-executes if no dispute is filed within 48h dispute timer.',
    'btn-sign-system': 'Simulate 48h Auto-Release',
    'txt-step4-title': 'Step 4: Direct Aadhaar DBT Bank Transfer',
    'txt-step4-desc': 'Instant fund release to Farmer Selvam\'s bank account.'
  },
  ta: {
    'app-title': 'அக்ரோலிங்க் பாதுகாப்பு மையம்',
    'app-subtitle': 'பிரச்சனை ஐடி 26132 • விவசாய சந்தை இணைப்பு & விலை கண்டுபிடிப்பு',
    'lang-text': 'English',
    'lbl-sms-btn': 'SMS செய்திகள்',
    'lbl-audit-btn': 'பிளாக்செயின் தணிக்கை',
    'hero-title': 'குரல் பதிவு பயிர் பட்டியல் & எஸ்க்ரோ பாதுகாப்பு',
    'hero-desc': 'தட்டச்சு செய்யாமல் குரலில் பேசி பதிவு செய்யுங்கள். AI மூலம் தரத்தை அறிந்து எஸ்க்ரோ வங்கியில் நிதியை பாதுகாக்கவும்.',
    'btn-hero-voice': 'குரல் வழி பதிவு',
    'btn-hero-escrow': 'எஸ்க்ரோ வங்கி நிதி',
    'txt-voice-title': '1. படிவமில்லா குரல் பதிவு & தர மதிப்பீடு',
    'txt-formless-badge': 'தட்டச்சு செய்ய தேவையில்லை',
    'txt-mic-status': 'பேச மைக்கை அழுத்தவும் (தமிழ் அல்லது ஆங்கிலம்)',
    'txt-preset-label': 'அல்லது மாதிரி குரல் கட்டளையை அழுத்தவும்:',
    'txt-cv-title': '📷 புகைப்பட AI பயிர் தர சோதனை',
    'txt-cv-sub': 'பயிரின் புகைப்படத்தை பதிவேற்றி உடனடி தரம் அறியவும்',
    'btn-take-photo': 'படம் எடுக்கவும் / பதிவேற்றவும்',
    'btn-sample-photo': 'மாதிரி அறுவடையை சோதிக்கவும்',
    'lbl-qscore': 'தரக் குறியீடு',
    'lbl-moisture': 'ஈரப்பதம்',
    'lbl-defects': 'குறைபாடு சதவீதம்',
    'txt-preview-title': 'தானாக நிரப்பப்பட்ட பயிர் விவரங்கள்',
    'lbl-crop-name': 'பயிர் பெயர்',
    'lbl-qty': 'அளவு (கிலோ)',
    'lbl-location': 'இடம்',
    'lbl-expected-price': 'எதிர்பார்க்கும் விலை (₹/கிலோ)',
    'txt-btn-publish': 'சந்தையில் பயிரை விற்பனைக்கு வெளியிடவும்',
    'txt-advisor-title': '2. ஸ்மார்ட் காத்திருப்பு சந்தை ஆலோசகர்',
    'txt-ai-badge': 'AI விலை கணிப்பு',
    'lbl-select-crop': 'விலை கணிப்பு அறிய பயிரை தேர்ந்தெடுக்கவும்:',
    'lbl-curr-val': 'இன்று விற்றால் மதிப்பு',
    'lbl-proj-val': '10 நாள் கழித்து கணிப்பு மதிப்பு',
    'lbl-gain-val': 'கூடுதல் லாப கணிப்பு',
    'lbl-gain-sub': 'சேமித்து வைப்பதால் கிடைக்கும் கூடுதல் லாபம்',
    'txt-escrow-title': '3. வங்கி நிலை எஸ்க்ரோ நிதி & நேரலை ஏலம்',
    'txt-bank-badge': 'பாதுகாப்பான எஸ்க்ரோ வங்கி',
    'txt-bidding-title': 'நேரலை ஏலக் கோரிக்கைகள் (குறைக்க முடியாத ஏலம்)',
    'txt-tracker-title': 'எஸ்க்ரோ 2-டிஜிட்டல் கையொப்ப காலக்கோடு',
    'txt-step1-title': 'படி 1: எஸ்க்ரோ வங்கியில் நிதி முடக்கப்பட்டது',
    'txt-step1-desc': 'வாங்குபவர் ஏலம் வென்றதும் எஸ்க்ரோ கணக்கில் தொகை டெபாசிட் செய்யப்பட்டது.',
    'txt-step2-title': 'படி 2: கையொப்பம் 1 - வாங்குபவர் பயிர் சரிபார்ப்பு',
    'txt-step2-desc': 'நேரில் பயிர் தரத்தை சரிபார்த்த பின் வாங்குபவர் கையொப்பமிடுகிறார்.',
    'btn-sign-buyer': 'கையொப்பமிட்டு நிதியை விடுவிக்கவும்',
    'txt-step3-title': 'படி 3: கையொப்பம் 2 - தானியங்கி 48 மணிநேர விடுவிப்பு',
    'txt-step3-desc': '48 மணிநேரத்தில் புகார் இல்லையெனில் கணினி தானாகவே நிதியை விடுவிக்கும்.',
    'btn-sign-system': '48 மணிநேர தானியங்கி விடுவிப்பை சோதிக்கவும்',
    'txt-step4-title': 'படி 4: ஆதார் வங்கி கணக்கிற்கு நேரடி பணப்பரிமாற்றம்',
    'txt-step4-desc': 'விவசாயியின் வங்கி கணக்கிற்கு உடனடி பணம் அனுப்பப்பட்டது.'
  }
};

// TOGGLE LANGUAGE FUNCTION
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ta' : 'en';
  const dict = I18N[currentLang];

  for (const [id, text] of Object.entries(dict)) {
    const el = document.getElementById(id);
    if (el) {
      el.innerText = text;
    }
  }

  // Update advisor recommendation text if rendered
  updatePriceAdvisor();
}

// 1. FORMLESS VOICE INPUT CONTROLLER
function toggleVoiceRecording() {
  const btn = document.getElementById('btn-mic');
  const statusEl = document.getElementById('txt-mic-status');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = currentLang === 'ta' ? 'ta-IN' : 'en-IN';
    recognition.interimResults = false;

    btn.classList.add('recording');
    statusEl.innerText = currentLang === 'ta' ? '🎙️ கேட்கிறது... இப்போது பேசுங்கள்!' : '🎙️ Listening... Speak your crop details now!';

    recognition.start();

    recognition.onresult = (event) => {
      btn.classList.remove('recording');
      const transcript = event.results[0][0].transcript;
      simulateVoice(transcript);
    };

    recognition.onerror = () => {
      btn.classList.remove('recording');
      statusEl.innerText = currentLang === 'ta' ? 'குரல் கேட்கவில்லை. மாதிரி பொத்தானை அழுத்தவும்.' : 'Speech not recognized. Please click a sample voice button below.';
    };

    recognition.onend = () => {
      btn.classList.remove('recording');
    };
  } else {
    // Fallback simulation if browser doesn't support Web Speech API
    btn.classList.add('recording');
    statusEl.innerText = 'Simulating Voice Input...';
    setTimeout(() => {
      btn.classList.remove('recording');
      simulateVoice('I have 500kg of Rice in Erode for 45 rupees');
    }, 1200);
  }
}

function simulateVoice(transcript) {
  document.getElementById('transcript-container').style.display = 'block';
  document.getElementById('txt-transcript-result').innerText = `"${transcript}"`;

  fetch('/api/voice/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript: transcript })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      const p = data.parsed_data;
      document.getElementById('inp-crop-name').value = p.crop_name;
      document.getElementById('inp-quantity').value = p.quantity;
      document.getElementById('inp-location').value = p.location;
      document.getElementById('inp-price').value = p.expected_price;

      document.getElementById('txt-mic-status').innerText = currentLang === 'ta' 
        ? `✓ குரல் வெற்றிகரமாக நிரப்பப்பட்டது! (${p.crop_name}, ${p.quantity}kg)`
        : `✓ Voice Auto-Populated Successfully! (${p.crop_name}, ${p.quantity}kg)`;

      // Update Advisor crop selection automatically
      const selAdvisor = document.getElementById('sel-advisor-crop');
      if (selAdvisor) {
        selAdvisor.value = p.crop_name;
        updatePriceAdvisor();
      }
    }
  });
}

// 2. COMPUTER VISION IMAGE QUALITY GRADING
function handleImageUpload(e) {
  triggerMockCVGrading();
}

function triggerMockCVGrading() {
  fetch('/api/quality/grade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_sample: true })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      const badgeBox = document.getElementById('badge-quality-grade');
      badgeBox.style.backgroundColor = data.badge_color;

      document.getElementById('txt-grade-letter').innerText = data.quality_grade;
      document.getElementById('txt-grade-title').innerText = data.quality_code.replace('_', ' ');

      document.getElementById('val-qscore').innerText = `${data.quality_score} / 100`;
      document.getElementById('val-moisture').innerText = data.moisture;
      document.getElementById('val-defects').innerText = data.defects;

      document.getElementById('txt-quality-msg').innerText = currentLang === 'ta' ? data.message_ta : data.message_en;
    }
  });
}

// 3. PUBLISH CROP LISTING
function publishCropListing() {
  const crop = document.getElementById('inp-crop-name').value;
  const qty = parseFloat(document.getElementById('inp-quantity').value);
  const loc = document.getElementById('inp-location').value;
  const price = parseFloat(document.getElementById('inp-price').value);

  const payload = {
    farmer_name: 'Selvam Perundurai',
    farmer_phone: '+91 98765 43210',
    crop_name: crop,
    quantity: qty,
    location: loc,
    expected_price: price,
    quality_grade: document.getElementById('txt-grade-letter').innerText
  };

  fetch('/api/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(currentLang === 'ta' ? '🎉 உங்கள் பயிர் வெற்றிகரமாக நேரலை சந்தையில் வெளியிடப்பட்டது!' : '🎉 Crop lot published to Live Market successfully!');
      fetchListings();
      fetchSmsLogs();
      scrollToModule('sec-escrow-module');
    }
  });
}

// 4. SMART WAITING PRICE ADVISOR & CHART.JS
function updatePriceAdvisor() {
  const crop = document.getElementById('sel-advisor-crop').value;
  const qty = parseFloat(document.getElementById('inp-quantity').value || 500);

  fetch(`/api/advisor/recommendation?crop=${encodeURIComponent(crop)}&quantity=${qty}`)
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      const rec = data.recommendation;
      const banner = document.getElementById('rec-banner-box');
      const actionBadge = document.getElementById('rec-action-badge');
      const reasonTxt = document.getElementById('rec-reason-text');
      const iconBox = document.getElementById('rec-icon');

      if (rec.action === 'HOLD') {
        banner.className = 'recommendation-card hold-card';
        iconBox.innerText = '👍';
        actionBadge.innerText = currentLang === 'ta' ? rec.action_ta : rec.action_en;
      } else {
        banner.className = 'recommendation-card sell-card';
        iconBox.innerText = '⚠️';
        actionBadge.innerText = currentLang === 'ta' ? rec.action_ta : rec.action_en;
      }

      reasonTxt.innerText = currentLang === 'ta' ? rec.reason_ta : rec.reason_en;

      document.getElementById('val-curr-total').innerText = `₹${rec.current_total_value.toLocaleString()}`;
      document.getElementById('val-curr-rate').innerText = `@ ₹${rec.current_price_per_kg.toFixed(2)} / kg`;

      document.getElementById('val-proj-total').innerText = `₹${rec.projected_10d_total_value.toLocaleString()}`;
      document.getElementById('val-proj-rate').innerText = `@ ₹${rec.projected_10d_price_per_kg.toFixed(2)} / kg (${rec.price_change_percent > 0 ? '+' : ''}${rec.price_change_percent}%)`;

      const netGainEl = document.getElementById('val-net-profit');
      if (rec.projected_profit_loss >= 0) {
        netGainEl.innerText = `+₹${rec.projected_profit_loss.toLocaleString()}`;
        netGainEl.className = 'fin-amount green-text';
      } else {
        netGainEl.innerText = `-₹${Math.abs(rec.projected_profit_loss).toLocaleString()}`;
        netGainEl.className = 'fin-amount red-text';
      }

      renderTrendChart(rec.crop_name, rec.historical_trend, rec.projected_10d_price_per_kg);
    }
  });
}

function renderTrendChart(cropName, history, projected) {
  const ctx = document.getElementById('marketTrendChart').getContext('2d');
  const labels = ['Day -5', 'Day -4', 'Day -3', 'Day -2', 'Day -1', 'Today', 'Forecast (+10D)'];
  const chartData = [...history, projected];

  if (marketChartInstance) {
    marketChartInstance.destroy();
  }

  marketChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: `${cropName} Market Price Trend (₹/kg)`,
        data: chartData,
        borderColor: '#2d6a4f',
        backgroundColor: 'rgba(45, 106, 79, 0.1)',
        fill: true,
        tension: 0.3,
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: '#1b4332'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, labels: { font: { weight: 'bold' } } }
      },
      scales: {
        y: { beginAtZero: false, ticks: { font: { weight: 'bold' } } }
      }
    }
  });
}

// 5. FETCH & RENDER LISTINGS / LIVE BIDDING
function fetchListings() {
  fetch('/api/listings')
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      const container = document.getElementById('container-listings-list');
      container.innerHTML = '';

      data.listings.forEach((item, idx) => {
        const isSelected = item.id === currentListingId;
        const card = document.createElement('div');
        card.className = `listing-item-card ${isSelected ? 'active-selected' : ''}`;
        card.onclick = () => selectListing(item.id);

        card.innerHTML = `
          <div class="item-header">
            <span class="item-id">${item.id} • ${item.crop_name} (${item.quantity}${item.unit})</span>
            <span class="item-badge">${item.quality_grade}</span>
          </div>
          <div class="item-body">
            <div>📍 <strong>${item.location}</strong> | Farmer: <strong>${item.farmer_name}</strong></div>
            <div>💰 Expected: ₹${item.expected_price}/kg | <span class="green-text">Current Top Bid: ₹${item.current_highest_bid}/kg</span></div>
            <div style="font-size:0.75rem; color:#6b7280; margin-top:0.3rem;">Top Bidder: ${item.highest_bidder || 'No bids yet'}</div>
          </div>
          <div class="bid-action-box" onclick="event.stopPropagation()">
            <input type="number" id="inp-bid-${item.id}" placeholder="Enter bid (min ₹${(item.current_highest_bid + 1).toFixed(2)})" class="accessible-input bid-input">
            <button class="btn-primary bid-btn" onclick="submitBid('${item.id}')">Place Secure Bid</button>
          </div>
        `;
        container.appendChild(card);
      });
    }
  });
}

function selectListing(id) {
  currentListingId = id;
  fetchListings();
}

function submitBid(id) {
  const inp = document.getElementById(`inp-bid-${id}`);
  const amount = parseFloat(inp.value);

  if (!amount || isNaN(amount)) {
    alert('Please enter a valid bid amount!');
    return;
  }

  fetch('/api/bids/place', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      listing_id: id,
      bidder_name: 'Verified APMC Buyer',
      bid_amount: amount
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(`🎉 Non-Reductable Bid ₹${amount}/kg placed! Funds locked in Escrow. Hash: ${data.block_hash.substring(0, 10)}...`);
      fetchListings();
      fetchSmsLogs();
    } else {
      alert(`❌ ${data.message}`);
    }
  });
}

// 6. MULTI-SIG ESCROW SIGNATURES
function signEscrow(signerRole) {
  fetch('/api/escrow/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      listing_id: currentListingId,
      signer: signerRole
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(`✓ Escrow Digital Signature (${signerRole}) confirmed! Ledger updated.`);
      updateEscrowTimelineUI(data.listing.escrow);
      fetchSmsLogs();
    }
  });
}

function updateEscrowTimelineUI(escrow) {
  const step2 = document.getElementById('step-2');
  const step3 = document.getElementById('step-3');
  const step4 = document.getElementById('step-4');

  if (escrow.buyer_signature) {
    step2.className = 'timeline-step completed';
    step2.querySelector('h5').innerText = 'Step 2: Buyer Signature Confirmed ✓';
  }
  if (escrow.system_signature) {
    step3.className = 'timeline-step completed';
    step3.querySelector('h5').innerText = 'Step 3: Autonomous System Signature Confirmed ✓';
  }
  if (escrow.is_released) {
    step4.className = 'timeline-step completed';
    step4.querySelector('h5').innerText = 'Step 4: Escrow Funds Transferred to Aadhaar UPI ✓';
  }
}

// 7. BLOCKCHAIN AUDIT EXPLORER MODAL
function openLedgerModal() {
  document.getElementById('ledger-modal').style.display = 'flex';
  verifyLedgerIntegrity();
}

function closeLedgerModal() {
  document.getElementById('ledger-modal').style.display = 'none';
}

function verifyLedgerIntegrity() {
  fetch('/api/ledger/audit')
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById('lbl-audit-status').innerText = `STATUS: ${data.validation_message.toUpperCase()}`;
      const container = document.getElementById('blockchain-blocks-container');
      container.innerHTML = '';

      data.chain.forEach(block => {
        const card = document.createElement('div');
        card.className = 'block-card';
        card.innerHTML = `
          <div class="block-header">
            <span>BLOCK #${block.index} [${block.event_type}]</span>
            <span>${block.timestamp}</span>
          </div>
          <div>Previous Hash: <span class="hash-val">${block.previous_hash}</span></div>
          <div>Block Hash: <span class="hash-val" style="font-weight:bold;">${block.hash}</span></div>
          <div style="margin-top:0.3rem; color:#374151;">Payload: ${JSON.stringify(block.data)}</div>
        `;
        container.appendChild(card);
      });
    }
  });
}

// 8. SMS FEATURE PHONE DRAWER
function toggleSmsDrawer() {
  const drawer = document.getElementById('sms-drawer');
  drawer.classList.toggle('open');
  if (drawer.classList.contains('open')) {
    fetchSmsLogs();
  }
}

function fetchSmsLogs() {
  fetch('/api/sms/logs')
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      const container = document.getElementById('sms-logs-container');
      container.innerHTML = '';

      document.getElementById('sms-badge-count').innerText = data.logs.length;

      data.logs.forEach(log => {
        const bubble = document.createElement('div');
        bubble.className = 'sms-bubble';
        bubble.innerHTML = `
          <div class="sms-meta">
            <span>📲 To: ${log.recipient}</span>
            <span>${log.timestamp}</span>
          </div>
          <div class="sms-text">${log.message}</div>
        `;
        container.appendChild(bubble);
      });
    }
  });
}

// 9. PASSWORDLESS AUTH MODAL
function openAuthModal() {
  document.getElementById('auth-modal').style.display = 'flex';
}

function closeAuthModal() {
  document.getElementById('auth-modal').style.display = 'none';
}

function sendAuthOtp() {
  const phone = document.getElementById('inp-auth-phone').value;
  fetch('/api/auth/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: phone })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(`[Demo Gateway] OTP sent to ${phone}! Demo OTP Code: ${data.demo_otp}`);
      document.getElementById('otp-input-group').style.display = 'block';
      document.getElementById('inp-auth-otp').value = data.demo_otp;
    }
  });
}

function verifyAuthOtp() {
  const phone = document.getElementById('inp-auth-phone').value;
  const otp = document.getElementById('inp-auth-otp').value;

  fetch('/api/auth/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: phone, otp: otp })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(`🎉 Aadhaar Auth Verified! Block Hash: ${data.block_hash.substring(0, 10)}...`);
      document.getElementById('user-display-name').innerText = data.farmer.name;
      closeAuthModal();
      fetchSmsLogs();
    }
  });
}

function verifyBiometric(type) {
  fetch('/api/auth/biometric', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bio_type: type })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(`🎉 Biometric Match 100%! Aadhaar authenticated.`);
      document.getElementById('user-display-name').innerText = data.farmer.name;
      closeAuthModal();
      fetchSmsLogs();
    }
  });
}

function scrollToModule(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

// INITIAL LOAD
document.addEventListener('DOMContentLoaded', () => {
  updatePriceAdvisor();
  fetchListings();
  fetchSmsLogs();
});
