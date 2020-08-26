# portfolio-api

### portfolio-api is a sample portfolio tracking API built on NodeJS and MongoDB/Mongoose.
<br>

(To see the project in action, go [here.](https://portfolio-api-utk.herokuapp.com))

The API supports some basic **GET**, **POST** and **PUT** requests that are detailed below.

Note the expected format for each request below:
<br><br>

### 1.  buy: (/api/buy)

    Request Body:

    {
        "ticker: Uppercase String,
        "type": buy,
        "quantity": Number,
        "price": Number
    }

### 2.  sell: (/api/sell)

    Request Body:

    {
        "ticker: Uppercase String,
        "type": sell,
        "quantity": Number,
    }

### 3.  update: (/api/update)

    Request Body:

    {
        "ticker: Uppercase String,
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
| Endpoint Name 	| Method 	| Endpoint            	| Response                                                     	|
|---------------	|--------	|---------------------	|--------------------------------------------------------------	|
| getReturns    	| GET    	| api/getReturns      	| {name: String, cumulativeReturns: Number}                    	|
| getPortfolio  	| GET    	| api/getPortfolio    	| Portfolio without avgBuyPrice[TICKER] property               	|
| getHoldings   	| GET    	| api/getHoldings     	| Portfolio without Trades in any Security                     	|
| buy           	| POST   	| api/buy             	| Trade object registered or "400, BAD REQUEST"                	|
| sell          	| POST   	| api/sell            	| Trade object registered or "400, BAD REQUEST"                	|
| update        	| PUT    	| api/updateTrade/:id 	| Trade object registered or "4xx" response depending on Error 	|

The **POST** requests must be accompanied by an object resembling a Trade, with the following properties:

{
    "name": String
}