const express = require('express');
const router = express.Router();
const logisticsController = require('../controllers/logisticsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', logisticsController.getLogistics);
router.post('/:id/book', authMiddleware, logisticsController.bookLogistics);

module.exports = router;
