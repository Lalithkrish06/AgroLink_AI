const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

// Helper to ensure data directory and db.json exist
const initStore = () => {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const salt = bcrypt.genSaltSync(10);
    const defaultData = {
      users: [
        {
          _id: 'usr_demo_farmer',
          id: 'usr_demo_farmer',
          name: 'Demo Farmer',
          email: 'farmer@agrolink.com',
          phone: '+919876543210',
          mobile: '+919876543210',
          mobileNumber: '+919876543210',
          password: bcrypt.hashSync('farmer123', salt),
          role: 'farmer',
          location: 'Erode, Tamil Nadu',
          district: 'Erode',
          verified: true,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'usr_demo_buyer',
          id: 'usr_demo_buyer',
          name: 'Kamaleshwaran Buyer',
          email: 'buyer@agrolink.com',
          phone: '+919876543211',
          mobile: '+919876543211',
          mobileNumber: '+919876543211',
          password: bcrypt.hashSync('buyer123', salt),
          role: 'buyer',
          location: 'Coimbatore, Tamil Nadu',
          district: 'Coimbatore',
          verified: true,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'usr_demo_driver',
          id: 'usr_demo_driver',
          name: 'Demo Driver',
          email: 'driver@agrolink.com',
          phone: '+919876543212',
          mobile: '+919876543212',
          mobileNumber: '+919876543212',
          password: bcrypt.hashSync('driver123', salt),
          role: 'driver',
          location: 'Salem, Tamil Nadu',
          district: 'Salem',
          verified: true,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'usr_demo_admin',
          id: 'usr_demo_admin',
          name: 'System Administrator',
          email: 'admin@agrolink.com',
          phone: '+919876543213',
          mobile: '+919876543213',
          mobileNumber: '+919876543213',
          password: bcrypt.hashSync('admin123', salt),
          role: 'admin',
          location: 'Chennai, Tamil Nadu',
          district: 'Chennai',
          verified: true,
          createdAt: new Date().toISOString()
        }
      ],
      cropLots: [],
      offers: [],
      transactions: [],
      notifications: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
  }
};

