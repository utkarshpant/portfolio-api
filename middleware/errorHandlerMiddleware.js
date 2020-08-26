module.exports = function errorHandlerMiddleware(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        } catch (error) {
            next(error);
        }
    }
}
