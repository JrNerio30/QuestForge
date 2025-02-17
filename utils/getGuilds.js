const slugify = require("./slugify");

function getGuilds(guildname, guilds) {
  const guildName = slugify(guildname);
  return guilds.find((guild) => {
    const slugifiedName = slugify(guild.guildname);
    return slugifiedName === guildName;
  });
}

module.exports = getGuilds;
