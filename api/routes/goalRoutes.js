const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');

// Rutas para obtener, crear, actualizar y eliminar metas
router.get('/', goalController.getAllGoals);
router.post('/', goalController.createGoal);
router.put('/:id', goalController.updateGoal);
router.delete('/:id', goalController.deleteGoal);

module.exports = router;
