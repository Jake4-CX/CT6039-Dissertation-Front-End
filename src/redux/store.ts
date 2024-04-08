
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import userReduser from "./features/user-slice";
import socketReduser from "./features/socketio-slice";
import loadtestReduser from "./features/loadtest-slice";
import SocketIOMiddleware from "./middleware/socket-io";

const rootReducer = combineReducers({
  userReduser,
  socketReduser,
  loadtestReduser
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(SocketIOMiddleware)
});

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(SocketIOMiddleware),
    preloadedState
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;