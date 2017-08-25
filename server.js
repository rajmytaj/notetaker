// "use strict";

// require('dotenv').config();

// const PORT        = process.env.PORT || 8080;
// const ENV         = process.env.ENV || "development";
// const express     = require("express");
// const bodyParser  = require("body-parser");
// // const sass        = require("node-sass-middleware");
// const app         = express();

// const knexConfig  = require("./knexfile");
// const knex        = require("knex")(knexConfig[ENV]);
// const morgan      = require('morgan');
// const knexLogger  = require('knex-logger');

// // Seperated Routes for each Resource
// const usersRoutes = require("./routes/users");

// // Load the logger first so all (static) HTTP requests are logged to STDOUT
// // 'dev' = Concise output colored by response status for development use.
// //         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
// app.use(morgan('dev'));

// // Log knex SQL queries to STDOUT as well
// app.use(knexLogger(knex));

// app.set("view engine", "ejs");
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use("/styles", sass({
//   src: __dirname + "/styles",
//   dest: __dirname + "/public/styles",
//   debug: true,
//   outputStyle: 'expanded'
// }));
// app.use(express.static("public"));

// // Mount all resource routes
// app.use("/api/users", usersRoutes(knex));

// // Home page
// app.get("/", (req, res) => {
//   res.render("index");
// });

// app.listen(PORT, () => {
//   console.log("Example app listening on port " + PORT);
// });


require('dotenv').config();

const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);
const express = require('express');
const app = express();
const server = require('http').Server(app);
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const bundleURL = process.env.NODE_ENV === 'production' ? '/bundle.js' : process.env.DEV_BUNDLE || 'http://localhost:8080/bundle.js';
const flash = require("connect-flash");

const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const currentUserRouter = require('./routes/currentUser');
const logoutRouter = require('./routes/logout');

app.set('view engine', 'ejs');

app.use(cookieSession({
  secret: process.env.SESSION_SECRET || 'development'
}));

app.use(flash());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use(express.static('public'));

// Middleware for req.flash messages
app.use((req, res, next) => {
  res.locals.errors = req.flash('errors');
  next();
});

// app.use('/login', loginRouter(knex));
// app.use('/register', registerRouter(knex));
// app.use('/currentUser', currentUserRouter(knex));
// app.use('/logout', logoutRouter());


// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// app.get('/', (req, res) => {
//   if (req.session.user_id) {
//     res.render('app', {
//       bundleURL
//     });
//   } else {
//     res.render('index', { show_register: req.session.show_register });
//   }
// });



server.listen(process.env.PORT || 8080, () => {
  const address = server.address();
  console.log(`Server running on port ${address.port}`);
});
