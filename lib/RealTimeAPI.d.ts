/**
 * Rocket.Chat RealTime API
 */
import { WebSocketSubject, WebSocketSubjectConfig } from "rxjs/webSocket";
export declare class RealTimeAPI {
    webSocket: WebSocketSubject<any>;
    constructor(param: string | WebSocketSubjectConfig<any>);
    /**
     * Returns the Observable to the RealTime API Socket
     */
    getObservable(): WebSocketSubject<any>;
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
    sendMessage(messageObject: any): void;
    /**
     * getObservableFilteredByMessageType
     */
    getObservableFilteredByMessageType(messageType: string): import("rxjs/internal/Observable").Observable<any>;
    /**
     * getObservableFilteredByID
     */
    getObservableFilteredByID(id: string): import("rxjs/internal/Observable").Observable<any>;
    /**
     * connectToServer
     */
    connectToServer(): import("rxjs/internal/Observable").Observable<any>;
    /**
     * Returns an Observable to subscribe to keepAlive, Ping and Pong to the Rocket.Chat Server to Keep the Connection Alive.
     */
    keepAlive(): import("rxjs/internal/Observable").Observable<any>;
    /**
     * Login with Username and Password
     */
    login(username: string, password: string): import("rxjs/internal/Observable").Observable<any>;
    /**
     * Login with Authentication Token
     */
    loginWithAuthToken(authToken: string): import("rxjs/internal/Observable").Observable<any>;
    /**
     * Login with OAuth, with Client Token and Client Secret
     */
    loginWithOAuth(credToken: string, credSecret: string): import("rxjs/internal/Observable").Observable<any>;
    /**
     * getLoginObservable
     */
    getLoginObservable(id: string): import("rxjs/internal/Observable").Observable<any>;
    /**
     * Get Observalble to the Result of Method Call from Rocket.Chat Realtime API
     */
    callMethod(method: string, ...params: Array<{}>): import("rxjs/internal/Observable").Observable<any>;
    /**
     * getSubscription
     */
    getSubscription(streamName: string, streamParam: any, addEvent: boolean): import("rxjs/internal/Observable").Observable<any>;
}
