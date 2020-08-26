const dbDebugger = require('debug')('app:db');
const apiDebugger = require('debug')('app:api');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const customError = require('http-errors');
const errorHandlerMiddleware = require('../middleware/errorHandlerMiddleware');

// importing models;
const Portfolio = require('../models/portfolioModel');

// import validations;
const validations = require('../validations/validateRequest');

// return securities with ticker, shares, trade history;
router.get('/getPortfolio/:portfolioName', errorHandlerMiddleware((req, res) => {

    const portfolioName = req.params.portfolioName;

    (async () => {
        const portfolio = await Portfolio.findOne(
            { name: portfolioName },
            { "securities.avgBuyPrice": 0 }
        ).catch(err => res.send(err));

        // no portfolio found;
        if (!portfolio) {
            return res.status(404).send("No such Portfolio found");
        }

        res.status(200).send(portfolio);
    })();
}));

// return securities with ticker, shares, avgBuyPrice;
router.get('/getHoldings/:portfolioName', errorHandlerMiddleware((req, res) => {

    const portfolioName = req.params.portfolioName;

    (async () => {
        const portfolio = await Portfolio.findOne(
            { name: portfolioName },
            { "securities.trades": 0 }
        ).catch(err => res.send(err));

        // no portfolio found;
        if (!portfolio) {
            return res.status(404).send("No portfolio found.");
        }
        res.status(200).send(portfolio);
    })();
}));

// get returns on portfolio
router.get('/getReturns/:portfolioName', errorHandlerMiddleware((req, res) => {

    
    const portfolioName = req.params.portfolioName;

    (async () => {
        const portfolio = await Portfolio.findOne({ "name": portfolioName }).catch(err => res.send(error));
        
        if (!portfolio) {
            return res.status(404).send("No portfolio found");
        }

        const currentPrice = 100;
        let returns = 0;
        portfolio.securities.forEach(security => {
            apiDebugger(`The returns on ${security.ticker} are ${((currentPrice - security.avgBuyPrice) * security.shares)}`);
            returns += ((currentPrice - security.avgBuyPrice) * security.shares)
        })
        console.log("Returns:\t", returns);

        res.send({
            portfolio: portfolio.name,
            cumulativeReturns: returns
        });
    })();
}));

// place a buy trade
router.post('/buy/:portfolioName', errorHandlerMiddleware((req, res) => {
    /*
        Request body includes:
        Trade object, including ticker, type, quantity, price

        TODO:
        - validations for 
            - ticker match
            - trade type == sell,
            - shares - quantity > 0 always
            - resultant shares > 0 always
    */

    // validating request body;
    const { error } = validations.validateTradeRequest(req);
    if (error) {
        throw customError(400, "Bad Request; re-check the request body.");
    } else {

        // mismatch of type;
        if (req.body.type != "buy") {
            throw customError(400, "Bad request; type must be 'buy'.")
        }

        
        const portfolioName = req.params.portfolioName;    
        const trade = req.body;
        (async () => {
            // retrieve portfolio and find relevant security;
            const portfolio = await Portfolio.findOne({ "name": portfolioName }).catch(err => res.send(err));

            if (!portfolio) {
                return res.status(404).send("No portfolio found");
            }

            const security = portfolio.securities.find(security => security.ticker == trade.ticker);

            // if the ticker does not exist, return a 404;
            if (!security) {
                return res.status(404).send("Invalid ticker.");
            }
            // register sell trade and update shares;
            security.trades.push(trade);
            let oldShares = security.shares;
            security.shares += trade.quantity;
            security.avgBuyPrice = (((security.avgBuyPrice) * (oldShares)) + ((trade.price) * (trade.quantity))) / (security.shares);

            apiDebugger(`(security.avgBuyPrice): ${security.avgBuyPrice},\nsecurity.shares: ${security.shares},\ntrade.price: ${trade.price},\ntrade.quantity: ${trade.quantity}\n`);

            // save portfolio
            try {
                await portfolio.save().then(res.status(200).send(trade));
            } catch (err) {
                let errorMessages = [];
                ex.errors.forEach(property => errorMessages.push(property));
                res.status(500).send("An error occured in saving the transaction.")
            }
        })();
    }
}));

