const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// All admin routes require auth + admin role verification
router.use(authMiddleware, adminMiddleware);

// Admin Monitoring Endpoints
router.get('/dashboard', adminController.getDashboardStats);
router.get('/stats', adminController.getStats);
router.get('/farmers', adminController.getFarmers);
router.get('/buyers', adminController.getBuyers);
router.get('/crop-lots', adminController.getCropLots);
router.get('/requests', adminController.getFarmerRequests);
router.get('/markets', adminController.getMarkets);
router.get('/requirements', adminController.getRequirements);
router.get('/transactions', adminController.getTransactions);
router.get('/transactions/:transactionId', adminController.getTransactionTrace);
router.get('/payments', adminController.getPayments);
router.post('/payments/override', adminController.overridePayment);
router.get('/logistics', adminController.getLogistics);
router.get('/grievances', adminController.getGrievances);
router.put('/grievances/:id', adminController.updateGrievanceStatus);
router.get('/analytics', adminController.getAnalytics);
router.get('/notifications', adminController.getNotifications);
router.put('/market-price', adminController.updateMarketPrice);

module.exports = router;