const getDB = () => {
  initStore();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const data = JSON.parse(raw);
    if (!data.users) data.users = [];
    if (!data.cropLots) data.cropLots = [];
    if (!data.offers) data.offers = [];
    if (!data.requests) data.requests = [];
    if (!data.transactions) data.transactions = [];
    if (!data.notifications) data.notifications = [];
    if (!data.markets) data.markets = [];
    if (!data.requirements) data.requirements = [];

    // Ensure Lalith Buyer Account (usr_1788673791617) exists in persistent storage with updated credentials
    let lalithUser = data.users.find(u => (u._id || u.id) === 'usr_1788673791617' || (u.name && u.name.toLowerCase() === 'lalith') || (u.email && u.email.toLowerCase() === 'lalikrish2006@gmail.com'));
    const salt = bcrypt.genSaltSync(10);
    if (!lalithUser) {
      lalithUser = {
        _id: 'usr_1788673791617',
        id: 'usr_1788673791617',
        name: 'Lalith',
        email: 'lalikrish2006@gmail.com',
        phone: '+919876543217',
        mobile: '+919876543217',
        mobileNumber: '+919876543217',
        password: bcrypt.hashSync('123456', salt),
        role: 'buyer',
        location: 'Erode, Tamil Nadu',
        district: 'Erode',
        verified: true,
        createdAt: new Date().toISOString()
      };
      data.users.push(lalithUser);
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    } else {
      lalithUser.email = 'lalikrish2006@gmail.com';
      lalithUser.password = bcrypt.hashSync('123456', salt);
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    }

    // Ensure Lalith Wholesale Market exists for buyerUserId = usr_1788673791617 (DUPLICATE PROTECTION)
    const lalithMarketExists = data.markets.some(m => String(m.buyerId || m.buyerUserId) === 'usr_1788673791617' && (m.marketName || '').toLowerCase().includes('lalith'));
    if (!lalithMarketExists) {
      data.markets.unshift({
        _id: 'mkt_lalith_wholesale',
        id: 'mkt_lalith_wholesale',
        marketId: 'mkt_lalith_wholesale',
        buyerId: 'usr_1788673791617',
        buyerUserId: 'usr_1788673791617',
        buyerName: 'Lalith',
        mobileNumber: '+919876543217',
        email: 'lalith@agrolink.com',
        marketName: 'Lalith Wholesale Market',
        businessName: 'Lalith Wholesale Market Corp',
        location: 'Erode APMC Yard, Tamil Nadu',
        district: 'Erode',
        state: 'Tamil Nadu',
        address: 'APMC Market Complex, Erode',
        latitude: 11.341,
        longitude: 77.7172,
        marketType: 'Wholesale Market',
        modalPrice: 40,
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      });
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    }

    // Ensure Lalith Wholesale Market Crop Requirement exists for Farmer Market Analysis matching
    const lalithReqExists = data.requirements.some(r => String(r.buyerId || r.buyerUserId) === 'usr_1788673791617' && (r.marketName || '').toLowerCase().includes('lalith'));
    if (!lalithReqExists) {
      data.requirements.unshift({
        _id: 'req_lalith_wholesale',
        id: 'req_lalith_wholesale',
        requirementId: 'req_lalith_wholesale',
        marketId: 'mkt_lalith_wholesale',
        marketName: 'Lalith Wholesale Market',
        buyerId: 'usr_1788673791617',
        buyerUserId: 'usr_1788673791617',
        buyerName: 'Lalith',
        buyerMobileNumber: '+919876543217',
        crop: 'Tomato',
        cropName: 'Tomato',
        category: 'Vegetables',
        requiredQuantity: 1000,
        requiredQuantityMin: 1000,
        requiredQuantityMax: 2000,
        unit: 'KG',
        minimumQuality: 'Grade A',
        requiredQualityGrade: 'Grade A',
        maximumPrice: 40,
        maximumBuyingPrice: 40,
        expectedPriceMin: 34,
        expectedPriceMax: 40,
        demandLevel: 'High Demand',
        status: 'ACTIVE',
        requirementStatus: 'ACTIVE',
        dateAdded: '06 Sept 2026',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    }

    // Ensure Buyer B Market (mkt_coimbatore_wholesale for usr_demo_buyer) exists for multi-buyer testing
    const cbeMarketExists = data.markets.some(m => String(m.buyerId || m.buyerUserId) === 'usr_demo_buyer');
    if (!cbeMarketExists) {
      data.markets.unshift({
        _id: 'mkt_coimbatore_wholesale',
        id: 'mkt_coimbatore_wholesale',
        marketId: 'mkt_coimbatore_wholesale',
        buyerId: 'usr_demo_buyer',
        buyerUserId: 'usr_demo_buyer',
        buyerName: 'Kamaleshwaran Buyer',
        mobileNumber: '+919876543211',
        email: 'buyer@agrolink.com',
        marketName: 'Coimbatore APMC Wholesale Market',
        businessName: 'Coimbatore Food Processing Park Ltd',
        location: 'Coimbatore APMC Complex, Tamil Nadu',
        district: 'Coimbatore',
        state: 'Tamil Nadu',
        address: 'APMC Market Complex, Coimbatore',
        latitude: 11.0168,
        longitude: 76.9558,
        marketType: 'Wholesale Market',
        modalPrice: 42,
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      });
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    }

    const cbeReqExists = data.requirements.some(r => String(r.buyerId || r.buyerUserId) === 'usr_demo_buyer');
    if (!cbeReqExists) {
      data.requirements.unshift({
        _id: 'req_coimbatore_wholesale',
        id: 'req_coimbatore_wholesale',
        requirementId: 'req_coimbatore_wholesale',
        marketId: 'mkt_coimbatore_wholesale',
        marketName: 'Coimbatore APMC Wholesale Market',
        buyerId: 'usr_demo_buyer',
        buyerUserId: 'usr_demo_buyer',
        buyerName: 'Kamaleshwaran Buyer',
        buyerMobileNumber: '+919876543211',
        crop: 'Tomato',
        cropName: 'Tomato',
        category: 'Vegetables',
        requiredQuantity: 1500,
        requiredQuantityMin: 1000,
        requiredQuantityMax: 3000,
        unit: 'KG',
        minimumQuality: 'Grade A',
        requiredQualityGrade: 'Grade A',
        maximumPrice: 42,
        maximumBuyingPrice: 42,
        expectedPriceMin: 38,
        expectedPriceMax: 42,
        demandLevel: 'High Demand',
        status: 'ACTIVE',
        requirementStatus: 'ACTIVE',
        dateAdded: '06 Sept 2026',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    }

    return data;
  } catch (e) {
    return { users: [], cropLots: [], offers: [], requests: [], transactions: [], notifications: [], markets: [], requirements: [] };
  }
};

const saveDB = (data) => {
  initStore();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write persistent JSON DB:', e);
  }
};

module.exports = {
  getDB,
  saveDB,
  initStore
};
