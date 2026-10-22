const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const driverController = require('../controllers/driverController');

router.get('/', orderController.getOrders);
router.post('/accept', orderController.acceptProduct);
router.post('/:orderId/driver', driverController.assignDriver);
router.get('/:orderId/driver', driverController.getDriverAssignment);

module.exports = router;
