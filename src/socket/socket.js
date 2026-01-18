import { io } from "socket.io-client";

const socket = io("https://code-runner.vkstore.site", {
  transports: ["websocket"],
});

export default socket;
