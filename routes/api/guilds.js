const express = require("express");
const router = express.Router();
const guilds = require("../../data/users.json");
const getGuilds = require("../../utils/getGuilds");
const slugify = require("../../utils/slugify");

router.get("/:guildName", (req, res) => {
  const slug = slugify(req.params.guildName);   
  const guild = getGuilds(slug, guilds);

  if(guild) {
    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=60")
    res.json(guild);
  }else{
    res.status(404).send("Guild Not Found");
  }
});


module.exports = router;