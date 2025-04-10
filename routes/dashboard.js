const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const User = require('../data/models/users');

router.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    const { username, email } = req.user;
    res.render("dashboard", { username, email });
  } else {
    res.redirect('/');
  }
});


router.get('/logout', (req, res, next) => {
  req.logout(error => {
    if (error) {return next(error); }
    res.redirect('/');
  });
});

/*/////////////////////////////////////////////////////
                      POST ROUTE
////////////////////////////////////////////////////*/
router.post('/update',
  [
    body('name')
      .trim()
      .isLength({ min: 3, max: 50 }).withMessage('Name must be 3-50 characters')
      .isAlpha('en-US', { ignore: ' ' }).withMessage('Name must only contain letters'),
    body('email')
      .trim()
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('bio')
      .trim()
      .isLength({ max: 500 }).withMessage('Bio must be max 500 characters')
      .matches(/^[a-zA-Z0-9\s.,!?'"-]*$/).withMessage('Bio contains invalid characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, bio } = req.body;

    try {
      const secret = Buffer.from(process.env.AES_SECRET_KEY, 'hex'); 
      const iv = crypto.randomBytes(16);

      const encrypt = (text) => {
        const cipher = crypto.createCipheriv('aes-256-cbc', secret, iv);
        let encrypted = cipher.update(text, 'utf-8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
      };

      const encryptedEmail = encrypt(email);
      const encryptedBio = encrypt(bio);

      // Update the user in MongoDB
      await User.findByIdAndUpdate(req.user.id, {
        username: name,
        email: encryptedEmail,
        bio: encryptedBio,
        iv: iv.toString('hex') 
      });

      res.redirect('/dashboard');
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).send("Something went wrong");
    }
  }
);


module.exports = router;