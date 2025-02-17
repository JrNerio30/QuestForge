const express = require('express');
const router = express.Router();
const path = require("node:path");

const PAGES_PATH = path.resolve(__dirname, "../pages");

router.get("/", (req, res) => {
  res.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=300");
  res.sendFile(path.join(PAGES_PATH, "index.html"));
});

module.exports = router;