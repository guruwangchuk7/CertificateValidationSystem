const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'institution'), allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true });

module.exports = User;
