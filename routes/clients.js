const express = require('express');
const { Client } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Helper function to transform client data
const transformClient = (client) => {
  const data = client.toJSON();
  return {
    ...data,
    id: data.id.toString(),
    socialMedia: {
      facebook: data.socialMediaFacebook,
      instagram: data.socialMediaInstagram,
      twitter: data.socialMediaTwitter,
      linkedin: data.socialMediaLinkedin,
      website: data.socialMediaWebsite
    },
    location: {
      address: data.locationAddress,
      city: data.locationCity,
      state: data.locationState,
      country: data.locationCountry,
      zipCode: data.locationZipCode,
      coordinates: {
        lat: data.locationLat,
        lng: data.locationLng
      }
    }
  };
};

// Helper function to transform request body to database format
const transformClientInput = (body) => {
  const data = { ...body };
  if (data.socialMedia) {
    data.socialMediaFacebook = data.socialMedia.facebook;
    data.socialMediaInstagram = data.socialMedia.instagram;
    data.socialMediaTwitter = data.socialMedia.twitter;
    data.socialMediaLinkedin = data.socialMedia.linkedin;
    data.socialMediaWebsite = data.socialMedia.website;
    delete data.socialMedia;
  }
  if (data.location) {
    data.locationAddress = data.location.address;
    data.locationCity = data.location.city;
    data.locationState = data.location.state;
    data.locationCountry = data.location.country;
    data.locationZipCode = data.location.zipCode;
    if (data.location.coordinates) {
      data.locationLat = data.location.coordinates.lat;
      data.locationLng = data.location.coordinates.lng;
    }
    delete data.location;
  }
  return data;
};

// Get all clients
router.get('/', auth, async (req, res) => {
  try {
    const clients = await Client.findAll({
      where: { createdBy: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(clients.map(transformClient));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single client
router.get('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findOne({
      where: { 
        id: req.params.id, 
        createdBy: req.user.id 
      }
    });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(transformClient(client));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create client
router.post('/', auth, async (req, res) => {
  try {
    const clientData = transformClientInput(req.body);
    const client = await Client.create({
      ...clientData,
      createdBy: req.user.id
    });
    res.status(201).json(transformClient(client));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update client
router.put('/:id', auth, async (req, res) => {
  try {
    const clientData = transformClientInput(req.body);
    const client = await Client.findOne({
      where: { 
        id: req.params.id, 
        createdBy: req.user.id 
      }
    });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    await client.update(clientData);
    res.json(transformClient(client));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete client
router.delete('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findOne({
      where: { 
        id: req.params.id, 
        createdBy: req.user.id 
      }
    });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    await client.destroy();
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
