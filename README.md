# Rocket.Chat.RealTime.API.RxJS

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Build Status](https://travis-ci.org/inf3cti0n95/Rocket.Chat.RealTime.API.RxJS.svg?branch=master)](https://travis-ci.org/inf3cti0n95/Rocket.Chat.RealTime.API.RxJS)
[![codecov](https://codecov.io/gh/inf3cti0n95/Rocket.Chat.RealTime.API.RxJS/branch/master/graph/badge.svg)](https://codecov.io/gh/inf3cti0n95/Rocket.Chat.RealTime.API.RxJS)
[![npm](https://img.shields.io/npm/v/rocket.chat.realtime.api.rxjs.svg)](https://www.npmjs.com/package/rocket.chat.realtime.api.rxjs)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Abstraction for Utilizing [Rocket.Chat](https://rocket.chat/)'s [Realtime API](https://rocket.chat/docs/developer-guides/realtime-api) Methods with [RxJS v6](http://reactivex.io/rxjs/)

## Installation

```
npm install --save rocket.chat.realtime.api.rxjs
```

For RxJS v5 Version of the Package

```
npm install --save rocket.chat.realtime.api.rxjs@1.0.0
```

## Usage

```

import { RealTimeAPI } from "rocket.chat.realtime.api.rxjs";

const realTimeAPI =  new RealTimeAPI("wss://demo.rocket.chat/websocket");
// Provide, URL to the Rocket.Chat's Realtime API.

realTimeAPI.keepAlive().subscribe();
// Responds "pong" to the "ping" message sent by the Realtime API. To keep the connection alive.

const auth = realTimeAPI.login(USERNAME, PASSWORD);
// Creating Observable

//Now subscribing the observable

    auth.subscribe(
    (data) => console.log(data),
    (err) => console.log(err),
    () => console.log('completed'));
...
...

// Use any of the methods implmented in the package.

```

## Methods

| Methods                                                    | Functionality                                                                                                                       |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| connectToServer()                                          | Initiates Connections to the Server to the RealTime API. Returns Observable with the server's response                              |
| keepAlive()                                                | Returns Observable to subscribe which Responds "pong" to the "ping" message sent by the Realtime API. To keep the connection alive. |
| login(username, password)                                  | Returns Observable to the Result/Response from the RealTime API.                                                                    |
| loginWithAuthToken(authToken)                              | Returns Observable to the Result/Response from the RealTime API.                                                                    |
| loginWithOAuth(credToken, credSecret)                      | Returns Observable to the Result/Response from the RealTime API.                                                                    |
| callMethod(methodName, ...params)                          | Returns Observable to the Result of Method Call from Rocket.Chat Realtime API                                                       |
| sendMessage(jsonObject)                                    | Sends the JSON Object to the API Server                                                                                             |
| onMessage( message => console.log(message) )               | Subscribes to the Messages sent from the server                                                                                     |
| onError( error => console.error(error) )                   | Subscribes to the Errors.                                                                                                           |
| onCompletion(() => console.info("Complete"))               | Subscribes to Completion on the Websocket Connection                                                                                |
| subscribe(messageHandler, errorHandler, completionHandler) | Subscribes to All three i.e - messages, errors and completion                                                                       |
| getObservable()                                            | Returns observable of the WebSocket Connection to the RealTime API                                                                  |
| disconnect()                                               | Disconnect the WebSocket Connection between client and RealTime API                                                                 |
|                                                            |                                                                                                                                     |

### Checkout the Rocket.Chat's [RealTime API documentation](https://rocket.chat/docs/developer-guides/realtime-api) for further information on working of the RealTime API.
