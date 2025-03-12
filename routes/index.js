const homeRouter = require("./home");
const aboutRouter = require("./about");
const usersRouter = require("./users");
const userApiRouter = require("./api/users")
const guildsRouter = require("./guilds");
const guildApiRouter = require("./api/guilds");
const authRouter = require("./auth");
const dashboardRouter = require("./dashboard");
const adminRouter = require("./admin");

module.exports = {
  homeRouter, 
  aboutRouter, 
  usersRouter, 
  userApiRouter, 
  guildsRouter, 
  guildApiRouter,
  authRouter,
  dashboardRouter,
  adminRouter
};