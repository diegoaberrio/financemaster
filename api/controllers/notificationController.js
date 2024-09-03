const Notification = require('../models/notification');
const User = require('../models/user'); // Importar el modelo User

exports.getAllNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      include: [{ model: User, as: 'usuarioNotificacion' }] // Usar el alias correcto
    });
    res.json(notifications);
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

exports.createNotification = async (req, res, next) => {
  try {
    const { TipoDeNotificacion, Mensaje, Fecha, Estado, UsuarioID } = req.body;

    // Validación de campos obligatorios
    if (!TipoDeNotificacion || !Mensaje || !Fecha || !UsuarioID) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const notification = await Notification.create({
      TipoDeNotificacion,
      Mensaje,
      Fecha,
      Estado: Estado || 'No leído',
      UsuarioID,
    });

    const newNotification = await Notification.findByPk(notification.ID, {
      include: [{ model: User, as: 'usuarioNotificacion' }] // Usar el alias correcto
    });

    res.status(201).json(newNotification);
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

exports.updateNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { TipoDeNotificacion, Mensaje, Fecha, Estado, UsuarioID } = req.body;

    // Validación de campos obligatorios
    if (!TipoDeNotificacion || !Mensaje || !Fecha || !UsuarioID) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    await Notification.update(
      {
        TipoDeNotificacion,
        Mensaje,
        Fecha,
        Estado,
        UsuarioID,
      },
      { where: { ID: id } }
    );

    const updatedNotification = await Notification.findByPk(id, {
      include: [{ model: User, as: 'usuarioNotificacion' }] // Usar el alias correcto
    });

    res.status(200).json(updatedNotification);
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Notification.destroy({ where: { ID: id } });
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

// Nueva función para marcar como leído
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Notification.update({ Estado: 'Leído' }, { where: { ID: id } });
    const updatedNotification = await Notification.findByPk(id, {
      include: [{ model: User, as: 'usuarioNotificacion' }]
    });
    res.status(200).json(updatedNotification);
  } catch (error) {
    next(error);
  }
};

// Nueva función para obtener todos los usuarios
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
};
