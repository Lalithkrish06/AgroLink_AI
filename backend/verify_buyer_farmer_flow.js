const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ statusCode: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', err => reject(err));
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function run() {
  console.log('--- STARTING REPEATABLE VERIFICATION ---');

  const ts = Date.now();
  const buyerPhone = String(Math.floor(6000000000 + Math.random() * 3000000000));
  const farmerPhone = String(Math.floor(6000000000 + Math.random() * 3000000000));

  // 1. Register Buyer
  const buyerReg = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Ravi Kumar',
    email: `ravikumar.${ts}@test.com`,
    password: 'password123',
    role: 'buyer',
    phone: buyerPhone,
    location: 'Erode, Tamil Nadu'
  });
  console.log('Buyer Registration:', buyerReg.statusCode, buyerReg.data?.user?.name || buyerReg.data?.message);
  const buyerToken = buyerReg.data?.token;
  const buyerUserId = buyerReg.data?.user?.id || buyerReg.data?.user?._id;

  // 2. Buyer Creates Market Profile
  const marketRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/markets',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${buyerToken}`
    }
  }, {
    marketName: 'Erode Wholesale Market',
    location: 'Erode, Tamil Nadu',
    contactPerson: 'Ravi Kumar',
    phone: buyerPhone
  });
  const createdMarket = marketRes.data?.market || marketRes.data?.data;
  console.log('Market Creation:', marketRes.statusCode, createdMarket?.marketName || marketRes.data?.message);
  const marketId = createdMarket?.id || createdMarket?._id;

  // 3. Buyer Adds Crop Requirement
  const reqRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/markets/requirements',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${buyerToken}`
    }
  }, {
    marketId: marketId,
    cropName: 'Tomato',
    requiredQuantity: 1000,
    minimumQuality: 'Grade A',
    maximumBuyingPrice: 40,
    demandLevel: 'High Demand',
    status: 'ACTIVE'
  });
  const createdReq = reqRes.data?.requirement || reqRes.data?.data;
  console.log('Requirement Creation:', reqRes.statusCode, createdReq?.cropName || reqRes.data?.message);
  const requirementId = createdReq?.id || createdReq?._id;

  // 4. Register Farmer
  const farmerReg = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Selvam Farmer',
    email: `selvam.${ts}@test.com`,
    password: 'password123',
    role: 'farmer',
    phone: farmerPhone,
    location: 'Salem, Tamil Nadu'
  });
  console.log('Farmer Registration:', farmerReg.statusCode, farmerReg.data?.user?.name || farmerReg.data?.message);
  const farmerToken = farmerReg.data?.token;

  // 5. Farmer Requests Market Analysis Recommendations
  const recRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: `/api/crop-lots/recommendations/lot_active?cropName=Tomato&quantity=1000&grade=Grade%20A`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${farmerToken}`
    }
  });
  console.log('Market Analysis Recommendations Status:', recRes.statusCode);
  const recommendations = Array.isArray(recRes.data) ? recRes.data : (recRes.data?.data || []);
  console.log('Recommendations Count:', recommendations.length);
  if (recommendations.length > 0) {
    const rec = recommendations[0];
    console.log('First Recommendation Details:');
    console.log('  Buyer Name:', rec.buyerName);
    console.log('  Market Name:', rec.marketName);
    console.log('  Buyer User ID:', rec.buyerUserId);
    console.log('  Market ID:', rec.marketId);
    console.log('  Requirement ID:', rec.requirementId);
    console.log('  Crop Name:', rec.cropName);
    console.log('  Max Price:', rec.maximumPrice);
    
    // Check if dummy buyers are present
    const hasDummy = recommendations.some(r => ['K. Ramesh', 'S. Varma', 'M. Chandran'].includes(r.buyerName));
    console.log('  Contains Dummy Buyers?:', hasDummy ? 'YES (FAIL)' : 'NO (PASS)');
  } else {
    console.log('❌ ERROR: Recommendations count is 0!');
  }

  // 6. Farmer Sends Crop Request
  const offerRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/offers',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${farmerToken}`
    }
  }, {
    buyerUserId: buyerUserId,
    marketId: marketId,
    requirementId: requirementId,
    cropLotId: 'lot_active',
    farmerName: 'Selvam Farmer',
    cropName: 'Tomato',
    quantity: 800,
    quality: 'Grade A',
    expectedPrice: 38,
    farmerLocation: 'Salem, Tamil Nadu'
  });
  console.log('Crop Request Sent Status:', offerRes.statusCode, offerRes.data?.message);
  const createdOffer = offerRes.data?.offer || offerRes.data?.data;
  const requestId = createdOffer?.id || createdOffer?._id;

  // 7. Buyer Receives Request
  const buyerOffersRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: `/api/offers?buyerId=${buyerUserId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${buyerToken}`
    }
  });
  const offersList = Array.isArray(buyerOffersRes.data) ? buyerOffersRes.data : (buyerOffersRes.data?.data || []);
  console.log('Buyer Offers Received Count:', offersList.length);
  const receivedReq = offersList.find(o => (o.id || o._id || o.requestId) === requestId);
  console.log('Received Request found in Buyer inbox?:', !!receivedReq);

  // 8. Buyer Accepts Request
  const acceptRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: `/api/offers/${requestId}/accept`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${buyerToken}`
    }
  }, {
    status: 'ACCEPTED'
  });
  console.log('Buyer Accept Offer Status:', acceptRes.statusCode, acceptRes.data?.message);

  // 9. Check Farmer Notifications & Transactions
  const notifRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/notifications',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${farmerToken}`
    }
  });
  const notifs = Array.isArray(notifRes.data) ? notifRes.data : (notifRes.data?.data || []);
  console.log('Farmer Notifications Count:', notifs.length);
  console.log('Latest Farmer Notification:', notifs[0]?.message);

  const transRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/transactions',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${farmerToken}`
    }
  });
  const transList = Array.isArray(transRes.data) ? transRes.data : (transRes.data?.data || []);
  console.log('Farmer Transactions Count:', transList.length);
  const latestTrans = transList[0];
  if (latestTrans) {
    console.log('Transaction Details:');
    console.log('  Transaction ID:', latestTrans.id || latestTrans._id || latestTrans.transactionId);
    console.log('  Buyer Name:', latestTrans.buyerName);
    console.log('  Market Name:', latestTrans.marketName);
    console.log('  Farmer Name:', latestTrans.farmerName);
    console.log('  Crop Name:', latestTrans.cropName);
    console.log('  Quantity:', latestTrans.quantity);
    console.log('  Agreed Price:', latestTrans.agreedPrice);
    console.log('  Total Amount:', latestTrans.totalAmount);
    console.log('  Status:', latestTrans.status);
  }

  console.log('--- REPEATABLE VERIFICATION COMPLETE ---');
}

run().catch(console.error);
