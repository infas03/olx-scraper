import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [newListings, setNewListings] = useState(false);
  const [scrapeStatus, setScrapeStatus] = useState(null);

  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_API_URL);
    
    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socketInstance.on('new-listings', (data) => {
      console.log('new-listings: ', data);
      setNewListings(data);
    });

    socketInstance.on('scrape-status', (status) => {
      console.log('scrape-status: ', status);
      setScrapeStatus(status);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, newListings, scrapeStatus, clearNewListings: () => setNewListings(false) }}>
      {children}
    </SocketContext.Provider>
  );
};