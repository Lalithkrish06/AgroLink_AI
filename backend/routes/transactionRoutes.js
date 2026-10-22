const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, transactionController.getTransactions);
router.get('/my', authMiddleware, transactionController.getTransactions);
router.get('/:id', authMiddleware, transactionController.getTransactionById);
router.get('/:id/bill', authMiddleware, transactionController.getTransactionById);
router.get('/:id/bill/pdf', authMiddleware, transactionController.getBillPdf);
router.get('/:id/payment-link', authMiddleware, transactionController.generatePaymentLink);
router.post('/:id/payment-link', authMiddleware, transactionController.generatePaymentLink);
router.patch('/:id/status', authMiddleware, transactionController.updateStatus);
router.put('/:id/status', authMiddleware, transactionController.updateStatus);
router.patch('/:id/payment', authMiddleware, transactionController.updatePayment);
router.put('/:id/payment', authMiddleware, transactionController.updatePayment);
router.post('/:id/pay', authMiddleware, transactionController.processPay);
router.put('/:id/pay', authMiddleware, transactionController.processPay);

module.exports = router;

