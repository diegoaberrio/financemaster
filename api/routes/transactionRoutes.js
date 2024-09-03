const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Rutas para obtener, crear, actualizar y eliminar transacciones
router.get('/', transactionController.getAllTransactions);
router.post('/', transactionController.createTransaction);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
