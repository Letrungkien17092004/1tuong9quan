import { Socket, Namespace } from "socket.io";

export interface SocketContext {
    ioNamespace: Namespace;
    socket: Socket;
}

export type Handler<T = unknown> = (
    context: SocketContext,
    payload: T,
    callback?: unknown
) => Promise<void> | void;
