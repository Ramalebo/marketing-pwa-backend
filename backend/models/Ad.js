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
  campaign: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  adset: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  platform: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  format: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  placement: {
    type: DataTypes.STRING(128),
    allowNull: true
  },
  adType: {
    type: DataTypes.STRING(64),
    allowNull: true,
    field: 'ad_type'
  },
  cta: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  headline: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  destinationUrl: {
    type: DataTypes.STRING(1024),
    allowNull: true,
    field: 'destination_url'
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'approved', 'published', 'archived'),
    defaultValue: 'draft'
  },
  channel: {
    type: DataTypes.STRING(32),
    allowNull: true,
    defaultValue: 'social'
  },
  reach: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  engagement: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0,
    get() {
      const v = this.getDataValue('engagement');
      return v != null ? Number(v) : 0;
    }
  },
  spend: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
    get() {
      const v = this.getDataValue('spend');
      return v != null ? Number(v) : 0;
    }
  },
  displayType: {
    type: DataTypes.STRING(32),
    allowNull: true,
    field: 'display_type'
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  size: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  period: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  impressionsPerDay: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'impressions_per_day'
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'start_date'
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'end_date'
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
