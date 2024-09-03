const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); // Asegúrate de importar el modelo User

const Transaction = sequelize.define('Transaction', {
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
  Tipo: {
    type: DataTypes.ENUM('Gasto', 'Ingreso'),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Tipo no puede estar vacío'
      },
      isIn: {
        args: [['Gasto', 'Ingreso']],
        msg: 'Tipo debe ser Gasto o Ingreso'
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
  Fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Fecha no puede estar vacía'
      },
      isDate: {
        msg: 'Fecha debe ser una fecha válida'
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
  tableName: 'Transacciones',
  timestamps: false,
});

// Definir las relaciones
Transaction.belongsTo(User, { foreignKey: 'UsuarioID', as: 'usuarioTransaccion' });

module.exports = Transaction;