// place a sell trade
router.post('/sell/:portfolioName', errorHandlerMiddleware((req, res) => {
    /*
        Request body includes:
        Trade object, including ticker, type, quantity

        TODO:
        - validations for 
            - ticker match
            - trade type == sell,
            - shares - quantity > 0 always
            - resultant shares > 0 always
    */
    // validating request body;
    const { error } = validations.validateTradeRequest(req);
    if (error) {
        throw customError(400, "Bad Request; re-check the request body.");
    } else {
        if (req.body.type != "sell") {
            throw customError(400, "Bad Request; type must be 'sell'.");
        }


        const portfolioName = req.params.portfolioName;    
        const trade = req.body;
        (async () => {
            // retrieve portfolio and find relevant security;
            const portfolio = await Portfolio.findOne({ "name": portfolioName }).catch(err => res.send(err));

            if (!portfolio) {
                return res.status(404).send("No portfolio found");
            }

            const security = await portfolio.securities.find(security => security.ticker == trade.ticker);

            // check that resultant share count > 0;
            if ((security.shares - trade.quantity) < 0) {
                // throw customError(422, `The given Trade will result in ${security.shares - trade.quantity} shares and cannot be processed.`);
                return res.status(422).send(`Request cannot be serviced. Results in (${security.shares - trade.quantity}) shares.`);
            }

            // register sell trade and update shares;
            security.trades.push({ "ticker": trade.ticker, "type": "sell", quantity: trade.quantity });
            security.shares -= trade.quantity;

            // save portfolio
            try {
                await portfolio.save().then(res.status(200).send(trade)).catch();
            } catch (err) {
                let errorMessages = [];
                ex.errors.forEach(property => errorMessages.push(property));
                res.status(500).send("An error occured in saving the transaction.")
            }
        })();
    }
}));

router.put('/update/:portfolioName/:id', errorHandlerMiddleware((req, res) => {
    /*
        Request body includes:
        Updated Trade object of 'buy' type, updated quantity, updated price

        TODO:
        - validations for:
            - ticker match
            - trade type == buy,
            - quantity > 0 always
    */

    const { error } = validations.validateTradeRequest(req);
    if (error) {
        throw customError(400, "Bad Request; re-check the request body.");
        // return res.status(400).send({ error: "Bad Request", message: "Recheck the request body and retry." });
    } else {

        const portfolioName = req.params.portfolioName;    
        const tradeId = req.params.id;
        const updatedTrade = req.body;
        (async () => {
            // retrieve portfolio; set security;
            const portfolio = await Portfolio.findOne({ "name": "TestPortfolio" }).catch(err => res.send(err));

            if (!portfolio) {
                return res.status(404).send("No portfolio found.");
            }

            const security = portfolio.securities.find(security => security.trades.id(tradeId));

            if (!security) {
                // throw customError(404, `No Trade found with ID(${tradeId}).`);
                return res.status(404).send(`Bad Request. No Trade found with ID(${tradeId}).`);
            }
            const trade = security.trades.find(trade => trade.id == tradeId);

            // check if updated and existing trades are both of buy type, else reject as bad request;
            if (updatedTrade.type == "buy" && trade.type == "buy" && updatedTrade.ticker == trade.ticker) {
                let oldShares = security.shares;
                security.shares = (security.shares - trade.quantity + updatedTrade.quantity)
                security.avgBuyPrice = ((security.avgBuyPrice * oldShares) -
                    (trade.quantity * trade.price) +
                    (updatedTrade.quantity * trade.price)) /
                    (security.shares)
                trade.quantity = updatedTrade.quantity;

                // save portfolio
                try {
                    await portfolio.save().then(res.status(200).send(updatedTrade));
                } catch (ex) {
                    let errorMessages = [];
                    ex.errors.forEach(property => errorMessages.push(property));
                    return res.send({ error: "An error occured in saving the transaction.", message: errorMessages })
                }

            } else {
                res.status(400).send("Trades and Updates must be of type 'buy' and have matching tickers.")
            }
        })();
    }
}));

function validateRequest(request) {
    const tradeRequestSchema = Joi.object({
        ticker: Joi.string().required().trim(),
        type: Joi.string().required().valid("buy", "sell").trim(),
        quantity: Joi.number().required().min(1).positive(),
        price: Joi.number().min(1).positive()
    })

    return tradeRequestSchema.validate(request.body);
}

module.exports = router;