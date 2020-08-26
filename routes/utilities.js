const dbDebugger = require('debug')('app:db');
const apiDebugger = require('debug')('app:api');
const express = require('express');
const router = express.Router();
const errorHandlerMiddleware = require('../middleware/errorHandlerMiddleware');
const customError = require('http-errors');


// importing models;
const Portfolio = require('../models/portfolioModel');

// importing validations;
const validations = require('../validations/validateRequest');

// utility endpoints for development;
router.post('/addPortfolio', errorHandlerMiddleware((req, res) => {
    const portfolioName = request.body.name;
    let { error } = validations.validateUtilityRequests(req);

    if (error) {
        throw customError(400, "Bad Request.");
    }

    else {
        const portfolioName = req.body.name;

        if (!portfolioName) {
            throw customError(400, "Bad Request");
        }

        (async () => {
            let portfolio = new Portfolio({
                name: portfolioName,
                /*
                    securities: [] is added automatically due to Schema constraints;
                */
            });
            await portfolio.save().then(result => res.send(result)).catch(err => res.send(err));
        })();
    }
}));

router.post('/addTicker/:portfolioName', errorHandlerMiddleware((req, res) => {

    let { error } = validations.validateUtilityRequests(req);

    if (error) {
        throw customError(400, "Bad Request.");
    } else {
        (async () => {
            const ticker = req.body.ticker;
            const portfolioId = req.body.portfolioId;
            let security = {"ticker": ticker, trades: [], avgBuyPrice: 0, shares: 0};
            let portfolio = await Portfolio.findById(portfolioId).catch(err => res.status(500).send("An error occured."));
            portfolio.securities.push(security);
            await portfolio.save().then(result => res.send(result)).catch(err => res.send(err)).catch(err => res.status(500).send("An error occured in saving the Ticker"));
        })();
    }

    
}));


// iterate through trades;
// router.get('utility/getTrades/:ticker', (req, res) => {
//     (async () => {
//         const portfolio = await Portfolio.findOne({"name": "TestPortfolio"});
//         const ticker = req.params.ticker;
//         portfolio.securities.forEach( security => {
//             if (security.ticker == req.params.ticker) {
//                 return res.send({
//                     "ticker": security.ticker,
//                     "trades": security.trades
//                 })
//             }
//         });
//         // console.log("Portfolio name", portfolio.name);
//         res.send(portfolio.securities);
//     })();
// })

module.exports = router;