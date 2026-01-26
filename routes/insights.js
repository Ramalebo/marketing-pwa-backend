const express = require('express');
const { Client } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get analytics dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const clients = await Client.findAll({
      where: { createdBy: req.user.id }
    });

    // Total clients
    const totalClients = clients.length;

    // Clients by location
    const locationData = {};
    clients.forEach(client => {
      const clientData = client.toJSON();
      const country = clientData.locationCountry || 'Unknown';
      locationData[country] = (locationData[country] || 0) + 1;
    });

    // Clients with phone numbers
    const clientsWithPhone = clients.filter(c => c.phoneNumber).length;

    // Clients with email
    const clientsWithEmail = clients.filter(c => c.email).length;

    // Clients with social media
    const clientsWithSocial = clients.filter(c => {
      const data = c.toJSON();
      return data.socialMediaFacebook || 
             data.socialMediaInstagram || 
             data.socialMediaTwitter || 
             data.socialMediaLinkedin;
    }).length;

    // Recent clients (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentClients = clients.filter(c => c.createdAt >= thirtyDaysAgo).length;

    res.json({
      totalClients,
      clientsWithPhone,
      clientsWithEmail,
      clientsWithSocial,
      recentClients,
      locationData,
      clients: clients.map(c => {
        const data = c.toJSON();
        return {
          id: data.id.toString(),
          name: data.name,
          businessName: data.businessName,
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
          },
          phoneNumber: data.phoneNumber,
          email: data.email
        };
      })
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get location insights
router.get('/locations', auth, async (req, res) => {
  try {
    const clients = await Client.findAll({
      where: {
        createdBy: req.user.id,
        locationLat: { [Op.ne]: null },
        locationLng: { [Op.ne]: null }
      }
    });

    const locations = clients.map(c => {
      const data = c.toJSON();
      return {
        id: data.id.toString(),
        name: data.name,
        businessName: data.businessName,
        coordinates: {
          lat: data.locationLat,
          lng: data.locationLng
        },
        address: data.locationAddress,
        city: data.locationCity,
        country: data.locationCountry
      };
    });

    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
