import { io } from 'socket.io-client';

let socket;

// create socket for connection
export const initializeSocket = (currentUserId) => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL, {
      query: {
        'userId': currentUserId
      }
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

