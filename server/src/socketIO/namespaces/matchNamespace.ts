import { Server, Socket } from "socket.io";
import { EventName } from "../eventName.js";
import { SocketContext } from "../types.js";
import {
    createFindMatchHandler,
    createJoinMatchHandler,
    createMovePieceHandler,
    createCapturePieceHandler
} from "../handlers/index.js";
import {
    FindPlayerByIdUsecase,
    FindOpponentOrPushToQueueUsecase,
    CreateMatchUsecase,
    JoinMatchUsecase,
    MovePieceUsecase,
    CapturePieceUsecase
} from "../../core/usecases/index.js";
import { playerRepo, matchRepo, waitingQueueItemRepo } from "../../containers.js";

export function bootMatchNamespace(io: Server) {
    // Initialize usecases once
    const findPlayerByIdUsecase = new FindPlayerByIdUsecase(playerRepo);
    const findOpponentOrPushToQueueUsecase = new FindOpponentOrPushToQueueUsecase(waitingQueueItemRepo);
    const createMatchUsecase = new CreateMatchUsecase(matchRepo);
    const joinMatchUsecase = new JoinMatchUsecase(matchRepo);
    const movePieceUsecase = new MovePieceUsecase(matchRepo);
    const capturePieceUsecase = new CapturePieceUsecase(matchRepo);

    // Create handlers
    const findMatchHandler = createFindMatchHandler(
        findPlayerByIdUsecase,
        findOpponentOrPushToQueueUsecase,
        createMatchUsecase
    );

    const joinMatchHandler = createJoinMatchHandler(
        findPlayerByIdUsecase,
        joinMatchUsecase
    );

    const movePieceHandler = createMovePieceHandler(
        findPlayerByIdUsecase,
        movePieceUsecase
    );

    const capturePieceHandler = createCapturePieceHandler(
        findPlayerByIdUsecase,
        capturePieceUsecase
    );

    // Create namespace
    const matchNamespace = io.of('/match');

    // Handle connections
    matchNamespace.on("connection", (socket: Socket) => {
        const context: SocketContext = {
            ioNamespace: matchNamespace,
            socket: socket
        };

        // Register event listeners

        // event: match:find
        // payload: {playerId: string}
        socket.on(EventName.findMatch, (payload: unknown, callback: unknown) => {
            findMatchHandler(context, payload, callback);
        });

        // event: match:join
        // payload: {playerId: strin, matchId: string}
        socket.on(EventName.joinMatch, (payload: unknown, callback: unknown) => {
            console.log("joine match triger. payload: ", payload)
            joinMatchHandler(context, payload, callback);
        });

        // event: match:move
        /* payload: {
            matchId: string,
            playerId: string,
            targetPieceId: string,
            targetNodeId: string
        }
        */
        socket.on(EventName.movePiece, (payload: unknown, callback: unknown) => {
            movePieceHandler(context, payload, callback);
        });

        // event: match:capture
        /* payload: {
            matchId: string,
            playerId: string,
            attackerId: string,
            targetId: string
        }
        */
        socket.on(EventName.capturePiece, (payload: unknown, callback: unknown) => {
            capturePieceHandler(context, payload, callback);
        });
    });

    return matchNamespace;
}
