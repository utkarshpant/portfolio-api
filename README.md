# portfolio-api

### portfolio-api is a sample portfolio tracking API built on NodeJS and MongoDB/Mongoose.
<br>

(To see the project in action, go [here.](https://portfolio-api-utk.herokuapp.com))

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

### 4.  getPortfolio:

    No request body

### 5.  getHoldings:

    No request body

### 6.  getReturns:

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

## Utility API Endpoints:

The API supports some basic **POST** requests that are detailed below. Note that these endpoints are currently for development use and thus **do not validate requests as exhaustively as the Primary API.**

The expected format for each request is:
<br><br>

### 1.  addPortfolio: (/utility/addPortfolio)

    Request Body:

    {
        "name": String
    }

### 2.  addTicker: (/api/addTicker)

    Request Body:

    {
        "ticker": String
        "portfolioId": String
    }

<br><br>

### Response by Utility Endpoints, including possible error codes.

| Method 	| Endpoint            	    | Response          	                                 | Errors Returned (Status codes)     |
|-----------|---------------------------|--------------------------------------------------------|------------------------------------|
| POST   	| utility/addPortfolio      | {name: String, securities; []}                         |500                                 |
| POST   	| api/addTicker          	| {ticker: String, avgBuyPrice: 0, shares: 0, trades: []}|400                                 |
