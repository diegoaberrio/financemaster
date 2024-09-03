const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); // Asegúrate de importar el modelo User
const moment = require('moment'); // Agregamos moment para manejar fechas

const Budget = sequelize.define('Budget', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Monto no puede estar vacío'
      },
      isDecimal: {
        msg: 'Monto debe ser un número decimal'
      },
      min: {
        args: [0],
        msg: 'Monto debe ser un valor positivo'
      }
    }
  },
  Categoria: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Categoría no puede estar vacía'
      },
      len: {
        args: [2, 50],
        msg: 'Categoría debe tener entre 2 y 50 caracteres'
      }
    }
  },
  FechaInicio: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Fecha de inicio no puede estar vacía'
      },
      isDate: {
        msg: 'Fecha de inicio debe ser una fecha válida'
      }
    }
  },
  FechaFin: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Fecha de fin no puede estar vacía'
      },
      isDate: {
        msg: 'Fecha de fin debe ser una fecha válida'
      },
      isAfterFechaInicio(value) {
        if (value && this.FechaInicio && !moment(value).isAfter(this.FechaInicio)) {
          throw new Error('Fecha de fin debe ser posterior a la fecha de inicio');
        }
      }
    }
  },
  UsuarioID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'UsuarioID no puede estar vacío'
      },
      isInt: {
        msg: 'UsuarioID debe ser un número entero'
      }
    }
  },
}, {
  tableName: 'Presupuestos',
  timestamps: false,
});

// Definir la asociación aquí
Budget.belongsTo(User, { foreignKey: 'UsuarioID', as: 'usuarioPresupuesto' });

module.exports = Budget;
