const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); // Importar el modelo User

const Goal = sequelize.define('Goal', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  MontoObjetivo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Monto objetivo no puede estar vacío'
      },
      isDecimal: {
        msg: 'Monto objetivo debe ser un número decimal'
      },
      min: {
        args: [0],
        msg: 'Monto objetivo debe ser un valor positivo'
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
  FechaObjetivo: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Fecha objetivo no puede estar vacía'
      },
      isDate: {
        msg: 'Fecha objetivo debe ser una fecha válida'
      }
    }
  },
  Progreso: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.0,
    validate: {
      isDecimal: {
        msg: 'Progreso debe ser un número decimal'
      },
      min: {
        args: [0],
        msg: 'Progreso debe ser un valor positivo'
      },
      max: {
        args: [100],
        msg: 'Progreso no puede ser mayor a 100'
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
  tableName: 'Metas',
  timestamps: false,
});

// Definir la asociación aquí
Goal.belongsTo(User, { foreignKey: 'UsuarioID', as: 'usuarioMeta' });

module.exports = Goal;
