const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Market = require('./models/Market');
const Buyer = require('./models/Buyer');
const CropLot = require('./models/CropLot');
const Offer = require('./models/Offer');
const Transaction = require('./models/Transaction');
const Logistics = require('./models/Logistics');
const Grievance = require('./models/Grievance');

const {
  seedMarkets,
  seedUsers,
  seedBuyers,
  seedCropLots,
  seedOffers,
  seedTransactions,
  seedLogistics,
  seedGrievances
} = require('./data/seedData');

const seedDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://localhost:27017/agrolink-ai';
    console.log(`Connecting to MongoDB at ${connStr}...`);
    await mongoose.connect(connStr);
    console.log('MongoDB connected successfully!');

    // Clear existing collections
    await User.deleteMany({});
    await Market.deleteMany({});
    await Buyer.deleteMany({});
    await CropLot.deleteMany({});
    await Offer.deleteMany({});
    await Transaction.deleteMany({});
    await Logistics.deleteMany({});
    await Grievance.deleteMany({});
    console.log('Cleared existing collection data.');

    // Seed Users with hashed passwords
    const usersWithHash = await Promise.all(
      seedUsers.map(async (u) => {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        return { ...u, password: hashedPassword };
      })
    );
    const createdUsers = await User.insertMany(usersWithHash);
    console.log(`Seeded ${createdUsers.length} users.`);

    const farmerUser = createdUsers.find((u) => u.role === 'farmer');
    const buyerUser = createdUsers.find((u) => u.role === 'buyer');

    // Seed Markets
    await Market.insertMany(seedMarkets);
    console.log(`Seeded ${seedMarkets.length} market records.`);

    // Seed Buyers
    const buyersWithUserId = seedBuyers.map((b) => ({
      ...b,
      userId: buyerUser ? buyerUser._id : createdUsers[1]._id
    }));
    await Buyer.insertMany(buyersWithUserId);
    console.log(`Seeded ${seedBuyers.length} buyers.`);

    // Seed CropLots
    const cropLotsWithFarmer = seedCropLots.map((c) => ({
      ...c,
      farmerId: farmerUser ? farmerUser._id : createdUsers[0]._id
    }));
    const createdCropLots = await CropLot.insertMany(cropLotsWithFarmer);
    console.log(`Seeded ${createdCropLots.length} crop lots.`);

    // Seed Offers
    const offersWithIds = seedOffers.map((o, idx) => ({
      ...o,
      buyerId: buyerUser ? buyerUser._id : createdUsers[1]._id,
      farmerId: farmerUser ? farmerUser._id : createdUsers[0]._id,
      cropLotId: createdCropLots[idx % createdCropLots.length]._id
    }));
    const createdOffers = await Offer.insertMany(offersWithIds);
    console.log(`Seeded ${createdOffers.length} buyer offers.`);

    // Seed Transactions
    const txsWithIds = seedTransactions.map((t, idx) => ({
      ...t,
      offerId: createdOffers[idx % createdOffers.length]._id,
      farmerId: farmerUser ? farmerUser._id : createdUsers[0]._id,
      buyerId: buyerUser ? buyerUser._id : createdUsers[1]._id,
      cropLotId: createdCropLots[idx % createdCropLots.length]._id
    }));
    await Transaction.insertMany(txsWithIds);
    console.log(`Seeded ${seedTransactions.length} transactions.`);

    // Seed Logistics
    await Logistics.insertMany(seedLogistics);
    console.log(`Seeded ${seedLogistics.length} logistics items.`);

    // Seed Grievances
    const grievancesWithUser = seedGrievances.map((g) => ({
      ...g,
      userId: farmerUser ? farmerUser._id : createdUsers[0]._id
    }));
    await Grievance.insertMany(grievancesWithUser);
    console.log(`Seeded ${seedGrievances.length} grievances.`);

    console.log('✅ AgroLink AI database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
