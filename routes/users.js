const express = require('express');
const { User } = require('../models');
const { auth, isMainUser } = require('../middleware/auth');

const router = express.Router();

// Get all users (main user only)
router.get('/', auth, isMainUser, async (req, res) => {
  try {
    const users = await User.findAll({
      where: { createdBy: req.user.id },
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] }
    });
    res.json(users.map(u => ({ ...u.toJSON(), id: u.id.toString() })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new user (main user only)
router.post('/', auth, isMainUser, async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    const existingUser = await User.findOne({ 
      where: { email: email.toLowerCase().trim() } 
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email: email.toLowerCase().trim(),
      password,
      name,
      role: role || 'user',
      createdBy: req.user.id,
      isMainUser: false
    });

    res.status(201).json({
      ...user.toJSON(),
      id: user.id.toString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user
router.put('/:id', auth, isMainUser, async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.password; // Don't allow password update through this route
    delete updateData.email; // Don't allow email update

    const user = await User.findOne({
      where: { 
        id: req.params.id, 
        createdBy: req.user.id 
      }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update(updateData);
    res.json({
      ...user.toJSON(),
      id: user.id.toString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/:id', auth, isMainUser, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { 
        id: req.params.id, 
        createdBy: req.user.id 
      }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
