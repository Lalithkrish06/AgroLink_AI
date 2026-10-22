const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const authMiddleware = require('../middleware/authMiddleware');

// Markets endpoints
router.get('/', authMiddleware, marketController.getMarkets);
router.get('/active', authMiddleware, marketController.getMarkets);
router.post('/', authMiddleware, (req, res, next) => {
  if (req.baseUrl.includes('requirements')) {
    return marketController.addRequirement(req, res, next);
  }
  return marketController.createMarket(req, res, next);
});
router.post('/recommend', marketController.getAIRecommendation);

// Buyer Market Requirements Routes
router.get('/my', authMiddleware, marketController.getRequirements);
router.get('/requirements', authMiddleware, marketController.getRequirements);
router.get('/requirements/my', authMiddleware, marketController.getRequirements);
router.post('/requirements', authMiddleware, marketController.addRequirement);
router.get('/:id/requirements', authMiddleware, marketController.getRequirements);
router.post('/:id/requirements', authMiddleware, marketController.addRequirement);
router.put('/requirements/:reqId', authMiddleware, marketController.updateRequirement);
router.put('/:reqId', authMiddleware, marketController.updateRequirement);
router.delete('/requirements/:reqId', authMiddleware, marketController.deleteRequirement);
router.delete('/:reqId', authMiddleware, marketController.deleteRequirement);

module.exports = router;

