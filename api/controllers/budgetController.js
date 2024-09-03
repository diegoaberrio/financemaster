const Budget = require('../models/budget');
const User = require('../models/user'); // Asegúrate de importar el modelo User

exports.getAllBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.findAll({ include: [{ model: User, as: 'usuarioPresupuesto' }] });
    res.json(budgets);
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

exports.createBudget = async (req, res, next) => {
  try {
    const { Monto, Categoria, FechaInicio, FechaFin, UsuarioID } = req.body;

    // Log the incoming request body
    console.log('Request Body:', req.body);

    // Validación de campos obligatorios
    if (!Monto || !Categoria || !FechaInicio || !FechaFin || !UsuarioID) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validación de valores
    if (Monto <= 0) {
      return res.status(400).json({ error: 'Monto debe ser un valor positivo' });
    }

    const budget = await Budget.create({
      Monto,
      Categoria,
      FechaInicio,
      FechaFin,
      UsuarioID,
    });

    const newBudget = await Budget.findByPk(budget.ID, { include: [{ model: User, as: 'usuarioPresupuesto' }] });
    res.status(201).json(newBudget);
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

exports.updateBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Monto, Categoria, FechaInicio, FechaFin, UsuarioID } = req.body;

    // Validación de campos obligatorios
    if (!Monto || !Categoria || !FechaInicio || !FechaFin || !UsuarioID) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validación de valores
    if (Monto <= 0) {
      return res.status(400).json({ error: 'Monto debe ser un valor positivo' });
    }

    await Budget.update(
      {
        Monto,
        Categoria,
        FechaInicio,
        FechaFin,
        UsuarioID,
      },
      { where: { ID: id } }
    );

    const updatedBudget = await Budget.findByPk(id, { include: [{ model: User, as: 'usuarioPresupuesto' }] });
    res.status(200).json(updatedBudget);
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

exports.deleteBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Budget.destroy({ where: { ID: id } });
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};
