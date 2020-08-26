const Joi = require("joi");

// function to validate requests;
module.exports = function validateTradeRequest(request) {
    const tradeRequestSchema = Joi.object({
        ticker: Joi.string().required().trim(),
        type: Joi.string().required().valid("buy", "sell").trim(),
        quantity: Joi.number().required().min(1).positive(),
        price: Joi.number().min(1).positive()
    })

    return tradeRequestSchema.validate(request.body);
}

module.exports = function validateUtilityRequest(request) {
    const utilityRequestSchema = Joi.object({
        ticker: Joi.string().trim().uppercase(),
        name: Joi.string().trim(),
    })

    return tradeRequestSchema.validate(request.body);
}