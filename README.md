# Rocket.Chat.RealTime.API.Abstraction
Abstraction for Utilizing Rocket.Chat's Realtime API Methods with RxJS

## Installation
` npm install --save rocket.chat.realtime.api.rxjs `

## Usage

```

import { RealTimeAPI } from "rocket.chat.realtime.api.rxjs";

const realTimeAPI =  new RealTimeAPI("wss://demo.rocket.chat/websocket");
// Provide, URL to the Rocket.Chat's Realtime API.


realTimeAPI.connectToServer(); 
// Connects to the RealTime API


realTimeAPI.keepAlive(); 
// Responds "pong" to the "ping" message sent by the Realtime API. To keep the connection alive.

...
...

// Use any of the methods implmented in the package such as 

login(username, password);
//Returns Observable to the Result of the called method, in this case login

callMethod("method", ...params);
// Generic Method to Call any of the method from RealTime API. Returns Observable to the Result of the called method

callMethod("rooms/get",[{ "$date": Date.now() / 1000 }]);
// Returns Observable to the Method called (rooms/get) with params [{ "$date": Date.now() / 1000 }].

```