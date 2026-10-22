const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const marketRoutes = require('./routes/marketRoutes');
const cropRoutes = require('./routes/cropRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const offerRoutes = require('./routes/offerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const driverRoutes = require('./routes/driverRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const grievanceRoutes = require('./routes/grievanceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const demandRoutes = require('./routes/demandRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authController = require('./controllers/authController');

app.use('/api/auth', authRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/requirements', marketRoutes);
app.use('/api/analysis', marketRoutes);
app.use('/api/crop-lots', cropRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/requests', offerRoutes);
app.use('/api/buyer/requests', offerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/demands', demandRoutes);
app.use('/api/admin', adminRoutes);
app.get('/api/users', authController.getAllUsers);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'Agro Link Market Backend',
    tagline: 'Connecting Farmers with the Right Markets and Buyers.',
    time: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agrolink-ai';

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2000
    });
    console.log('✅ MongoDB Connected successfully.');
  } catch (err) {
    console.warn('⚠️ Could not connect to MongoDB:', err.message);
    console.warn('⚡ Agro Link Market operating in persistent DB mode!');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Agro Link Market Server running on http://localhost:${PORT}`);
  });
};

startServer();
