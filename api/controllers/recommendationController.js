const Recommendation = require('../models/recommendation');
const User = require('../models/user'); // Importar el modelo User

exports.getAllRecommendations = async (req, res, next) => {
  try {
    const recommendations = await Recommendation.findAll({
      include: [{ model: User, as: 'usuarioRecomendacion' }] // Usar el alias correcto
    });
    res.json(recommendations);
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

exports.createRecommendation = async (req, res, next) => {
  try {
    const { Mensaje, TipoDeRecomendacion, UsuarioID } = req.body;

    // Validación de campos obligatorios
    if (!Mensaje || !TipoDeRecomendacion) {
      return res.status(400).json({ error: 'Mensaje y Tipo de recomendación son obligatorios' });
    }

    const recommendation = await Recommendation.create({
      Mensaje,
      TipoDeRecomendacion,
      UsuarioID: UsuarioID || null, // Permitir null para recomendaciones generales
    });

    const newRecommendation = await Recommendation.findByPk(recommendation.ID, {
      include: [{ model: User, as: 'usuarioRecomendacion' }] // Usar el alias correcto
    });

    res.status(201).json(newRecommendation);
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

exports.updateRecommendation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Mensaje, TipoDeRecomendacion, UsuarioID } = req.body;

    // Validación de campos obligatorios
    if (!Mensaje || !TipoDeRecomendacion) {
      return res.status(400).json({ error: 'Mensaje y Tipo de recomendación son obligatorios' });
    }

    await Recommendation.update(
      {
        Mensaje,
        TipoDeRecomendacion,
        UsuarioID: UsuarioID || null, // Permitir null para recomendaciones generales
      },
      { where: { ID: id } }
    );

    const updatedRecommendation = await Recommendation.findByPk(id, {
      include: [{ model: User, as: 'usuarioRecomendacion' }] // Usar el alias correcto
    });

    res.status(200).json(updatedRecommendation);
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

exports.deleteRecommendation = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Recommendation.destroy({ where: { ID: id } });
    res.status(200).json({ message: 'Recommendation deleted successfully' });
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};

// Nueva función para obtener recomendaciones basadas en condiciones
exports.getRecommendationsByConditions = async (req, res, next) => {
  try {
    const { budgetStatus, goalsProgress, incomeExpensesStatus } = req.body;

    let recommendations = [];

    // Verificar condiciones y agregar IDs de recomendaciones específicas
    if (budgetStatus.totalGastos > budgetStatus.presupuesto) {
      recommendations.push(1, 2); // IDs de recomendaciones de ahorro
    } else if (budgetStatus.totalGastos < budgetStatus.presupuesto) {
      recommendations.push(3, 4); // IDs de recomendaciones de optimización
    }

    if (goalsProgress.progreso < 50) {
      recommendations.push(5, 6); // IDs de recomendaciones de progreso bajo
    } else if (goalsProgress.progreso >= 50) {
      recommendations.push(7, 8); // IDs de recomendaciones de progreso alto
    }

    if (incomeExpensesStatus.gastos > incomeExpensesStatus.ingresos) {
      recommendations.push(9, 10); // IDs de recomendaciones de ahorro
    } else if (incomeExpensesStatus.gastos < incomeExpensesStatus.ingresos) {
      recommendations.push(11, 12); // IDs de recomendaciones de optimización
    }

    // Obtener recomendaciones basadas en condiciones
    const filteredRecommendations = await Recommendation.findAll({
      where: {
        ID: recommendations
      },
      include: [{ model: User, as: 'usuarioRecomendacion' }]
    });

    res.json(filteredRecommendations);
  } catch (error) {
    next(error); // Pasar el error al middleware de errores
  }
};
