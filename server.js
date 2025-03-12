/*/////////////////////////////////////////////////////
                    NPM MODULES
////////////////////////////////////////////////////*/
const express = require('express');
const helmet = require('helmet'); 
const https = require('https');
const http = require('http')
const fs = require('fs');
const hsts = require('hsts');
const path = require('node:path')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
require("dotenv").config();


/*/////////////////////////////////////////////////////
VARIABLES
////////////////////////////////////////////////////*/
const app = express();
const {
  homeRouter, 
  aboutRouter,
  usersRouter,
  userApiRouter,
  guildsRouter,
  guildApiRouter,
  authRouter,
  dashboardRouter
} = require('./routes')
const logger = require('./utils/logger.js');
const { PORT_HTTP } = process.env;
const { PORT_HTTPS } = process.env; 
const PAGES_PATH = path.join(__dirname, "pages");
const { MONGO_URI } = process.env;

/*/////////////////////////////////////////////////////
                    CONNECTING MONGODB
////////////////////////////////////////////////////*/
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("You are now connected to MongoDB!"))
.catch(error => console.log('Error reconnecting to MongoDB:', error.message));

/*/////////////////////////////////////////////////////
                SESSION CONFIGURATION
////////////////////////////////////////////////////*/
const passport = require('./config/passport.js');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());


/*/////////////////////////////////////////////////////
                    MIDDLEWARE SETUP
////////////////////////////////////////////////////*/
app.use(bodyParser.json());
app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

  next();
});

/*/////////////////////////////////////////////////////
                  SERVER STATIC FILES
////////////////////////////////////////////////////*/
app.use('/static', express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
            res.set('Cache-Control', 'max-age=86400');
        }
        if (filePath.endsWith('.jpg') || filePath.endsWith('.png')) {
            res.set('Cache-Control', 'max-age=2592000'); 
        }
    }
}));

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
app.use('/api/auth', authRouter);
app.use('/dashboard', dashboardRouter);


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
const httpsServer = https.createServer(sslOptions, (req, res) => {
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

/*
  SOURCES FOR THE MONGOOSE CONNECTIONG
  - https://dev.to/akashakki/what-is-the-best-way-to-securely-managing-mongoose-connection-in-nodejs-applications-g3 
  - https://www.geeksforgeeks.org/mongoose-connections/
*/ 