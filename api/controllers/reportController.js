const Report = require('../models/report');
const User = require('../models/user');
const Transaction = require('../models/transaction');
const Budget = require('../models/budget');
const Goal = require('../models/goal');
const { Op } = require('sequelize');

const getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.findAll({
      include: [{ model: User, as: 'usuarioReporte' }]
    });
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await Report.findByPk(id, {
      include: [{ model: User, as: 'usuarioReporte' }]
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const reportData = await generateReportData(report.TipoDeReporte, report.RangoDeFechas, report.UsuarioID);
    report.dataValues.reportData = reportData;

    res.json(report);
  } catch (error) {
    next(error);
  }
};

const createReport = async (req, res, next) => {
  try {
    const { TipoDeReporte, RangoDeFechas, UsuarioID } = req.body;

    if (!TipoDeReporte || !RangoDeFechas || (UsuarioID === undefined)) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const report = await Report.create({
      TipoDeReporte,
      RangoDeFechas,
      UsuarioID: UsuarioID !== 'all' ? UsuarioID : null,
    });

    const reportData = await generateReportData(TipoDeReporte, RangoDeFechas, UsuarioID !== 'all' ? UsuarioID : null);
    report.dataValues.reportData = reportData;

    const newReport = await Report.findByPk(report.ID, {
      include: [{ model: User, as: 'usuarioReporte' }]
    });

    res.status(201).json(newReport);
  } catch (error) {
    next(error);
  }
};

const updateReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { TipoDeReporte, RangoDeFechas, UsuarioID } = req.body;

    if (!TipoDeReporte || !RangoDeFechas || (UsuarioID === undefined)) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    await Report.update(
      {
        TipoDeReporte,
        RangoDeFechas,
        UsuarioID: UsuarioID !== 'all' ? UsuarioID : null,
      },
      { where: { ID: id } }
    );

    const updatedReport = await Report.findByPk(id, {
      include: [{ model: User, as: 'usuarioReporte' }]
    });

    const reportData = await generateReportData(TipoDeReporte, RangoDeFechas, UsuarioID !== 'all' ? UsuarioID : null);
    updatedReport.dataValues.reportData = reportData;

    res.status(200).json(updatedReport);
  } catch (error) {
    next(error);
  }
};

const deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Report.destroy({ where: { ID: id } });
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getGeneralReport = async (req, res, next) => {
  try {
    const { TipoDeReporte, RangoDeFechas } = req.query;

    if (!TipoDeReporte || !RangoDeFechas) {
      return res.status(400).json({ error: 'TipoDeReporte y RangoDeFechas son obligatorios' });
    }

    const reportData = await generateReportData(TipoDeReporte, RangoDeFechas, null);

    const generalReport = await Report.create({
      TipoDeReporte,
      RangoDeFechas,
      UsuarioID: null
    });

    res.json({ reportData, report: generalReport });
  } catch (error) {
    next(error);
  }
};

const getDetailedReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await Report.findByPk(id, {
      include: [{ model: User, as: 'usuarioReporte' }]
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const detailedReportData = await generateDetailedReportData(report.TipoDeReporte, report.RangoDeFechas, report.UsuarioID);
    res.json(detailedReportData);
  } catch (error) {
    next(error);
  }
};

async function generateReportData(TipoDeReporte, RangoDeFechas, UsuarioID) {
  let startDate, endDate;

  [startDate, endDate] = RangoDeFechas.split(' - ');

  const condition = {
    Fecha: {
      [Op.between]: [new Date(startDate), new Date(endDate)]
    }
  };

  if (UsuarioID !== null) {
    condition.UsuarioID = UsuarioID;
  }

  const transactions = await Transaction.findAll({
    where: condition,
    include: [{ model: User, as: 'usuarioTransaccion' }]
  });

  const budgetCondition = {
    FechaInicio: {
      [Op.lte]: new Date(endDate)
    },
    FechaFin: {
      [Op.gte]: new Date(startDate)
    }
  };

  if (UsuarioID !== null) {
    budgetCondition.UsuarioID = UsuarioID;
  }

  const budgets = await Budget.findAll({
    where: budgetCondition,
    include: [{ model: User, as: 'usuarioPresupuesto' }]
  });

  const goalCondition = {
    FechaObjetivo: {
      [Op.between]: [new Date(startDate), new Date(endDate)]
    }
  };

  if (UsuarioID !== null) {
    goalCondition.UsuarioID = UsuarioID;
  }

  const goals = await Goal.findAll({
    where: goalCondition,
    include: [{ model: User, as: 'usuarioMeta' }]
  });

  let reportData = {
    totalIncome: 0,
    totalExpenses: 0,
    totalBudgets: 0,
    totalGoals: 0,
    categorySummary: {},
    budgetDetails: [],
    goalDetails: [],
    transactionDetails: []
  };

  transactions.forEach(transaction => {
    if (transaction.Tipo === 'Ingreso') {
      reportData.totalIncome += parseFloat(transaction.Monto);
    } else if (transaction.Tipo === 'Gasto') {
      reportData.totalExpenses += parseFloat(transaction.Monto);
    }

    if (!reportData.categorySummary[transaction.Categoria]) {
      reportData.categorySummary[transaction.Categoria] = 0;
    }
    reportData.categorySummary[transaction.Categoria] += parseFloat(transaction.Monto);

    reportData.transactionDetails.push({
      Fecha: transaction.Fecha,
      Monto: transaction.Monto,
      Tipo: transaction.Tipo,
      Categoria: transaction.Categoria,
      Usuario: transaction.usuarioTransaccion ? transaction.usuarioTransaccion.Nombre : 'Unknown'
    });
  });

  budgets.forEach(budget => {
    reportData.totalBudgets += parseFloat(budget.Monto);
    reportData.budgetDetails.push({
      FechaInicio: budget.FechaInicio,
      FechaFin: budget.FechaFin,
      Monto: budget.Monto,
      Categoria: budget.Categoria,
      Usuario: budget.usuarioPresupuesto ? budget.usuarioPresupuesto.Nombre : 'Unknown'
    });
  });

  goals.forEach(goal => {
    reportData.totalGoals += parseFloat(goal.MontoObjetivo);
    reportData.goalDetails.push({
      FechaObjetivo: goal.FechaObjetivo,
      MontoObjetivo: goal.MontoObjetivo,
      Categoria: goal.Categoria,
      Progreso: goal.Progreso,
      Usuario: goal.usuarioMeta ? goal.usuarioMeta.Nombre : 'Unknown'
    });
  });

  return reportData;
}

async function generateDetailedReportData(TipoDeReporte, RangoDeFechas, UsuarioID) {
  const reportData = await generateReportData(TipoDeReporte, RangoDeFechas, UsuarioID);
  return reportData;
}

module.exports = {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  getGeneralReport,
  getDetailedReport,
  generateReportData,
  generateDetailedReportData
};
