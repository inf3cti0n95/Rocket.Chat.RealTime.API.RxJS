/**
 * Rocket.Chat RealTime API
 */

import { Observable } from "rxjs";
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

export class RealTimeAPI {
    public url: string;
    public webSocket: WebSocketSubject<{}>;

    constructor(param: string | WebSocketSubject<{}>) {
        switch (typeof param) {
            case "string":
                this.url = param as string;
                this.webSocket = Observable.webSocket(this.url);
                break;
            case "object":
                this.webSocket = param as WebSocketSubject<{}>;
                this.url = this.webSocket.url;
                break;
            default:
                throw new Error(`Invalid Parameter to the Constructor, Parameter must be of Type WebSocketSubject or URL but was found of type "${typeof param}"`);
        }
    }

    /**
     * Returns the Observable to the RealTime API Socket
     */
    public getObservable() {
        return this.webSocket.catch(err => Observable.of(err));
    }

    /**
     * onMessage
     */
    public onMessage(messageHandler?: ((value: {}) => void) | undefined): void {
        this.subscribe(messageHandler, undefined, undefined);
    }


    /**
     * onError
     */
    public onError(errorHandler?: ((error: any) => void) | undefined): void {
        this.subscribe(undefined, errorHandler, undefined);
    }

    /**
     * onCompletion
     */
    public onCompletion(completionHandler?: (() => void) | undefined): void {
        this.subscribe(undefined, undefined, completionHandler);
    }

    /**
     * Subscribe to the WebSocket of the RealTime API
     */
    public subscribe(messageHandler?: ((value: {}) => void) | undefined, errorHandler?: ((error: any) => void) | undefined, completionHandler?: (() => void) | undefined) {
        this.getObservable().subscribe(messageHandler, errorHandler, completionHandler);
    }

    /**
     * sendMessage to Rocket.Chat Server
     */
    public sendMessage(messageObject: {}): void {
        this.webSocket.next(JSON.stringify(messageObject));
    }

    /**
     * getObservableFilteredByMessageType
     */
    public getObservableFilteredByMessageType(messageType: string) {
        return this.getObservable().filter((message: any) => message.msg === messageType);
    }

    /**
     * getObservableFilteredByID
     */
    public getObservableFilteredByID(id: string) {
        return this.getObservable().filter((message: any) => message.id === id);
    }

    /**
     * connectToServer
     */
    public connectToServer() {
        this.sendMessage({ "msg": "connect", "version": "1", "support": ["1", "pre2", "pre1"] });
        return this.getObservableFilteredByMessageType("connected");
    }

    /**
     * keepAlive, Ping and Pong to the Rocket.Chat Server to Keep the Connection Alive.
     */
    public keepAlive(): void {
        this.getObservableFilteredByMessageType("ping").subscribe(
            message => this.sendMessage({ msg: "pong" })
        );
    }
}