const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Client = require('./Client');
const Note = require('./Note');
const Ad = require('./Ad');
const CustomerContact = require('./CustomerContact');
const PostHistory = require('./PostHistory');
const ScheduledPost = require('./ScheduledPost');
const Template = require('./Template');
const Beacon = require('./Beacon');
const BeaconEvent = require('./BeaconEvent');

// Define associations
User.hasMany(Client, { foreignKey: 'createdBy', as: 'clients' });
User.hasMany(Note, { foreignKey: 'createdBy', as: 'notes' });
User.hasMany(Ad, { foreignKey: 'createdBy', as: 'ads' });
User.hasMany(CustomerContact, { foreignKey: 'createdBy', as: 'customerContacts' });
User.hasMany(PostHistory, { foreignKey: 'createdBy', as: 'postHistory' });
User.hasMany(ScheduledPost, { foreignKey: 'createdBy', as: 'scheduledPosts' });
User.hasMany(Template, { foreignKey: 'createdBy', as: 'templates' });

Client.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Client.hasMany(Note, { foreignKey: 'clientId', as: 'notes' });
Client.hasMany(Ad, { foreignKey: 'clientId', as: 'ads' });
Client.hasMany(CustomerContact, { foreignKey: 'clientId', as: 'customerContacts' });

Note.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Note.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

Ad.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Ad.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
Ad.hasMany(PostHistory, { foreignKey: 'adId', as: 'postHistory' });
Ad.hasMany(ScheduledPost, { foreignKey: 'adId', as: 'scheduledPosts' });

CustomerContact.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
CustomerContact.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

PostHistory.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
PostHistory.belongsTo(Ad, { foreignKey: 'adId', as: 'ad' });

ScheduledPost.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
ScheduledPost.belongsTo(Ad, { foreignKey: 'adId', as: 'ad' });

Template.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Beacon, { foreignKey: 'createdBy', as: 'beacons' });
Beacon.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Beacon.belongsTo(Ad, { foreignKey: 'adId', as: 'ad' });
Ad.hasMany(Beacon, { foreignKey: 'adId', as: 'beacons' });
Beacon.hasMany(BeaconEvent, { foreignKey: 'beaconId', as: 'events' });
BeaconEvent.belongsTo(Beacon, { foreignKey: 'beaconId', as: 'beacon' });
BeaconEvent.belongsTo(Ad, { foreignKey: 'adId', as: 'ad' });

module.exports = {
  sequelize,
  User,
  Client,
  Note,
  Ad,
  CustomerContact,
  PostHistory,
  ScheduledPost,
  Template,
  Beacon,
  BeaconEvent
};
