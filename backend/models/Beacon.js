const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Beacon = sequelize.define('Beacon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  uuid: {
    type: DataTypes.STRING(36),
    allowNull: false
  },
  major: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: { min: 0, max: 65535 }
  },
  minor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: { min: 0, max: 65535 }
  },
  locationName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'location_name'
  },
  lat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  lng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  area: {
    type: DataTypes.STRING(128),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
    defaultValue: 'active'
  },
  adId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'ads', key: 'id' },
    field: 'ad_id'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    field: 'created_by'
  }
}, {
  tableName: 'beacons',
  timestamps: true,
  underscored: true
});

module.exports = Beacon;
