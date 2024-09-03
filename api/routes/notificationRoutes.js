const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Rutas para obtener, crear, actualizar y eliminar notificaciones
router.get('/', notificationController.getAllNotifications);
router.post('/', notificationController.createNotification);
router.put('/:id', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);

// Nueva ruta para marcar como leído
router.put('/:id/markAsRead', notificationController.markAsRead);

// Nueva ruta para obtener todos los usuarios
router.get('/users', notificationController.getAllUsers);

module.exports = router;
