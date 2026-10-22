const seedUsers = [
  {
    _id: 'usr_farmer_kamalesh',
    name: 'Kamalesh',
    email: 'kamalesh.farmer@agrolink.com',
    phone: '+91 9876543210',
    password: '$2a$10$YourHashedPasswordOrFallbackDummy',
    role: 'farmer',
    location: 'Erode, Tamil Nadu',
    district: 'Erode',
    verified: true
  },
  {
    _id: 'usr_buyer_kamalesh',
    name: 'Kamalesh',
    email: 'kamalesh.buyer@agrolink.com',
    phone: '+91 9876543210', // SAME personal phone number!
    password: '$2a$10$YourHashedPasswordOrFallbackDummy',
    role: 'buyer',
    location: 'Salem, Tamil Nadu',
    district: 'Salem',
    verified: true
  },
  {
    _id: 'usr_admin_agrolink',
    name: 'AgroLink Admin',
    email: 'admin@agrolink.demo',
    phone: '+91 9876543212',
    password: '$2a$10$YourHashedPasswordOrFallbackDummy',
    role: 'admin',
    location: 'Chennai, Tamil Nadu',
    district: 'Chennai',
    verified: true
  }
];

const seedMarkets = [
  { marketName: 'Erode Regulated Market', location: 'Erode', cropName: 'Turmeric', currentPrice: 3200, demand: 'High', distanceKm: 45, transportCostPerQuintal: 45 },
  { marketName: 'Salem Central Market', location: 'Salem', cropName: 'Turmeric', currentPrice: 3050, demand: 'Medium', distanceKm: 70, transportCostPerQuintal: 70 },
  { marketName: 'Coimbatore Wholesale Market', location: 'Coimbatore', cropName: 'Turmeric', currentPrice: 3100, demand: 'High', distanceKm: 110, transportCostPerQuintal: 110 }
];

module.exports = { seedUsers, seedMarkets };
