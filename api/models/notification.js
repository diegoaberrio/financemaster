const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); // Importar el modelo User

const Notification = sequelize.define('Notification', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  TipoDeNotificacion: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Tipo de notificación no puede estar vacío'
      },
      len: {
        args: [2, 50],
        msg: 'Tipo de notificación debe tener entre 2 y 50 caracteres'
      }
    }
  },
  Mensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Mensaje no puede estar vacío'
      },
      len: {
        args: [1, 500],
        msg: 'Mensaje debe tener entre 1 y 500 caracteres'
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
  Estado: {
    type: DataTypes.ENUM('Leído', 'No leído'),
    defaultValue: 'No leído',
    validate: {
      isIn: {
        args: [['Leído', 'No leído']],
        msg: 'Estado debe ser Leído o No leído'
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
  tableName: 'Notificaciones',
  timestamps: false,
});

// Definir las relaciones
Notification.belongsTo(User, { foreignKey: 'UsuarioID', as: 'usuarioNotificacion' });

module.exports = Notification;
