import { Server } from "socket.io";
import playerSocket from "./playerSocket.js";

export function registerSocket(io: Server) {
    playerSocket(io)
}



