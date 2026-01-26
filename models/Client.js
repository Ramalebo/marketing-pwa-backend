const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  businessName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'business_name'
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'phone_number'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  socialMediaFacebook: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'social_media_facebook'
  },
  socialMediaInstagram: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'social_media_instagram'
  },
  socialMediaTwitter: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'social_media_twitter'
  },
  socialMediaLinkedin: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'social_media_linkedin'
  },
  socialMediaWebsite: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'social_media_website'
  },
  locationAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'location_address'
  },
  locationCity: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'location_city'
  },
  locationState: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'location_state'
  },
  locationCountry: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'location_country'
  },
  locationZipCode: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'location_zip_code'
  },
  locationLat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    field: 'location_lat'
  },
  locationLng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    field: 'location_lng'
  },
  tags: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('tags');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value || []));
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
  tableName: 'clients',
  timestamps: true,
  underscored: true
});

module.exports = Client;
