const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res, next) => {
  try {
    const { Nombre, Email, Password, Rol } = req.body;

    // Validación de campos obligatorios
    if (!Nombre || !Email || !Password || !Rol) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validación de longitud de campos
    if (Nombre.length < 2 || Nombre.length > 100) {
      return res.status(400).json({ error: 'Nombre debe tener entre 2 y 100 caracteres' });
    }

    if (Password.length < 6 || Password.length > 100) {
      return res.status(400).json({ error: 'Password debe tener entre 6 y 100 caracteres' });
    }

    if (!['usuario', 'admin'].includes(Rol)) {
      return res.status(400).json({ error: 'Rol debe ser usuario o admin' });
    }

    let user = await User.findOne({ where: { Email } });
    if (user) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    user = await User.create({
      Nombre,
      Email,
      Password,
      Rol,
    });

    const payload = { user: { id: user.ID, email: user.Email, role: user.Rol } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    next(err); // Pasar el error al middleware de errores
  }
};

exports.login = async (req, res, next) => {
  try {
    const { Email, Password } = req.body;

    // Validación de campos obligatorios
    if (!Email || !Password) {
      return res.status(400).json({ error: 'Email y Password son obligatorios' });
    }

    const user = await User.findOne({ where: { Email } });
    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await user.comparePassword(Password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    const payload = { user: { id: user.ID, email: user.Email, role: user.Rol } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    next(err); // Pasar el error al middleware de errores
  }
};
