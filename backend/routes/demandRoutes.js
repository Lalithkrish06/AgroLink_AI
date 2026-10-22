const express = require('express');
const router = express.Router();
const demandController = require('../controllers/demandController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', demandController.getDemands);
router.post('/', authMiddleware, demandController.createDemand);
router.delete('/:id', authMiddleware, demandController.deleteDemand);

module.exports = router;
