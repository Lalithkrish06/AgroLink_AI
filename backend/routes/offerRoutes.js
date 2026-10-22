const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, offerController.getOffers);
router.get('/my', authMiddleware, offerController.getOffers);
router.get('/buyer/requests', authMiddleware, offerController.getOffers);
router.post('/', authMiddleware, offerController.createOffer);
router.patch('/:id/accept', authMiddleware, offerController.acceptOffer);
router.put('/:id/accept', authMiddleware, offerController.acceptOffer);
router.patch('/:id/reject', authMiddleware, offerController.rejectOffer);
router.put('/:id/reject', authMiddleware, offerController.rejectOffer);

module.exports = router;

