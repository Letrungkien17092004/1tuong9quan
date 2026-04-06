import { Server, Socket } from "socket.io";
import { FindMatchListener, JoinMatchListener } from "../listeners/index.js";
import { 
    FindPlayerByIdUsecase, 
    FindOpponentOrPushToQueueUsecase, 
    CreateMatchUsecase,
    JoinMatchUsecase,
} from "../../core/usecases/index.js"
import { playerRepo, matchRepo, waitingQueueItemRepo } from "../../containers.js";

enum EventName {
    findMatch = "match:find",
    joinMatch = "match:join",

}

export default function matchSocket(io: Server) {

    // init usecase
    const findPlayerByIdUsecase = new FindPlayerByIdUsecase(playerRepo)
    const findOpponentOrPushToQueueUsecase = new FindOpponentOrPushToQueueUsecase(waitingQueueItemRepo)
    const createMatchUsecase = new CreateMatchUsecase(matchRepo)
    const joinMatchUsecase = new JoinMatchUsecase(matchRepo)

    // namespace for find match
    const matchNamespace = io.of('/match')

    matchNamespace.on("connection", (socket: Socket) => {

        const findMatchListener = new FindMatchListener({
            ioNamespace: matchNamespace,
            socket: socket,
            eventName: EventName.findMatch,
            findPlayerByIdUsecase: findPlayerByIdUsecase,
            findOpponentOrPushToQueueUsecase: findOpponentOrPushToQueueUsecase,
            createMatchUsecase: createMatchUsecase
        })

        const joinMatchListener  = new JoinMatchListener({
            ioNsp: matchNamespace,
            socket: socket,
            eventName: EventName.joinMatch,
            findPlayerByIdUsecase: findPlayerByIdUsecase,
            joinMatchUsecase: joinMatchUsecase
        })

        socket.on(EventName.findMatch, findMatchListener.listener)
        socket.on(EventName.joinMatch, joinMatchListener.listener)

    })


}