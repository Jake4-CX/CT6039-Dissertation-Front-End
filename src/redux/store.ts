
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import userReduser from "./features/user-slice";
import socketReduser from "./features/socketio-slice";
import loadtestReduser from "./features/loadtest-slice";
import SocketIOMiddleware from "./middleware/socket-io";

export const store = configureStore({
  reducer: {
    userReduser,
    socketReduser,
    loadtestReduser
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(SocketIOMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;