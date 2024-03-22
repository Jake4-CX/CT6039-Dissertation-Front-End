// socketio-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  isConnected: boolean;
  rooms: string[];
}

const initialState: InitialState = {
  isConnected: false,
  rooms: [],
};

const socketioSlice = createSlice({
  name: 'socketio',
  initialState,
  reducers: {
    initSocket: () => {
      // This action is primarily handled by the middleware
    },
    connectionEstablished: (state) => {
      state.isConnected = true;
    },
    connectionLost: (state) => {
      state.isConnected = false;
    },
    joinRoom: (state, action: PayloadAction<string>) => {
      const room = action.payload;
      if (!state.rooms.includes(room)) {
        state.rooms.push(room);
      }
    },
    leaveRoom: (state, action: PayloadAction<string>) => {
      const room = action.payload;
      state.rooms = state.rooms.filter(r => r !== room);
    },
  },
});

export const { initSocket, connectionEstablished, connectionLost, joinRoom, leaveRoom } = socketioSlice.actions;
export default socketioSlice.reducer;
