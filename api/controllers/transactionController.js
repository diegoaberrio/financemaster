const Transaction = require('../models/transaction');
const User = require('../models/user'); // Importar el modelo User

exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      include: [{ model: User, as: 'usuarioTransaccion' }] // Usar el alias correcto
    });
    res.json(transactions);
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

exports.createTransaction = async (req, res, next) => {
  try {
    const { Monto, Tipo, Categoria, Fecha, UsuarioID } = req.body;

    // Validación de campos obligatorios
    if (!Monto || !Tipo || !Categoria || !Fecha || !UsuarioID) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validación de valores
    if (Monto <= 0) {
      return res.status(400).json({ error: 'Monto debe ser un valor positivo' });
    }

    if (!['Gasto', 'Ingreso'].includes(Tipo)) {
      return res.status(400).json({ error: 'Tipo debe ser Gasto o Ingreso' });
    }

    const fechaISO = new Date(Fecha).toISOString().split('T')[0]; // Convertir a 'yyyy-MM-dd'

    const transaction = await Transaction.create({
      Monto,
      Tipo,
      Categoria,
      Fecha: fechaISO,
      UsuarioID,
    });

    const newTransaction = await Transaction.findByPk(transaction.ID, {
      include: [{ model: User, as: 'usuarioTransaccion' }] // Usar el alias correcto
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Monto, Tipo, Categoria, Fecha, UsuarioID } = req.body;

    // Validación de campos obligatorios
    if (!Monto || !Tipo || !Categoria || !Fecha || !UsuarioID) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validación de valores
    if (Monto <= 0) {
      return res.status(400).json({ error: 'Monto debe ser un valor positivo' });
    }

    if (!['Gasto', 'Ingreso'].includes(Tipo)) {
      return res.status(400).json({ error: 'Tipo debe ser Gasto o Ingreso' });
    }

    const fechaISO = new Date(Fecha).toISOString().split('T')[0]; // Convertir a 'yyyy-MM-dd'

    await Transaction.update(
      {
        Monto,
        Tipo,
        Categoria,
        Fecha: fechaISO,
        UsuarioID,
      },
      { where: { ID: id } }
    );

    const updatedTransaction = await Transaction.findByPk(id, {
      include: [{ model: User, as: 'usuarioTransaccion' }] // Usar el alias correcto
    });

    res.status(200).json(updatedTransaction);
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Transaction.destroy({ where: { ID: id } });
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};
