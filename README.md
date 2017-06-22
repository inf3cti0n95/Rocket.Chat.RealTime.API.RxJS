# Rocket.Chat.RealTime.API.Abstraction
Abstraction for Utilizing [Rocket.Chat](https://rocket.chat/)'s [Realtime API](https://rocket.chat/docs/developer-guides/realtime-api) Methods with [RxJS](http://reactivex.io/rxjs/)

## Installation
```
npm install --save rocket.chat.realtime.api.rxjs 
```

## Usage

```

import { RealTimeAPI } from "rocket.chat.realtime.api.rxjs";

const realTimeAPI =  new RealTimeAPI("wss://demo.rocket.chat/websocket");
// Provide, URL to the Rocket.Chat's Realtime API.

realTimeAPI.keepAlive(); 
// Responds "pong" to the "ping" message sent by the Realtime API. To keep the connection alive.

...
...

// Use any of the methods implmented in the package.

```

## Methods

| Methods                                                    	| Functionality                                                                                 	|
|------------------------------------------------------------	|-----------------------------------------------------------------------------------------------	|
| connectToServer()                                          	| Initiates Connections to the Server to the RealTime API. Returns Observable with the server's response                                                                 	|
| keepAlive()                                                	| Responds "pong" to the "ping" message sent by the Realtime API. To keep the connection alive. 	|
| login(username, password)                                  	| Returns Observable to the Result/Response from the RealTime API.                              	|
| loginWithAuthToken(authToken)                              	| Returns Observable to the Result/Response from the RealTime API.                              	|
| loginWithOAuth(credToken, credSecret)                      	| Returns Observable to the Result/Response from the RealTime API.                              	|
| callMethod(methodName, ...params)                          	| Returns Observable to the Result of Method Call from Rocket.Chat Realtime API                	|
| sendMessage(jsonObject)                                    	| Sends the JSON Object to the API Server                                                       	|
| onMessage( message => console.log(message) )               	| Subscribes to the Messages sent from the server                                               	|
| onError( error => console.error(error) )                   	| Subscribes to the Errors.                                                                     	|
| onCompletion(() => console.info("Complete"))             	  | Subscribes to Completion on the Websocket Connection                                          	|
| subscribe(messageHandler, errorHandler, completionHandler) 	| Subscribes to All three i.e - messages, errors and completion                                          	|
| getObservable()                                            	| Returns observable of the WebSocket Connection to the RealTime API                            	|
|                                                            	|                                                                                               	|


### Checkout the Rocket.Chat's [RealTime API documentation](https://rocket.chat/docs/developer-guides/realtime-api) for furter information on working of the RealTime API.
