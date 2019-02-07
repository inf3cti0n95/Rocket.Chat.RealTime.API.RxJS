import { WebSocket, Server } from "mock-socket";
import { RealTimeAPI } from "../src/index";
import { SHA256 } from "crypto-js";
import { WebSocketSubject } from "rxjs/webSocket";

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

  it("can send connection request message", done => {
    const realtimeAPI$ = new RealTimeAPI(url);

    realtimeAPI$.connectToServer().subscribe(); // Should send pong to every ping message.

    mockServer.on("connection", (socket: WebSocket) => {
      expect(socket.url).toEqual(url); // Expecting websocket url.

      socket.on("message", data => {
        expect(data).toEqual(
          JSON.stringify({
            msg: "connect",
            version: "1",
            support: ["1", "pre2", "pre1"]
          })
        ); // Expecting ddp connection message.
        done();
      });
    });
  });

  it("can send login request with username and password", done => {
    const realtimeAPI$ = new RealTimeAPI(url);
    const username = "username";
    const password = "password";
    realtimeAPI$.login(username, password).subscribe(); // Should send pong to every ping message.

    mockServer.on("connection", (socket: WebSocket) => {
      expect(socket.url).toEqual(url); // Expecting websocket url.

      socket.on("message", data => {
        let message = JSON.parse(data);

        expect(message).toHaveProperty("id"); // Expecting to have "id" property in message.

        expect(message).toHaveProperty("msg"); // Expecting to have "msg" property in message.
        expect(message.msg).toEqual("method"); // Expecting "msg" to be "method" in message.

        expect(message).toHaveProperty("method"); // Expecting to have "method" property in message.
        expect(message.method).toEqual("login"); // Expecting "method" to be "login" in message.

        expect(message).toHaveProperty("params"); // Expecting to have "params" property in message.

        expect(message.params).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              user: { username },
              password: {
                digest: SHA256(password).toString(),
                algorithm: "sha-256"
              }
            })
          ])
        ); //Expecting params to be Array of Object { user: {username: "username"}, password: { algorithm: "sha-256", digest: "..."} }

        done();
      });
    });
  });

  it("can send login request with email and password", done => {
    const realtimeAPI$ = new RealTimeAPI(url);
    const email = "username@email.com";
    const password = "password";
    realtimeAPI$.login(email, password).subscribe(); // Should send pong to every ping message.
    mockServer.on("connection", (socket: WebSocket) => {
      expect(socket.url).toEqual(url); // Expecting websocket url.

      socket.on("message", data => {
        let message = JSON.parse(data);

        expect(message).toHaveProperty("id"); // Expecting to have "id" property in message.

        expect(message).toHaveProperty("msg"); // Expecting to have "msg" property in message.
        expect(message.msg).toEqual("method"); // Expecting "msg" to be "method" in message.

        expect(message).toHaveProperty("method"); // Expecting to have "method" property in message.
        expect(message.method).toEqual("login"); // Expecting "method" to be "login" in message.

        expect(message).toHaveProperty("params"); // Expecting to have "params" property in message.

        expect(message.params).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              user: { email },
              password: {
                digest: SHA256(password).toString(),
                algorithm: "sha-256"
              }
            })
          ])
        ); //Expecting params to be Array of Object { user: {email: "username@email.com"}, password: { algorithm: "sha-256", digest: "..."} }

        done();
      });
    });
  });

  it("can send login request with auth token", done => {
    const realtimeAPI$ = new RealTimeAPI(url);
    const token = "token";
    realtimeAPI$.loginWithAuthToken(token).subscribe(); // Should send pong to every ping message.
    mockServer.on("connection", (socket: WebSocket) => {
      expect(socket.url).toEqual(url); // Expecting websocket url.

      socket.on("message", data => {
        let message = JSON.parse(data);

        expect(message).toHaveProperty("id"); // Expecting to have "id" property in message.

        expect(message).toHaveProperty("msg"); // Expecting to have "msg" property in message.
        expect(message.msg).toEqual("method"); // Expecting "msg" to be "method" in message.

        expect(message).toHaveProperty("method"); // Expecting to have "method" property in message.
        expect(message.method).toEqual("login"); // Expecting "method" to be "login" in message.

        expect(message).toHaveProperty("params"); // Expecting to have "params" property in message.

        expect(message.params).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              resume: token
            })
          ])
        ); //Expecting params to be Array of Object { resume: "token" }

        done();
      });
    });
  });

  it("can send login request with oauth tokens", done => {
    const realtimeAPI$ = new RealTimeAPI(url);
    const credentialToken = "credentialToken";
    const credentialSecret = "credentialSecret";

    realtimeAPI$.loginWithOAuth(credentialToken, credentialSecret).subscribe(); // Should send pong to every ping message.
    mockServer.on("connection", (socket: WebSocket) => {
      expect(socket.url).toEqual(url); // Expecting websocket url.

      socket.on("message", data => {
        let message = JSON.parse(data);

        expect(message).toHaveProperty("id"); // Expecting to have "id" property in message.

        expect(message).toHaveProperty("msg"); // Expecting to have "msg" property in message.
        expect(message.msg).toEqual("method"); // Expecting "msg" to be "method" in message.

        expect(message).toHaveProperty("method"); // Expecting to have "method" property in message.
        expect(message.method).toEqual("login"); // Expecting "method" to be "login" in message.

        expect(message).toHaveProperty("params"); // Expecting to have "params" property in message.

        expect(message.params).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              oauth: {
                credentialToken,
                credentialSecret
              }
            })
          ])
        ); //Expecting params to be Array of Object { oauth: {credentialSecret: "credentialSecret", credentialToken: "credentialToken"} }

        done();
      });
    });
  });

  it("can call api methods", done => {
    const realtimeAPI$ = new RealTimeAPI(url);

    const method = "testMethod";
    const params = ["example-parameter"];

    realtimeAPI$.callMethod(method, ...params).subscribe();

    mockServer.on("connection", (socket: WebSocket) => {
      expect(socket.url).toEqual(url); // Expecting websocket url.

      socket.on("message", data => {
        let message = JSON.parse(data);

        expect(message).toHaveProperty("id"); // Expecting to have "id" property in message.

        expect(message).toHaveProperty("msg"); // Expecting to have "msg" property in message.
        expect(message.msg).toEqual("method"); // Expecting "msg" to be "method" in message.

        expect(message).toHaveProperty("method"); // Expecting to have "method" property in message.
        expect(message.method).toEqual(method); // Expecting "method" to be "testMethod" in message.

        expect(message).toHaveProperty("params"); // Expecting to have "params" property in message.

        expect(message.params).toEqual(params); //Expecting params to be [ "example-parameter" ].

        done();
      });
    });
  });

  it("can disconnect", done => {
    const realtimeAPI$ = new RealTimeAPI(url);

    realtimeAPI$.keepAlive().subscribe();

    mockServer.on("connection", (socket: WebSocket) => {
      expect(socket.url).toEqual(url); // Expecting websocket url. Connection Successful.

      mockServer.on("close", (socket: WebSocket) => {
        // Setting up Close Call listener
        expect(socket.url).toEqual(url); // Expecting websocket url. Connection Closed.
        done();
      });

      realtimeAPI$.disconnect(); // Closing the connection.
    });
  });

  it("can get the current webSocket observable", done => {
    const realtimeAPI$ = new RealTimeAPI(url);
    expect(realtimeAPI$.getObservable()).toBeInstanceOf(WebSocketSubject);
    expect(realtimeAPI$.getObservable()).toHaveProperty("_config");
    expect(realtimeAPI$.getObservable()["_config"]).toHaveProperty("url");
    expect(realtimeAPI$.getObservable()["_config"].url).toEqual(url);
    done();
  });

  it("can filter messages by id", done => {
    const realtimeAPI$ = new RealTimeAPI(url);
    const id = "1";
    const other_id = "2";

    realtimeAPI$.getObservableFilteredByID(id).subscribe(message => {
      expect(message.id).toEqual(id); // Expecting id to be 1
      done();
    });

    mockServer.on("connection", (socket: WebSocket) => {
      expect(socket.url).toEqual(url); // Expecting websocket url. Connection Successful.

      socket.send(
        JSON.stringify({
          id: other_id // Sending other id, which is expected to be filtered.
        })
      );

      socket.send(
        JSON.stringify({
          id: id // Sending id, which is expected.
        })
      );
    });
  });

  it("can filter messages by message type (msg)", done => {
    const realtimeAPI$ = new RealTimeAPI(url);
    const type = "type_1";
    const other_type = "type_2";

    realtimeAPI$.getObservableFilteredByMessageType(type).subscribe(message => {
      expect(message.msg).toEqual(type); // Expecting id to be type_1
      done();
    });

    mockServer.on("connection", (socket: WebSocket) => {
      expect(socket.url).toEqual(url); // Expecting websocket url. Connection Successful.

      socket.send(
        JSON.stringify({
          msg: other_type // Sending other type, which is expected to be filtered.
        })
      );

      socket.send(
        JSON.stringify({
          msg: type // Sending type, which is expected.
        })
      );
    });
  });

  it.skip("can get multiplexed subscription to a channel", done => {
    const realtimeAPI$ = new RealTimeAPI(url);
    // realtimeAPI$.getSubscription
    mockServer.on("connection", (socket: WebSocket) => {
      expect(socket.url).toEqual(url); // Expecting websocket url. Connection Successful.
    });
  });

  it.skip("can trigger onCompletion method when websocket disconnects", done => {
    const realtimeAPI$ = new RealTimeAPI(url);
    // realtimeAPI$.onCompletion
    mockServer.on("connection", (socket: WebSocket) => {
      expect(socket.url).toEqual(url); // Expecting websocket url. Connection Successful.
    });
  });

  it.skip("can trigger onMessage method on a new message from server", done => {
    const realtimeAPI$ = new RealTimeAPI(url);
    // realtimeAPI$.onMessage
    mockServer.on("connection", (socket: WebSocket) => {
      expect(socket.url).toEqual(url); // Expecting websocket url. Connection Successful.
    });
  });

  it.skip("can trigger onError method on an error from server", done => {
    const realtimeAPI$ = new RealTimeAPI(url);
    // realtimeAPI$.onError
    mockServer.on("connection", (socket: WebSocket) => {
      expect(socket.url).toEqual(url); // Expecting websocket url. Connection Successful.
    });
  });

  it.skip("can subscribe to websocket", done => {
    const realtimeAPI$ = new RealTimeAPI(url);
    // realtimeAPI$.subscribe
    mockServer.on("connection", (socket: WebSocket) => {
      expect(socket.url).toEqual(url); // Expecting websocket url. Connection Successful.
    });
  });

  it.skip("can send message to server", done => {
    const realtimeAPI$ = new RealTimeAPI(url);
    // realtimeAPI$.sendMessage
    mockServer.on("connection", (socket: WebSocket) => {
      expect(socket.url).toEqual(url); // Expecting websocket url. Connection Successful.
    });
  });
});
