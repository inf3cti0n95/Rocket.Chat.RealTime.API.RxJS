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
     * Disconnect the WebSocket Connection between client and RealTime API
     */
    disconnect(): void;
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
    /**
     * Login with Username and Password
     */
    login(username: string, password: string): Observable<any>;
    /**
     * Login with Authentication Token
     */
    loginWithAuthToken(authToken: string): Observable<any>;
    /**
     * Login with OAuth, with Client Token and Client Secret
     */
    loginWithOAuth(credToken: string, credSecret: string): Observable<any>;
    /**
     * getLoginObservable
     */
    getLoginObservable(id: string): Observable<any>;
    /**
     * Get Observalble to the Result of Method Call from Rocket.Chat Realtime API
     */
    callMethod(method: string, ...params: Array<{}>): Observable<any>;
    /**
     * getSubscription
     */
    getSubscription(streamName: string, streamParam: string, addEvent: boolean): Observable<any>;
}
