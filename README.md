# portfolio-api

### portfolio-api is a sample portfolio tracking API built on NodeJS and MongoDB/Mongoose.
<br>

(To see the project in action, go [here.](https://portfolio-api-utk.herokuapp.com))

The API supports some basic **GET**, **POST** and **PUT** requests that are detailed below.

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