const dbDebugger = require('debug')('app:db');
const apiDebugger = require('debug')('app:api');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const customError = require('http-errors');
const errorHandlerMiddleware = require('../middleware/errorHandlerMiddleware');

// importing models;
const Portfolio = require('../models/portfolioModel');

// importing validations;
const validations = require('../validations/validateRequest');

// utility endpoints for development;
router.post('/addPortfolio', errorHandlerMiddleware((req, res) => {
    const { error } = validations.validateUtilityRequest(req);    
    const portfolioName = req.body.name;
    if (error) {
        throw customError(400, "Bad Request; re-check the request body.");
    } else {

        if (!portfolioName) {
            // throw customError(400, "Bad Request");
            return res.status(400).send({ error: "Bad Request", message: "Recheck the request body and retry." });
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

    let { error } = validations.validateUtilityRequest(req);

    if (error) {
        throw customError(400, "Bad Request.");
    } else {
        (async () => {
            const ticker = req.body.ticker;

            if (!ticker) {
                res.status(400).send("Invalid ticker");
            }

            // get matching portfolio and check if ticker already exists;
            const portfolioName = req.params.portfolioName;
            let security = {"ticker": ticker, trades: [], avgBuyPrice: 0, shares: 0};
            let portfolio = await Portfolio.findOne({"name": portfolioName}).catch(err => res.status(500).send("An error occured."));
            if (!portfolio) {
                res.status(404).send("No portfolio found.");

            }
            
            let existingTicker = portfolio.securities.find(security => security.ticker == ticker);

            if (existingSecurity) {
                return res.status(422).send("This Ticker already exists");
            }
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
function validateUtilityRequest(request) {
    const utilityRequestSchema = Joi.object({
        ticker: Joi.string().trim().uppercase(),
        name: Joi.string().trim(),
    })

    return utilityRequestSchema.validate(request.body);
}

module.exports = router;