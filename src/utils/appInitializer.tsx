import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";
import { initSocket } from '@/redux/features/socketio-slice';
import { AppDispatch } from "@/redux/store";

type AppInitializerProps = {
  children: ReactNode;
};

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(initSocket());
  }, [dispatch]);

  return children;
};

export default AppInitializer;