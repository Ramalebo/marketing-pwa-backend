const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BeaconEvent = sequelize.define('BeaconEvent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  beaconId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'beacons', key: 'id' },
    field: 'beacon_id'
  },
  adId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'ads', key: 'id' },
    field: 'ad_id'
  },
  eventType: {
    type: DataTypes.ENUM('enter', 'exit', 'impression', 'click', 'dwell'),
    allowNull: false,
    field: 'event_type'
  },
  deviceId: {
    type: DataTypes.STRING(128),
    allowNull: true,
    field: 'device_id'
  },
  sessionId: {
    type: DataTypes.STRING(128),
    allowNull: true,
    field: 'session_id'
  },
  metadata: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const v = this.getDataValue('metadata');
      return v ? JSON.parse(v) : null;
    },
    set(value) {
      this.setDataValue('metadata', value ? JSON.stringify(value) : null);
    }
  }
}, {
  tableName: 'beacon_events',
  timestamps: true,
  updatedAt: false,
  underscored: true
});

module.exports = BeaconEvent;
