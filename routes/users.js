const express = require("express");
const getUserById = require("../utils/getUserById");
const getUserByName = require("../utils/getUserByName");
const users = require("../data/users.json");

const router = express.Router();

// USER ID
router.get("/id/:userId", (req, res) => {
  const user = getUserById(req.params.userId, users);
  if (user) {
    res.set("Cache-Control", "no-store, no-cache, private")
    const html = `
    <!DOCTYPE html>
      <html>
        <head> 
          <title>${user.username}</title>
        </head>
        <body>
          <main>
            <h1>${user.username}</h1>
          </main>
        </body> 
    `;
    res.end(html);
  } else {
    res.status(404).send("User Not Found");
  }
});

// USER NAME
router.get("/name/:userName", (req, res) => {
  const user = getUserByName(req.params.userName, users);
  if (user) {
    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=60")
    const html = `
    <!DOCTYPE html>
      <html>
        <head> 
          <title>${user.username}</title>
        </head>
        <body>
          <main>
            <h1>${user.username}</h1>
          </main>
        </body> 
    `;
    res.end(html);
  } else {
    res.status(404).send("User Not Found");
  }
});

module.exports = router;
