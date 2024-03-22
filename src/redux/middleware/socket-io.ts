// socketioMiddleware.ts
import SocketFactory, { SocketInterface } from "@/components/factory/socketFactory";
import { Middleware, Dispatch } from "redux";
import { connectionEstablished, connectionLost, initSocket, joinRoom } from "../features/socketio-slice";
import { addTestMetrics, addLoadTestsTest } from "../features/loadtest-slice";
import { AnyAction } from "@reduxjs/toolkit";

const SocketIOMiddleware: Middleware = (store) => {
  let socket: SocketInterface | null = null;

  return (next: Dispatch) => (action: AnyAction) => {
    // Initialize socket connection
    if (initSocket.match(action)) {
      if (!socket && typeof window !== "undefined") {
        socket = SocketFactory.create();

        socket.socket.connect();

        socket.socket.on("connect", () => {
          console.log("Successfully connected to WebSocket.");
          store.dispatch(connectionEstablished());
        });

        socket.socket.on("connection", (message) => {
          console.log(message); // "Successfully connected to WebSocket."
        });

        socket.socket.on("joinedRoom", (roomName: string) => {
          console.log(roomName); // "Successfully subscribed to room."
          next(joinRoom(roomName));
        });

        socket.socket.on("testDetails", (data: TestMetricsEmit) => {
          console.log(data);

          if (data.elapsedSeconds === -1) {
            next(addLoadTestsTest(data.test));
            next(addTestMetrics({ id: data.test.id, data: data.testMetrics }));
          } else {
            next(addTestMetrics({ id: data.test.id, data: data.testMetrics }));
            next(addLoadTestsTest(data.test))
          }

        });

        socket.socket.on("disconnect", () => {
          store.dispatch(connectionLost());
        });
      }
    }

    // Handle additional socket events and actions here if needed

    return next(action);
  };
};

export default SocketIOMiddleware;
