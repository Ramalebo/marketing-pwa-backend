const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Ad = sequelize.define('Ad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('image', 'video', 'carousel', 'story'),
    allowNull: false
  },
  aiGenerated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'ai_generated'
  },
  aiPrompt: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'ai_prompt'
  },
  contentImages: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('contentImages');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('contentImages', JSON.stringify(value || []));
    },
    field: 'content_images'
  },
  contentVideos: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('contentVideos');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('contentVideos', JSON.stringify(value || []));
    },
    field: 'content_videos'
  },
  contentText: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'content_text'
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'approved', 'published', 'archived'),
    defaultValue: 'draft'
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'clients',
      key: 'id'
    },
    field: 'client_id'
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
  tableName: 'ads',
  timestamps: true,
  underscored: true
});

module.exports = Ad;
