const express = require("express");
const getGuilds = require("../utils/getGuilds");
const guilds = require("../data/users.json");
const slugify = require("../utils/slugify");

const router = express.Router();

// GUILDS
router.get("/:guildName", (req, res) => {
  const slug = slugify(req.params.guildName);
  const guild = getGuilds(slug, guilds);
  if (guild) {
    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=60")
    const html = `
    <!DOCTYPE html>
    <html>
      <head> 
        <title>${guild.guildname}</title>
      </head>
      <body>
        <main>
          <h1>${guild.guildname}</h1>
        </main>
      </body> 
    `;
    res.end(html);
  } else {
    res.status(404).send("Guild Not Found");
  }
});

module.exports = router;