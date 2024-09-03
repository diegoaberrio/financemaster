const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

exports.createUser = async (req, res, next) => {
  try {
    console.log("Datos recibidos:", req.body);  // Log para depuración
    const { Nombre, Email, Password, Rol } = req.body;

    // Validación de campos obligatorios
    if (!Nombre || !Email || !Password || !Rol) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    let user = await User.findOne({ where: { Email } });
    if (user) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Hashing de la contraseña antes de guardar el usuario
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    user = await User.create({
      Nombre,
      Email,
      Password: hashedPassword,
      Rol,
    });

    res.status(201).json(user);
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    console.log("Datos recibidos para actualizar:", req.body);  // Log para depuración
    const { id } = req.params;
    const { Nombre, Email, Password, Rol } = req.body;

    // Validación de campos obligatorios
    if (!Nombre || !Email || !Password || !Rol) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    let user = await User.findOne({ where: { ID: id } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si la contraseña se proporciona, la hasheamos antes de actualizar
    let updateData = { Nombre, Email, Rol };
    if (Password) {
      const salt = await bcrypt.genSalt(10);
      updateData.Password = await bcrypt.hash(Password, salt);
    }

    await User.update(updateData, { where: { ID: id } });

    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    let user = await User.findOne({ where: { ID: id } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await User.destroy({ where: { ID: id } });
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};
