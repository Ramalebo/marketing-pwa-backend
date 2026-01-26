const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PostHistory = sequelize.define('PostHistory', {
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
  postId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'post_id'
  },
  status: {
    type: DataTypes.ENUM('success', 'failed', 'pending'),
    defaultValue: 'pending'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  error: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  publishedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
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
  tableName: 'post_history',
  timestamps: false,
  underscored: true
});

module.exports = PostHistory;
