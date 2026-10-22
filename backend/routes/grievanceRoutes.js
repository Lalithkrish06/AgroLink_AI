const express = require('express');
const router = express.Router();
const grievanceController = require('../controllers/grievanceController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', grievanceController.getGrievances);
router.post('/', authMiddleware, grievanceController.createGrievance);
router.put('/:id/status', authMiddleware, grievanceController.updateGrievanceStatus);

module.exports = router;
