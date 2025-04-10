const express = require('express');
const argon2 = require('argon2');
const router = express.Router();
const User = require('../data/models/users');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');

router.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

/*/////////////////////////////////////////////////////
                  REGISTER ROUTE
////////////////////////////////////////////////////*/
router.post('/register', async (req, res) => {
  try {
    const { username, password, role = 'user' } = req.body;
    const hashedPassword = await argon2.hash(password);

    // Save user with hashed password
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*/////////////////////////////////////////////////////
                    LOGIN ROUTE
////////////////////////////////////////////////////*/
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*/////////////////////////////////////////////////////
                  GOOGLE ROUTE
////////////////////////////////////////////////////*/
// CALL BACK EMAIL ONTO THE DASHBOARD
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
      console.log("User authenticated:", req.user);
      res.redirect('/dashboard');
  }
);

module.exports = router;