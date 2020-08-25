const dbDebugger = require('debug')('app:db');
const apiDebugger = require('debug')('app:api');
const express = require('express');
const router = express.Router();

// importing models;
const Portfolio = require('../models/portfolioModel');

// utility endpoints for development;
router.post('/addPortfolio', (req, res) => {
    let portfolio = new Portfolio({
        name: req.body.name,
        securities: [
            {
                ticker: "TCS",
                shares: 0,
                avgBuyPrice: 0,
                trades: []
            },
            {
                ticker: "WIPRO",
                avgBuyPrice: 0,
                shares: 0,
                trades: []
            },
            {
                ticker: "GODREJIND",
                avgBuyPrice: 0,
                shares: 0,
                trades: []
            }
        ]
    });
    portfolio.save().then(result => res.send(result)).catch(err => res.send(err));
});


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