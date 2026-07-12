import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
let socket;

export const getSocket = () => {
  const token = localStorage.getItem("disaster_token");

  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: { token },
    });
  }

  socket.auth = { token };
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
};
