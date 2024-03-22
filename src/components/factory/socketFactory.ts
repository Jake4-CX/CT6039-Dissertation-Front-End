import { io, Socket } from "socket.io-client";

export interface SocketInterface {
  socket: Socket;
}

class SocketConnection implements SocketInterface {
  public socket: Socket;
  public socketEndpoint = import.meta.env.VITE_API_URL as string;

  constructor() {
    this.socket = io(this.socketEndpoint, {
      transports: ['websocket'],
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: Infinity
    });
  }
}

let socketConnection: SocketConnection | undefined;

class SocketFactory {
  public static create(): SocketConnection {
    if (!socketConnection) {
      socketConnection = new SocketConnection();
    }
    return socketConnection;
  }
}

export default SocketFactory;