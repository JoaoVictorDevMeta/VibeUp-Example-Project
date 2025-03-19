import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useState } from 'react';
import getUserState from '../utils/getUserState';
import { SocketContext } from '../hooks/useSocket';

export const SocketContextProvider = ({children}) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const user = getUserState();

    useEffect(() => {
        const socket = io('http://localhost:5000', {
            query:{
                userId: user?.id
            }
        });

        setSocket(socket);

        socket.on("getOnlineUsers", (users) => {
            setOnlineUsers(users);
        })
        
        return () => socket && socket.close();
    }, [user?.id]);
    
    return (
        <SocketContext.Provider value={{socket, onlineUsers}}>
            {children}
        </SocketContext.Provider>
    )
}