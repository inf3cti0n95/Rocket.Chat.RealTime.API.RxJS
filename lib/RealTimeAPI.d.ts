/**
 * Rocket.Chat RealTime API
 */
import { Observable } from "rxjs";
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
export declare class RealTimeAPI {
    url: string;
    webSocket: WebSocketSubject<{}>;
    constructor(param: string | WebSocketSubject<{}>);
    /**
     * Returns the Observable to the RealTime API Socket
     */
    getObservable(): Observable<any>;
    /**
     * onMessage
     */
    onMessage(messageHandler?: ((value: {}) => void) | undefined): void;
    /**
     * onError
     */
    onError(errorHandler?: ((error: any) => void) | undefined): void;
    /**
     * onCompletion
     */
    onCompletion(completionHandler?: (() => void) | undefined): void;
    /**
     * Subscribe to the WebSocket of the RealTime API
     */
    subscribe(messageHandler?: ((value: {}) => void) | undefined, errorHandler?: ((error: any) => void) | undefined, completionHandler?: (() => void) | undefined): void;
    /**
     * sendMessage to Rocket.Chat Server
     */
    sendMessage(messageObject: {}): void;
    /**
     * getObservableFilteredByMessageType
     */
    getObservableFilteredByMessageType(messageType: string): Observable<any>;
    /**
     * getObservableFilteredByID
     */
    getObservableFilteredByID(id: string): Observable<any>;
    /**
     * connectToServer
     */
    connectToServer(): Observable<any>;
    /**
     * keepAlive, Ping and Pong to the Rocket.Chat Server to Keep the Connection Alive.
     */
    keepAlive(): void;
}
