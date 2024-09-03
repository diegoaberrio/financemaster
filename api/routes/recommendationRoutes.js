const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

// Rutas para obtener, crear, actualizar y eliminar recomendaciones
router.get('/', recommendationController.getAllRecommendations);
router.post('/', recommendationController.createRecommendation);
router.put('/:id', recommendationController.updateRecommendation);
router.delete('/:id', recommendationController.deleteRecommendation);

// Nueva ruta para obtener recomendaciones basadas en condiciones
router.post('/conditions', recommendationController.getRecommendationsByConditions);

module.exports = router;
