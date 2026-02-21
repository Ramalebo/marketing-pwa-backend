const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ScheduledPost = sequelize.define('ScheduledPost', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  adId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ads',
      key: 'id'
    },
    field: 'ad_id'
  },
  platform: {
    type: DataTypes.ENUM('facebook', 'instagram', 'whatsapp'),
    allowNull: false
  },
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'scheduled_at'
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'published', 'cancelled', 'failed'),
    defaultValue: 'scheduled'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  whatsappPhone: {
    type: DataTypes.STRING(32),
    allowNull: true,
    field: 'whatsapp_phone'
  },
  error: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'published_at'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'created_by'
  }
}, {
  tableName: 'scheduled_posts',
  timestamps: true,
  underscored: true
});

module.exports = ScheduledPost;
