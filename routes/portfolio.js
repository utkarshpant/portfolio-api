const dbDebugger = require('debug')('app:db');
const apiDebugger = require('debug')('app:api');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

// importing models;
const Portfolio = require('../models/portfolioModel');
const { string } = require('joi');

// return securities with ticker, shares, trade history;
router.get('/getPortfolio', (req, res) => {
    (async () => {
        console.log("Got here");
        const portfolio = await Portfolio.findOne(
            { name: "TestPortfolio" },
            { "securities.avgBuyPrice": 0 }
        ).catch(err => res.send(err));
        res.send(portfolio)
    })();
});

// return securities with ticker, shares, avgBuyPrice;
router.get('/getHoldings', (req, res) => {
    (async () => {
        const portfolio = await Portfolio.findOne(
            { name: "TestPortfolio" },
            { "securities.trades": 0 }
        ).catch(err => res.send(err));
        res.send(portfolio);
    })();
});

// get returns on portfolio
router.get('/getReturns', (req, res) => {
    (async () => {
        const portfolio = await Portfolio.findOne({ "name": "TestPortfolio" }).catch(err => res.send(error));
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
        })
    })();
});

// place a buy trade
router.post('/buy', (req, res) => {
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
    const { error } = validateRequest(req);
    if (error) {
        return res.status(400).send({ error: "Bad Request", message: "Recheck the request body and retry." })
    } else {
        if (req.body.type != "buy") {
            return res.status(400).send({ error: "Bad Request", message: "Recheck the request body and retry." });
        }
        const trade = req.body;
        (async () => {
            // retrieve portfolio and find relevant security;
            const portfolio = await Portfolio.findOne({ "name": "TestPortfolio" }).catch(err => res.send(err));
            const security = portfolio.securities.find(security => security.ticker == trade.ticker);

            // register sell trade and update shares;
            security.trades.push(trade);
            let oldShares = security.shares;
            security.shares += trade.quantity;
            security.avgBuyPrice = (((security.avgBuyPrice) * (oldShares)) + ((trade.price) * (trade.quantity))) / (security.shares);

            apiDebugger(`(security.avgBuyPrice): ${security.avgBuyPrice},\nsecurity.shares: ${security.shares},\ntrade.price: ${trade.price},\ntrade.quantity: ${trade.quantity}\n`);

            // save portfolio
            try {
                portfolio.save().then(res.status(200).send(trade));
            } catch(ex) {
                let errorMessages = [];
                ex.errors.forEach(property => errorMessages.push(property));
                res.send({error: "An error occured in saving the transaction.", message: errorMessages})
            }
        })();
    }
});

// place a sell trade
router.post('/sell', (req, res) => {
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
    const { error, result } = validateRequest(req);
    if (error) {
        res.status(400).send({ error: "Bad Request", message: "Recheck the request body and retry." });
    } else {
        if (req.body.type != "sell") {
            return res.status(400).send({ error: "Bad Request", message: "Recheck the request body and retry." });
        }
        const trade = req.body;
        (async () => {
            // retrieve portfolio and find relevant security;
            const portfolio = await Portfolio.findOne({ "name": "TestPortfolio" });
            const security = await portfolio.securities.find(security => security.ticker == trade.ticker);

            // check that resultant share count > 0;
            if ((security.shares - trade.quantity) < 0) {
                return res.status(400).send({ error: "Bad Request", message: `Request cannot be serviced. Result (${security.shares - trade.quantity})` });
            }

            // register sell trade and update shares;
            security.trades.push(trade);
            security.shares -= trade.quantity;

            // save portfolio
            try {
                portfolio.save().then(res.status(200).send(trade));
            } catch(ex) {
                let errorMessages = [];
                ex.errors.forEach(property => errorMessages.push(property));
                res.send({error: "An error occured in saving the transaction.", message: errorMessages})
            }
        })();
    }


});

router.put('/updateTrade/:id', (req, res) => {
    /*
        Request body includes:
        Updated Trade object of 'buy' type, updated quantity, updated price

        TODO:
        - validations for:
            - ticker match
            - trade type == buy,
            - quantity > 0 always
    */
   const { error, result } = validateRequest(req);
    if (error) {
        return res.status(400).send({ error: "Bad Request", message: "Recheck the request body and retry." });
    } else {
        // check for invalid Trade ID;
        if (req.params.id == null || req.params.id == "") {
            return res.status(400).send({ error: "Bad Request", message: "Recheck the request body and retry." });
        }
        const updatedTrade = req.body;
        (async () => {
            // retrieve portfolio; set security;
            const portfolio = await Portfolio.findOne({ "name": "TestPortfolio" });
            const tradeId = req.params.id;
            const security = portfolio.securities.find(security => security.trades.id(tradeId));

            if (!security) {
                return res.status(400).send({ error: "Bad Request", message: `Invalid ID(${tradeId}). Recheck and retry.` });
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
                portfolio.save().then(res.status(200).send(updatedTrade));
            } catch(ex) {
                let errorMessages = [];
                ex.errors.forEach(property => errorMessages.push(property));
                res.send({error: "An error occured in saving the transaction.", message: errorMessages})
            }
    
            } else {
                res.status(400).send({
                    error: "Bad Request",
                    message: "Trades and Updates must be of type 'buy' and have matching tickers"
                })
            }
        })();
    }
    
    
})

function validateRequest(request) {
    const tradeRequestSchema = Joi.object({
        ticker: Joi.string().required().uppercase().valid('TCS', 'WIPRO', 'GODREJIND').trim(),
        type: Joi.string().required().valid("buy", "sell").lowercase().trim(),
        quantity: Joi.number().required().min(0).positive(),
        price: Joi.number().min(0).positive()
    })

    return tradeRequestSchema.validate(request.body);
}

module.exports = router;