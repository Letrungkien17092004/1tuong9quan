import { Server, Socket } from "socket.io";
import {
    FindMatchListener,
    JoinMatchListener,
    MovePieceListener,
    CapturePieceListener
} from "../listeners/index.js";

import {
    FindPlayerByIdUsecase,
    FindOpponentOrPushToQueueUsecase,
    CreateMatchUsecase,
    JoinMatchUsecase,
    MovePieceUsecase,
    CapturePieceUsecase
} from "../../core/usecases/index.js"

import { playerRepo, matchRepo, waitingQueueItemRepo } from "../../containers.js";
import { EventName } from "./eventName.js";
export default function matchSocket(io: Server) {

    // init usecase
    const findPlayerByIdUsecase = new FindPlayerByIdUsecase(playerRepo)
    const findOpponentOrPushToQueueUsecase = new FindOpponentOrPushToQueueUsecase(waitingQueueItemRepo)
    const createMatchUsecase = new CreateMatchUsecase(matchRepo)
    const joinMatchUsecase = new JoinMatchUsecase(matchRepo)
    const movePieceUsecase = new MovePieceUsecase(matchRepo)
    const capturePieceUsecase = new CapturePieceUsecase(matchRepo)

    // namespace for find match
    const matchNamespace = io.of('/match')

    matchNamespace.on("connection", (socket: Socket) => {

        const findMatchListener = new FindMatchListener({
            ioNamespace: matchNamespace,
            socket: socket,
            findPlayerByIdUsecase: findPlayerByIdUsecase,
            findOpponentOrPushToQueueUsecase: findOpponentOrPushToQueueUsecase,
            createMatchUsecase: createMatchUsecase
        })

        const joinMatchListener = new JoinMatchListener({
            ioNsp: matchNamespace,
            socket: socket,
            findPlayerByIdUsecase: findPlayerByIdUsecase,
            joinMatchUsecase: joinMatchUsecase
        })

        const movePieceListener = new MovePieceListener({
            ioNsp: matchNamespace,
            socket: socket,
            findPlayerByIdUsecase: findPlayerByIdUsecase,
            movePieceUsecase: movePieceUsecase
        })

        const capturePieceListener = new CapturePieceListener({
            ioNsp: matchNamespace,
            socket: socket,
            findPlayerByIdUsecase: findPlayerByIdUsecase,
            capturePieceUsecase: capturePieceUsecase
        })

        socket.on(EventName.findMatch, findMatchListener.listener)
        socket.on(EventName.joinMatch, joinMatchListener.listener)
        socket.on(EventName.movePiece, movePieceListener.listener)
        socket.on(EventName.capturePiece, capturePieceListener.listener)

    })


}