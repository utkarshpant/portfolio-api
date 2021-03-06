// importing modules to use;
const config = require('config');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const dbDebugger = require('debug')('app:db');
const apiDebugger = require('debug')('app:api');

// importing routes;
const portfolioRoutes = require('./routes/portfolio');
const newPortfolioRoutes = require('./routes/portfolio_v2');
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
app.use('/api/v2', newPortfolioRoutes);

let mongooseConnectionString;
if (app.get('env') == "development") {
    mongooseConnectionString = "mongodb://localhost:27017/smallcase";
} else {
    mongooseConnectionString = `mongodb+srv://${config.get('database.username')}:${config.get('database.password')}@cluster0.5yvwv.gcp.mongodb.net/smallcase?retryWrites=true&w=majority`;
}

// connect to database;
mongoose.connect(mongooseConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`Connected to the database with ${mongooseConnectionString}`))
    .catch(err => console.log(err));


// setting routes;
app.get('/', (req, res) => {
    res.send('Hello, World.');
});

app.use(function(err, req, res, next){
    res.status(err.status).send(err.message);
});

// listening on the set port;
const port = process.env.PORT || 3000;
app.listen((port), () => {
    console.log(`Server listening on port ${port}.`);
})

