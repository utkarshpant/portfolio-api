const mongoose = require('mongoose');

// defining the mongoose schema to use;
const tradeSchema = new mongoose.Schema({
    ticker: { type: String, uppercase: true, required: true, trim: true},
    type: { type: String, lowercase: true, required: true, trim: true, enum: ['buy', 'sell'] },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, min: 0}
})

const securitySchema = new mongoose.Schema({
    ticker: { type: String, required: true, trim: true, uppercase: true},
    shares: { type: Number, required: true, min: 0, default: 0 },
    avgBuyPrice: { type: Number, required: true, default: 0 },
    trades: [tradeSchema]
})

const portfolioSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    securities: [securitySchema]
})

module.exports = new mongoose.model("Portfolio", portfolioSchema);