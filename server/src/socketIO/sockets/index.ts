import { Server } from "socket.io";
import matchSocket from "./matchSocket.js";

export function registerSocket(io: Server) {
    matchSocket(io)
}



