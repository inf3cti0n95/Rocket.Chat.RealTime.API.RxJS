"use strict";
/**
 * Rocket.Chat RealTime API
 */
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var uuid_1 = require("uuid");
var crypto_js_1 = require("crypto-js");
var RealTimeAPI = /** @class */ (function () {
    function RealTimeAPI(param) {
        switch (typeof param) {
            case "string":
                this.url = param;
                this.webSocket = rxjs_1.Observable.webSocket(this.url);
                break;
            case "object":
                this.webSocket = param;
                this.url = this.webSocket.url;
                break;
            default:
                throw new Error("Invalid Parameter to the Constructor, Parameter must be of Type WebSocketSubject or URL but was found of type \"" + typeof param + "\"");
        }
    }
    /**
     * Returns the Observable to the RealTime API Socket
     */
    RealTimeAPI.prototype.getObservable = function () {
        return this.webSocket.catch(function (err) { return rxjs_1.Observable.of(err); });
    };
    /**
     * Disconnect the WebSocket Connection between client and RealTime API
     */
    RealTimeAPI.prototype.disconnect = function () {
        return this.webSocket.unsubscribe();
    };
    /**
     * onMessage
     */
    RealTimeAPI.prototype.onMessage = function (messageHandler) {
        this.subscribe(messageHandler, undefined, undefined);
    };
    /**
     * onError
     */
    RealTimeAPI.prototype.onError = function (errorHandler) {
        this.subscribe(undefined, errorHandler, undefined);
    };
    /**
     * onCompletion
     */
    RealTimeAPI.prototype.onCompletion = function (completionHandler) {
        this.subscribe(undefined, undefined, completionHandler);
    };
    /**
     * Subscribe to the WebSocket of the RealTime API
     */
    RealTimeAPI.prototype.subscribe = function (messageHandler, errorHandler, completionHandler) {
        this.getObservable().subscribe(messageHandler, errorHandler, completionHandler);
    };
    /**
     * sendMessage to Rocket.Chat Server
     */
    RealTimeAPI.prototype.sendMessage = function (messageObject) {
        this.webSocket.next(JSON.stringify(messageObject));
    };
    /**
     * getObservableFilteredByMessageType
     */
    RealTimeAPI.prototype.getObservableFilteredByMessageType = function (messageType) {
        return this.getObservable().filter(function (message) { return message.msg === messageType; });
    };
    /**
     * getObservableFilteredByID
     */
    RealTimeAPI.prototype.getObservableFilteredByID = function (id) {
        return this.getObservable().filter(function (message) { return message.id === id; });
    };
    /**
     * connectToServer
     */
    RealTimeAPI.prototype.connectToServer = function () {
        this.sendMessage({ "msg": "connect", "version": "1", "support": ["1", "pre2", "pre1"] });
        return this.getObservableFilteredByMessageType("connected");
    };
    /**
     * keepAlive, Ping and Pong to the Rocket.Chat Server to Keep the Connection Alive.
     */
    RealTimeAPI.prototype.keepAlive = function () {
        var _this = this;
        this.getObservableFilteredByMessageType("ping").subscribe(function (message) { return _this.sendMessage({ msg: "pong" }); });
    };
    /**
     * Login with Username and Password
     */
    RealTimeAPI.prototype.login = function (username, password) {
        var _a;
        var id = uuid_1.v4();
        var usernameType = username.indexOf("@") !== -1 ? "email" : "username";
        this.sendMessage({
            "msg": "method",
            "method": "login",
            "id": id,
            "params": [
                {
                    "user": (_a = {}, _a[usernameType] = username, _a),
                    "password": {
                        "digest": crypto_js_1.SHA256(password).toString(),
                        "algorithm": "sha-256"
                    }
                }
            ]
        });
        return this.getLoginObservable(id);
    };
    /**
     * Login with Authentication Token
     */
    RealTimeAPI.prototype.loginWithAuthToken = function (authToken) {
        var id = uuid_1.v4();
        this.sendMessage({
            "msg": "method",
            "method": "login",
            "id": id,
            "params": [
                { "resume": authToken }
            ]
        });
        return this.getLoginObservable(id);
    };
    /**
     * Login with OAuth, with Client Token and Client Secret
     */
    RealTimeAPI.prototype.loginWithOAuth = function (credToken, credSecret) {
        var id = uuid_1.v4();
        this.sendMessage({
            "msg": "method",
            "method": "login",
            "id": id,
            "params": [
                {
                    "oauth": {
                        "credentialToken": credToken,
                        "credentialSecret": credSecret
                    }
                }
            ]
        });
        return this.getLoginObservable(id);
    };
    /**
     * getLoginObservable
     */
    RealTimeAPI.prototype.getLoginObservable = function (id) {
        var resultObservable = this.getObservableFilteredByID(id);
        var resultId;
        var addedObservable = this.getObservable()
            .buffer(resultObservable.map(function (_a) {
            var msg = _a.msg, error = _a.error, result = _a.result;
            if (msg === "result" && !error)
                return resultId = result.id; // Setting resultId to get Result from the buffer
        }))
            .flatMap(function (x) { return x; }) // Flattening the Buffered Messages
            .filter(function (_a) {
            var msgId = _a.id;
            return resultId !== undefined && msgId === resultId;
        }); //Filtering the "added" result message.
        return rxjs_1.Observable.merge(resultObservable, addedObservable); //Merging "result" and "added" messages.
    };
    /**
     * Get Observalble to the Result of Method Call from Rocket.Chat Realtime API
     */
    RealTimeAPI.prototype.callMethod = function (method) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var id = uuid_1.v4();
        this.sendMessage({
            "msg": "method",
            method: method,
            id: id,
            params: params
        });
        return this.getObservableFilteredByID(id);
    };
    /**
     * getSubscription
     */
    RealTimeAPI.prototype.getSubscription = function (streamName, streamParam, addEvent) {
        var id = uuid_1.v4();
        var subscription = this.webSocket.multiplex(function () { return JSON.stringify({
            "msg": "sub",
            "id": id,
            "name": streamName,
            "params": [
                streamParam,
                addEvent
            ]
        }); }, function () { return JSON.stringify({
            "msg": "unsub",
            "id": id
        }); }, function (message) { return typeof message.collection === "string" && message.collection === streamName && message.fields.eventName === streamParam; } // Proper Filtering to be done. This is temporary filter just for the stream-room-messages subscription
        );
        return subscription;
    };
    return RealTimeAPI;
}());
exports.RealTimeAPI = RealTimeAPI;
//# sourceMappingURL=RealTimeAPI.js.map