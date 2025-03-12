const express = require('express');
const router = express.Router();
const path = require("node:path");

const PAGES_PATH = path.resolve(__dirname, "../pages");

router.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(PAGES_PATH, "dashboard.html"));
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

module.exports = router