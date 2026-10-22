const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', cropController.getCropLots);
router.get('/farmer', authMiddleware, cropController.getMyCropLots);
router.get('/matching', cropController.getCropLots);
router.get('/recommendations/:cropLotId', cropController.getMarketRecommendations);
router.get('/:cropLotId/recommendations', cropController.getMarketRecommendations);
router.get('/recommendations', cropController.getMarketRecommendations);
router.post('/', authMiddleware, cropController.createCropLot);
router.post('/:id/select-market', authMiddleware, cropController.selectMarket);
router.get('/:id', cropController.getCropLotById);

module.exports = router;
