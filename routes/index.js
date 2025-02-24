const homeRouter = require("./home");
const aboutRouter = require("./about");
const usersRouter = require("./users");
const userApiRouter = require("./api/users")
const guildsRouter = require("./guilds");
const guildApiRouter = require("./api/guilds");

module.exports = {
  homeRouter, 
  aboutRouter, 
  usersRouter, 
  userApiRouter, 
  guildsRouter, 
  guildApiRouter
};