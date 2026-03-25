import { Server, Socket } from "socket.io";
import { FindMatchListener } from "../listeners/index.js";
import { GetPlayerByIdUsecase, FindOpponentUsecase, CreateMatchUsecase } from "../../core/usecases/index.js"
import { playerRepo, matchRepo, waitingQueueItemRepo } from "../../containers.js";


type SocketPlayer = {
    socketId: string
}

export default function playerSocket(io: Server) {
    const playerNamespace = io.of('/player')
    const waitingQueue: Array<SocketPlayer> = []

    playerNamespace.on("connection", (socket: Socket) => {
        const getPlayerByIdUsecase = new GetPlayerByIdUsecase(playerRepo)
        const findOppponentUsecase = new FindOpponentUsecase(waitingQueueItemRepo)
        const createMatchUsecase = new CreateMatchUsecase(matchRepo)

        const findMatchListener = new FindMatchListener({
            ioNamespace: playerNamespace,
            socket: socket,
            eventName: "player:find-match",
            getPlayerUsecase: getPlayerByIdUsecase,
            findOpponentUsecase: findOppponentUsecase,
            createMatchUsecase: createMatchUsecase
        })

        socket.on("player:find-match", findMatchListener.listener)
    })


}