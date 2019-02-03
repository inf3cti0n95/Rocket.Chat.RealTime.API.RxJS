import { WebSocket, Server } from "mock-socket";
import { RealTimeAPI } from "../src/index";

describe("RealTimeAPI tests", () => {
  const url = "ws://localhost:8080/";
  let mockServer;

  beforeEach(() => {
    mockServer = new Server(url);
  });

  afterEach(() => {
    let closer = {
      code: 0,
      reason: "disconnected",
      wasClean: true
    };
    mockServer.close(closer);
  });

  it("can connect", done => {
    const realtimeAPI$ = new RealTimeAPI(url); // Connecting to websocket url.

    realtimeAPI$.subscribe();

    mockServer.on("connection", (socket: WebSocket) => {
      expect(socket.url).toEqual(url); // Expecting websocket url.
      done();
    });
  });

  it("can send pong for every ping", done => {
    const realtimeAPI$ = new RealTimeAPI(url);

    realtimeAPI$.keepAlive().subscribe(); // Should send pong to every ping message.

    mockServer.on("connection", (socket: WebSocket) => {
      expect(socket.url).toEqual(url); // Expecting websocket url.

      socket.send(JSON.stringify({ msg: "ping" })); // Sending "ping" message.
      socket.on("message", data => {
        expect(data).toEqual(JSON.stringify({ msg: "pong" })); // Expecting to receive "pong" message.
        done();
      });
    });
  });
});
