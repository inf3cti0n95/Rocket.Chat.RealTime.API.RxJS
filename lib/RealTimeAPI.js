"use strict";
/**
 * Rocket.Chat RealTime API
 */
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var uuid_1 = require("uuid");
var crypto_js_1 = require("crypto-js");
var RealTimeAPI = (function () {
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
        var id = uuid_1.v1();
        this.sendMessage({
            "msg": "method",
            "method": "login",
            "id": id,
            "params": [
                {
                    "user": { "username": username },
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
        var id = uuid_1.v1();
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
        var id = uuid_1.v1();
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
        resultObservable.subscribe(function (message) {
            if ((message.id === id && message.msg === "result" && !message.error))
                resultId = message.result.id;
        });
        var addedObservable = this.getObservable().buffer(resultObservable).find(function (obj) { return obj.find(function (msg) { return msg.id === resultId && resultId !== undefined; }) !== undefined; }).map(function (obj) { return obj[0]; });
        return rxjs_1.Observable.merge(resultObservable, addedObservable);
    };
    /**
     * Get Observalble to the Result of Method Call from Rocket.Chat Realtime API
     */
    RealTimeAPI.prototype.callMethod = function (method) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var id = uuid_1.v1();
        this.sendMessage({
            "msg": "method",
            method: method,
            id: id,
            params: params
        });
        return this.getObservableFilteredByID(id);
    };
    return RealTimeAPI;
}());
exports.RealTimeAPI = RealTimeAPI;
//# sourceMappingURL=RealTimeAPI.js.map