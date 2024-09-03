const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nombre no puede estar vacío'
      },
      len: {
        args: [2, 100],
        msg: 'Nombre debe tener entre 2 y 100 caracteres'
      }
    }
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Email no puede estar vacío'
      },
      isEmail: {
        msg: 'Email debe ser un email válido'
      }
    }
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Password no puede estar vacío'
      },
      len: {
        args: [6, 100],
        msg: 'Password debe tener entre 6 y 100 caracteres'
      }
    }
  },
  Rol: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'usuario',  // Valor predeterminado
    validate: {
      notEmpty: {
        msg: 'Rol no puede estar vacío'
      },
      isIn: {
        args: [['usuario', 'admin']],
        msg: 'Rol debe ser usuario o admin'
      }
    }
  },
  EmailVerificado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'Usuarios',
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      if (user.Password) {
        const salt = await bcrypt.genSalt(10);
        user.Password = await bcrypt.hash(user.Password, salt);
      }
    },
  },
});

// Asociation to other models
User.associate = (models) => {
  User.hasMany(models.Transaction, {
    foreignKey: 'UsuarioID',
    as: 'transacciones'
  });

  User.hasMany(models.Budget, {
    foreignKey: 'UsuarioID',
    as: 'presupuestos'
  });

  User.hasMany(models.Goal, {
    foreignKey: 'UsuarioID',
    as: 'metas'
  });

  User.hasMany(models.Report, {
    foreignKey: 'UsuarioID',
    as: 'reportes'
  });

  User.hasMany(models.Recommendation, {
    foreignKey: 'UsuarioID',
    as: 'recomendaciones'
  });

  User.hasMany(models.Notification, {
    foreignKey: 'UsuarioID',
    as: 'notificaciones'
  });
};


User.prototype.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.Password);
};

module.exports = User;
