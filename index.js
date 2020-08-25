// importing modules to use;
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const dbDebugger = require('debug')('app:db');
const apiDebugger = require('debug')('app:api');

// importing routes;
const portfolioRoutes = require('./routes/portfolio');
const utilityRoutes = require('./routes/utilities');

// instantiating the app;
const app = express();

// setting middleware to use;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// setting up imported routes;
app.use('/api', portfolioRoutes);
app.use('/utility', utilityRoutes);

// connect to database;
mongoose.connect('mongodb://localhost/smallcase', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => dbDebugger("Connected to the database."))
    .catch(err => dbDebugger(err));


// setting routes;
app.get('/', (req, res) => {
    res.send('Hello, World.');
});

// listening on the set port;
const port = process.env.PORT || 3000;
app.listen((port), () => {
    console.log(`Server listening on port ${port}.`);
})