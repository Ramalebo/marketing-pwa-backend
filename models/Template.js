const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Template = sequelize.define('Template', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('email', 'sms', 'social'),
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  variables: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('variables');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('variables', JSON.stringify(value || []));
    }
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
  tableName: 'templates',
  timestamps: true,
  underscored: true
});

module.exports = Template;
