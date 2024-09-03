const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); // Importar el modelo User

const Recommendation = sequelize.define('Recommendation', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  TipoDeRecomendacion: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Tipo de recomendación no puede estar vacío'
      },
      len: {
        args: [2, 50],
        msg: 'Tipo de recomendación debe tener entre 2 y 50 caracteres'
      }
    }
  },
  UsuarioID: {
    type: DataTypes.INTEGER,
    allowNull: true, // Permitimos null ya que las recomendaciones son generales y no específicas de usuario
    validate: {
      isInt: {
        msg: 'UsuarioID debe ser un número entero'
      }
    }
  },
}, {
  tableName: 'Recomendaciones',
  timestamps: false,
});

// Definir las relaciones
Recommendation.belongsTo(User, { foreignKey: 'UsuarioID', as: 'usuarioRecomendacion' });

module.exports = Recommendation;
