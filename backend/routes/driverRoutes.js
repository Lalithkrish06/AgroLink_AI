const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

router.post('/assign', driverController.assignDriver);
router.get('/assignment/:orderId', driverController.getDriverAssignment);
router.post('/location', driverController.postLiveLocation);
router.get('/location/:orderId', driverController.getLiveLocation);
router.put('/:id/status', driverController.updateDriverStatus);

module.exports = router;
