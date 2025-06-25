const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Certificate = sequelize.define('Certificate', {
  studentName: { type: DataTypes.STRING, allowNull: false },
  degreeName: { type: DataTypes.STRING, allowNull: false },
  graduationDate: { type: DataTypes.DATEONLY, allowNull: false },
  institutionName: { type: DataTypes.STRING, allowNull: false },
  ipfsHash: { type: DataTypes.STRING, allowNull: false },  // IPFS hash of PDF
  blockchainHash: { type: DataTypes.STRING, allowNull: false }, // Blockchain tx hash or unique cert hash
}, { timestamps: true });

module.exports = Certificate;
