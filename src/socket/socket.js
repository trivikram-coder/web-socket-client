import { io } from "socket.io-client";

const socket = io("https://web-socket-server-9zh4.onrender.com", {
  transports: ["websocket"],
});

export default socket;
