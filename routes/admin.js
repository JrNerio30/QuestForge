const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/middlewares/auth');
const authorize = require('../utils/middlewares/authorize');

// Admin-only route
router.get('/protected', authMiddleware, authorize('admin'), (req, res) => {
  console.log("Authenticated User:", req.user); 
  res.status(200).json({ message: "Welcome, admin user!" });
});

module.exports = router;