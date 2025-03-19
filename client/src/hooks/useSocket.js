
import { useContext, createContext } from 'react';

export const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
}