const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); // Importar el modelo User

const Report = sequelize.define('Report', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  TipoDeReporte: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Tipo de reporte no puede estar vacío'
      },
      len: {
        args: [2, 50],
        msg: 'Tipo de reporte debe tener entre 2 y 50 caracteres'
      }
    }
  },
  RangoDeFechas: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Rango de fechas no puede estar vacío'
      },
      len: {
        args: [5, 100],
        msg: 'Rango de fechas debe tener entre 5 y 100 caracteres'
      }
    }
  },
  UsuarioID: {
    type: DataTypes.INTEGER,
    allowNull: true, // UsuarioID puede ser opcional
    validate: {
      isInt: {
        msg: 'UsuarioID debe ser un número entero'
      }
    }
  },
}, {
  tableName: 'Reportes',
  timestamps: false,
});

// Definir las relaciones
Report.belongsTo(User, { foreignKey: 'UsuarioID', as: 'usuarioReporte' });

module.exports = Report;
