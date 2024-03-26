// socketioMiddleware.ts
import SocketFactory, { SocketInterface } from "@/components/factory/socketFactory";
import { connectionEstablished, connectionLost, initSocket, joinRoom } from "../features/socketio-slice";
import { addTestMetrics, addLoadTestsTest } from "../features/loadtest-slice";
import { Middleware, Dispatch, AnyAction } from '@reduxjs/toolkit';

const socketIOMiddleware: Middleware<unknown, unknown, Dispatch<AnyAction>> = (store) => (next) => (action) => {
  let socket: SocketInterface | null = null;

  // Initialize socket connection
  if (initSocket.match(action)) {
    if (!socket && typeof window !== "undefined") {
      socket = SocketFactory.create();

      socket.socket.connect();

      socket.socket.on("connect", () => {
        console.log("Successfully connected to WebSocket.");
        store.dispatch(connectionEstablished());
      });

      socket.socket.on("connection", () => {
        // console.log(message); // "Successfully connected to WebSocket."
      });

      socket.socket.on("joinedRoom", (roomName: string) => {
        // console.log(roomName); // "Successfully subscribed to room."
        next(joinRoom(roomName));
      });

      socket.socket.on("testDetails", (data: TestMetricsEmit) => {
        // console.log(data);

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

export default socketIOMiddleware;
