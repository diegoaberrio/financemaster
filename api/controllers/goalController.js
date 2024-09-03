const Goal = require('../models/goal');
const User = require('../models/user'); // Asegúrate de importar el modelo User

exports.getAllGoals = async (req, res, next) => {
  try {
    const goals = await Goal.findAll({
      include: [{ model: User, as: 'usuarioMeta' }] // Usar el alias correcto
    });
    res.json(goals);
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

exports.createGoal = async (req, res, next) => {
  try {
    const { MontoObjetivo, Categoria, FechaObjetivo, Progreso, UsuarioID } = req.body;

    // Validación de campos obligatorios
    if (!MontoObjetivo || !Categoria || !FechaObjetivo || !UsuarioID) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validación de valores
    if (MontoObjetivo <= 0) {
      return res.status(400).json({ error: 'Monto objetivo debe ser un valor positivo' });
    }

    if (Progreso < 0 || Progreso > 100) {
      return res.status(400).json({ error: 'Progreso debe estar entre 0 y 100' });
    }

    const goal = await Goal.create({
      MontoObjetivo,
      Categoria,
      FechaObjetivo,
      Progreso: Progreso || 0,
      UsuarioID,
    });

    const createdGoal = await Goal.findByPk(goal.ID, {
      include: [{ model: User, as: 'usuarioMeta' }] // Usar el alias correcto
    });
    res.status(201).json(createdGoal);
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

exports.updateGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { MontoObjetivo, Categoria, FechaObjetivo, Progreso, UsuarioID } = req.body;

    // Validación de campos obligatorios
    if (!MontoObjetivo || !Categoria || !FechaObjetivo || !UsuarioID) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validación de valores
    if (MontoObjetivo <= 0) {
      return res.status(400).json({ error: 'Monto objetivo debe ser un valor positivo' });
    }

    if (Progreso < 0 || Progreso > 100) {
      return res.status(400).json({ error: 'Progreso debe estar entre 0 y 100' });
    }

    await Goal.update(
      {
        MontoObjetivo,
        Categoria,
        FechaObjetivo,
        Progreso,
        UsuarioID,
      },
      { where: { ID: id } }
    );

    const updatedGoal = await Goal.findByPk(id, {
      include: [{ model: User, as: 'usuarioMeta' }] // Usar el alias correcto
    });
    res.status(200).json(updatedGoal);
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

exports.deleteGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Goal.destroy({ where: { ID: id } });
    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};
