import { io } from "socket.io-client";

export const socket = io(
  "http://134.79.206.193",
  { path: "/smcaptar/smcaptar" },
  { transports: ["websocket"] }
);
