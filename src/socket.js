import { io } from "socket.io-client";
import baseHost from "../../config";

export const socket = io(
  baseHost,
  { path: "/smcaptar/smcaptar" },
  { transports: ["websocket"] }
);
