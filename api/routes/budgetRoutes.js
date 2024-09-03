const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

// Rutas para obtener, crear, actualizar y eliminar presupuestos
router.get('/', budgetController.getAllBudgets);
router.post('/', budgetController.createBudget);
router.put('/:id', budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;
