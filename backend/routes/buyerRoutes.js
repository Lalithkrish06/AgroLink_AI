const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyerController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', buyerController.getAllBuyers);
router.put('/:buyerId/verify', authMiddleware, buyerController.verifyBuyer);

module.exports = router;
