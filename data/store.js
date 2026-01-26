// In-memory data store for POC
const bcrypt = require('bcryptjs');

// Generate simple ID
let userIdCounter = 1;
let clientIdCounter = 1;
let noteIdCounter = 1;
let adIdCounter = 1;
let postHistoryIdCounter = 1;
let templateIdCounter = 1;
let customerContactIdCounter = 1;

const generateId = (prefix) => {
  if (prefix === 'user') return `user_${userIdCounter++}`;
  if (prefix === 'client') return `client_${clientIdCounter++}`;
  if (prefix === 'note') return `note_${noteIdCounter++}`;
  if (prefix === 'ad') return `ad_${adIdCounter++}`;
  if (prefix === 'postHistory') return `post_${postHistoryIdCounter++}`;
  if (prefix === 'template') return `template_${templateIdCounter++}`;
  if (prefix === 'customerContact') return `contact_${customerContactIdCounter++}`;
  return `id_${Date.now()}_${Math.random()}`;
};

// In-memory storage
const store = {
  users: [],
  clients: [],
  notes: [],
  ads: [],
  postHistory: [],
  templates: [],
  customerContacts: []
};

// Helper functions
const findUser = (id) => store.users.find(u => u.id === id);
const findUserByEmail = (email) => store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
const findClient = (id) => store.clients.find(c => c.id === id);
const findNote = (id) => store.notes.find(n => n.id === id);
const findAd = (id) => store.ads.find(a => a.id === id);

// User operations
const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = {
    id: generateId('user'),
    email: userData.email.toLowerCase().trim(),
    password: hashedPassword,
    name: userData.name,
    role: userData.role || 'user',
    isMainUser: userData.isMainUser || false,
    createdBy: userData.createdBy || null,
    isActive: userData.isActive !== undefined ? userData.isActive : true,
    createdAt: new Date()
  };
  store.users.push(user);
  return user;
};

const comparePassword = async (user, candidatePassword) => {
  return await bcrypt.compare(candidatePassword, user.password);
};

// Client operations
const createClient = (clientData) => {
  const client = {
    id: generateId('client'),
    ...clientData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  store.clients.push(client);
  return client;
};

const updateClient = (id, updates) => {
  const client = findClient(id);
  if (!client) return null;
  Object.assign(client, updates, { updatedAt: new Date() });
  return client;
};

const deleteClient = (id) => {
  const index = store.clients.findIndex(c => c.id === id);
  if (index === -1) return false;
  store.clients.splice(index, 1);
  return true;
};

// Note operations
const createNote = (noteData) => {
  const note = {
    id: generateId('note'),
    ...noteData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  store.notes.push(note);
  return note;
};

const updateNote = (id, updates) => {
  const note = findNote(id);
  if (!note) return null;
  Object.assign(note, updates, { updatedAt: new Date() });
  return note;
};

const deleteNote = (id) => {
  const index = store.notes.findIndex(n => n.id === id);
  if (index === -1) return false;
  store.notes.splice(index, 1);
  return true;
};

// Ad operations
const createAd = (adData) => {
  const ad = {
    id: generateId('ad'),
    ...adData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  store.ads.push(ad);
  return ad;
};

const updateAd = (id, updates) => {
  const ad = findAd(id);
  if (!ad) return null;
  Object.assign(ad, updates, { updatedAt: new Date() });
  return ad;
};

const deleteAd = (id) => {
  const index = store.ads.findIndex(a => a.id === id);
  if (index === -1) return false;
  store.ads.splice(index, 1);
  return true;
};

// User management
const updateUser = (id, updates) => {
  const user = findUser(id);
  if (!user) return null;
  // Don't allow updating password this way
  const { password, email, ...safeUpdates } = updates;
  Object.assign(user, safeUpdates);
  return user;
};

const deleteUser = (id) => {
  const index = store.users.findIndex(u => u.id === id);
  if (index === -1) return false;
  store.users.splice(index, 1);
  return true;
};

// Post History operations
const createPostHistory = (postData) => {
  const post = {
    id: generateId('postHistory'),
    ...postData,
    createdAt: new Date()
  };
  store.postHistory.push(post);
  return post;
};

const findPostHistory = (id) => store.postHistory.find(p => p.id === id);

// Template operations
const createTemplate = (templateData) => {
  const template = {
    id: generateId('template'),
    ...templateData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  store.templates.push(template);
  return template;
};

const findTemplate = (id) => store.templates.find(t => t.id === id);

const updateTemplate = (id, updates) => {
  const template = findTemplate(id);
  if (!template) return null;
  Object.assign(template, updates, { updatedAt: new Date() });
  return template;
};

const deleteTemplate = (id) => {
  const index = store.templates.findIndex(t => t.id === id);
  if (index === -1) return false;
  store.templates.splice(index, 1);
  return true;
};

// Customer Contact operations
const createCustomerContact = (contactData) => {
  const contact = {
    id: generateId('customerContact'),
    ...contactData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  store.customerContacts.push(contact);
  return contact;
};

const findCustomerContact = (id) => store.customerContacts.find(c => c.id === id);

const updateCustomerContact = (id, updates) => {
  const contact = findCustomerContact(id);
  if (!contact) return null;
  Object.assign(contact, updates, { updatedAt: new Date() });
  return contact;
};

const deleteCustomerContact = (id) => {
  const index = store.customerContacts.findIndex(c => c.id === id);
  if (index === -1) return false;
  store.customerContacts.splice(index, 1);
  return true;
};

module.exports = {
  store,
  // User functions
  findUser,
  findUserByEmail,
  createUser,
  comparePassword,
  updateUser,
  deleteUser,
  // Client functions
  findClient,
  createClient,
  updateClient,
  deleteClient,
  // Note functions
  findNote,
  createNote,
  updateNote,
  deleteNote,
  // Ad functions
  findAd,
  createAd,
  updateAd,
  deleteAd,
  // Post History functions
  createPostHistory,
  findPostHistory,
  // Template functions
  createTemplate,
  findTemplate,
  updateTemplate,
  deleteTemplate,
  // Customer Contact functions
  createCustomerContact,
  findCustomerContact,
  updateCustomerContact,
  deleteCustomerContact
};

