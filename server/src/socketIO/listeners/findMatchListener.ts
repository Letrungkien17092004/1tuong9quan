import { Socket } from "socket.io";
import z from "zod";
import { GetPlayerByIdUsecase, FindOpponentUsecase } from "../../core/usecases/index.js";

const argsSchema = z.object({
    playerId: z.string().min(1),
});

type WaitingQueueItem = {
    playerId: string
    socketId: StringConstructor
}

export default class FindMatchListener {
    private socket: Socket
    private waitingQueue: WaitingQueueItem[] = []
    private eventName: string
    private getPlayerUsecase: GetPlayerByIdUsecase
    private findOpponentUsecase: FindOpponentUsecase

    constructor(options: {
        socket: Socket,
        eventName: string,
        getPlayerUsecase: GetPlayerByIdUsecase
        findOpponentUsecase: FindOpponentUsecase
    }) {
        this.socket = options.socket
        this.eventName = options.eventName
        this.getPlayerUsecase = options.getPlayerUsecase
        this.findOpponentUsecase = options.findOpponentUsecase

    }

    factory = async (playerId: unknown, callback: unknown) => {
        try {
            const argsParsed = argsSchema.parse({
                playerId: playerId
            });

            const player = this.getPlayerUsecase.excute(argsParsed.playerId)
            if (!player) {
                this.socket.emit(this.eventName, {
                    status: "error",
                    message: "Unauthorized"
                })
                return
            }

            const opponent = this.waitingQueue.shift()
            if (!opponent) {
                this.socket.emit(this.eventName, {
                    status: "ok",
                    message: "waiting"
                })
                return
            }
            this.waitingQueue.push({
                socketId: this.socket.id,

            })
            if (typeof callback === "function") {
                callback({ status: "success" });
            }

        } catch (error) {

            if (error instanceof z.ZodError) {
                console.error("Validation Error:", error.cause);
                if (typeof callback === "function") {
                    return callback({
                        status: "error",
                        type: "VALIDATION_FAILED",
                        details: error.issues.map(e => e.message)
                    });
                }
            }
            console.error("System Error:", error);
            if (typeof callback === "function") {
                callback({
                    status: "error",
                    message: (error as Error).message
                });
            }
        }
    };
}