const express = require("express");
const router = express.Router();
const users = require("../../data/users.json");
const getUserById = require("../../utils/getUserById");
const getUserByName = require("../../utils/getUserByName");

router.get("/id/:userId", (req, res) => {
  const user = getUserById(req.params.userId, users);
  if(user) {
    res.set("Cache-Control", "no-store, private");
    res.json(user);
  }else{
    res.status(404).send("User Not Found");
  }
});

router.get("/name/:userName", (req, res) => {
  const user = getUserByName(req.params.userName, users);
  if(user) {
    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=60")
    res.json(user);
  }else{
    res.status(404).send("User Not Found");
  }
});

module.exports = router;