# portfolio-api

### portfolio-api is a sample portfolio tracking API built on NodeJS and MongoDB/Mongoose.

(To see the project in action, go [here.](https://portfolio-api-utk.herokuapp.com))

<br>

# (api/v2) is an improved version of the portfolio-api
It removes the dependency on a portfolio named "TestPortfolio" existing in the database.
All primary requests now require the "name" of the portfolio to be provided in the request.
<br>

NOTE: To test the API, please use portfolio name: **TestPortfolio**, or create a portfolio as defined in the Utility endpoints below.

<br>

## Primary API Endpoints:

The API supports some basic **GET**, **POST** and **PUT** requests that are detailed below.

The expected format for each request is:
<br><br>

### 1.  buy: (/api/buy/:portfolioName)

    Request Body:

    {
        "ticker": Uppercase String,
        "type": buy,
        "quantity": Number,
        "price": Number
    }

### 2.  sell: (/api/sell/:portfolioName)

    Request Body:

    {
        "ticker": Uppercase String,
        "type": sell,
        "quantity": Number,
    }

### 3.  update: (/api/update/:portfolioName/:id)

    Request Body:

    {
        "ticker": Uppercase String,
        "type": buy,
        "quantity": Number,
    }

### 4.  getPortfolio: (/api/v2/getPortfolio/:portfolioName)

    No request body

### 5.  getHoldings: (/api/v2/getHoldings/:portfolioName)

    No request body

### 6.  getReturns: (/api/v2/getHoldings/:portfolioName)

    No request body


<br><br>

### Response by API Endpoints, including possible error codes:

| Method 	| Endpoint            	| Response                                                     	    | Errors Returned (Status codes)     |
|--------	|---------------------	|-------------------------------------------------------------------|------------------------------------|
| GET    	| api/v2/getReturns/:portfolioName      	| {name: String, cumulativeReturns: [Number]}                  	    |400, 404                            |
| GET    	| api/v2/getPortfolio/:portfolioName    	| {name: String, securities: [Securities]}                          |400, 404                            |
| GET    	| api/v2/getHoldings/:portfolioName     	| {name: String, securities: [Securities]}                     	    |400, 404                            |
| POST   	| api/v2/buy/:portfolioName             	| {ticker: String, type: "buy", quantity: Number, price: Number}    |400, 500                            |
| POST   	| api/v2/sell:portfolioName            	| Trade object saved or "400, BAD REQUEST"                	    |400, 422                            |
| PUT    	| api/v2/update/:portfolioName/:id 	| Trade object saved or "4xx" response depending on Error 	    |400, 404                            |

<br><br>


# Existing portfolio-api
### Depends on the existence of a portfolio named "TestPortfolio" existing in the database.

## Primary API Endpoints:

The API supports some basic **GET**, **POST** and **PUT** requests that are detailed below.

The expected format for each request is:
<br><br>

### 1.  buy: (/api/buy)

    Request Body:

    {
        "ticker": Uppercase String,
        "type": buy,
        "quantity": Number,
        "price": Number
    }

### 2.  sell: (/api/sell)

    Request Body:

    {
        "ticker": Uppercase String,
        "type": sell,
        "quantity": Number,
    }

### 3.  update: (/api/update)

    Request Body:

    {
        "ticker": Uppercase String,
        "type": buy,
        "quantity": Number,
    }

### 4.  getPortfolio: (/api/getPortfolio)

    No request body

### 5.  getHoldings: (/api/getHoldings)

    No request body

### 6.  getReturns: (/api/getReturns)

    No request body


<br><br>

### Response by API Endpoints, including possible error codes:

| Method 	| Endpoint            	| Response                                                     	    | Errors Returned (Status codes)     |
|--------	|---------------------	|-------------------------------------------------------------------|------------------------------------|
| GET    	| api/getReturns      	| {name: String, cumulativeReturns: [Number]}                  	    |None expected                       |
| GET    	| api/getPortfolio    	| {name: String, securities: [Securities]}                          |None expected                       |
| GET    	| api/getHoldings     	| {name: String, securities: [Securities]}                     	    |None expected                       |
| POST   	| api/buy             	| {ticker: String, type: "buy", quantity: Number, price: Number}    |400, 500                            |
| POST   	| api/sell            	| Trade object registered or "400, BAD REQUEST"                	    |400, 422                            |
| PUT    	| api/updateTrade/:id 	| Trade object registered or "4xx" response depending on Error 	    |400, 404                            |

<br><br>

# Utility API Endpoints:

The API supports some basic **POST** requests that are detailed below. Note that these endpoints are currently for development use and thus **do not validate requests as exhaustively as the Primary API.**

The expected format for each request is:
<br><br>

### 1.  addPortfolio: (/utility/addPortfolio)

    Request Body:

    {
        "name": String
    }

### 2.  addTicker: (/api/addTicker/:portfolioName)

    Request Body:

    {
        "ticker": String
        "portfolioId": String
    }



### Response by Utility Endpoints, including possible error codes.

| Method 	| Endpoint            	    | Response          	                                 | Errors Returned (Status codes)     |
|-----------|---------------------------|--------------------------------------------------------|------------------------------------|
| POST   	| utility/addPortfolio      | {name: String, securities; []}                         |400, 500                            |
| POST   	| api/addTicker          	| {ticker: String, avgBuyPrice: 0, shares: 0, trades: []}|400, 404                            |
