const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Rutas para obtener, crear, actualizar y eliminar reportes
router.get('/', reportController.getAllReports);
router.get('/general', reportController.getGeneralReport); // Nueva ruta para el reporte general
router.get('/:id', reportController.getReportById); // Ruta para obtener un reporte por ID
router.post('/', reportController.createReport);
router.put('/:id', reportController.updateReport);
router.delete('/:id', reportController.deleteReport);

// Nueva ruta para el informe detallado
router.get('/detailed/:id', reportController.getDetailedReport);

module.exports = router;
