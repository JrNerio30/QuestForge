// NPM MODULES
const express = require('express');

// BUILT IN MODULES
const helmet = require('helmet'); 
const https = require('https');
const http = require('http')
const fs = require('fs');
const hsts = require('hsts');
const path = require("node:path")
require("dotenv").config();

// VARIABLES
const app = express();
const {
  homeRouter, 
  aboutRouter,
  usersRouter,
  userApiRouter,
  guildsRouter,
  guildApiRouter
} = require('./routes')
const logger = require('./utils/logger.js')
const PORT_HTTP = process.env.PORT || 80;
const PORT_HTTPS = process.env.PORT || 443; 
const PAGES_PATH = path.join(__dirname, "pages");

/*/////////////////////////////////////////////////////
                    MIDDLEWARE SETUP
////////////////////////////////////////////////////*/
app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

  next();
});

/*/////////////////////////////////////////////////////
                   HSTS MIDDLEWARE
////////////////////////////////////////////////////*/
const hstsOptions = {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true 
};

/*/////////////////////////////////////////////////////
                    ROUTE SETUP
////////////////////////////////////////////////////*/
app.use("/", homeRouter);
app.use("/about", aboutRouter);
app.use("/users/", usersRouter);
app.use("/api/users", userApiRouter);
app.use("/guilds/", guildsRouter);
app.use("/api/guilds", guildApiRouter);

/*/////////////////////////////////////////////////////
              HELMET SECURITY MIDDLEWARE
////////////////////////////////////////////////////*/
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
    }
  },
  xFrameOptions: {action: 'deny'}, 
  xContentTypeOptions: true, 
  referrerPolicy: {policy: "strict-origin-when-cross-origin"}, 
}));

/*/////////////////////////////////////////////////////
                  SSL CERTIFICATES
////////////////////////////////////////////////////*/
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, process.env.SSL_KEY)),
  cert: fs.readFileSync(path.join(__dirname, process.env.SSL_CERT)),
};

/*/////////////////////////////////////////////////////
                  ERROR HANDLING
////////////////////////////////////////////////////*/
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(PAGES_PATH, "404.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({error: "Something Went Wrong"});
});

/*/////////////////////////////////////////////////////
              HTTPS SERVER WITH HSTS
////////////////////////////////////////////////////*/
const httpsServer = https.createServer(options, (req, res) => {
    // Apply HSTS middleware
    hsts(hstsOptions)(req, res, () => {
        app(req, res);
    });
});

/*/////////////////////////////////////////////////////
              HTTP AND HTTPS SERVER SETUP
////////////////////////////////////////////////////*/
http.createServer((req, res) => {
  res.writeHead(301, {"Location": `https://localhost:${PORT_HTTPS}${req.url}` });
  res.end();
}).listen(PORT_HTTP, () => {
  console.log(`HTTP Server runnning -> Redirecting to HTTPS`)
});

// Starting the HTTPS server
https.createServer(sslOptions, app).listen(PORT_HTTPS, () => {
  console.log(`HTTPS Server running at https://localhost:${PORT_HTTPS}`);
});
