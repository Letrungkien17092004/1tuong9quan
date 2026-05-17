import z from "zod";
import { Handler } from "../types.js";
import { EventName } from "../eventName.js";
import {
    FindPlayerByIdUsecase,
    FindOpponentOrPushToQueueUsecase,
    CreateMatchUsecase
} from "../../core/usecases/index.js";

const PayloadSchema = z.object({
    playerId: z.string().min(1)
});

export const createFindMatchHandler = (
    findPlayerByIdUsecase: FindPlayerByIdUsecase,
    findOpponentOrPushToQueueUsecase: FindOpponentOrPushToQueueUsecase,
    createMatchUsecase: CreateMatchUsecase
): Handler => {
    return async (context, payload, callback) => {
        try {
            if (typeof callback === "function") {
                callback({ status: "received" });
            }

            const validPayload = PayloadSchema.parse(payload);
            const player = await findPlayerByIdUsecase.execute(validPayload.playerId);

            if (!player) {
                context.socket.emit(EventName.findMatch, {
                    status: "error",
                    message: "Unauthorized"
                });
                return;
            }

            const opponent = await findOpponentOrPushToQueueUsecase.execute({
                socketId: context.socket.id,
                playerId: validPayload.playerId
            });

            if (!opponent) {
                context.socket.emit(EventName.findMatch, {
                    status: "ok",
                    message: "Waiting"
                });
                return;
            }

            const match = await createMatchUsecase.execute();
            context.socket.emit(EventName.findMatch, {
                status: "ok",
                message: "Match found",
                matchId: match.matchId
            });
            context.ioNamespace.to(opponent.socketId).emit(EventName.findMatch, {
                status: "ok",
                message: "Match found",
                matchId: match.matchId
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Validation Error:", error.cause);
                context.socket.emit(EventName.findMatch, {
                    status: "error",
                    message: "VALIDATION_FAILED",
                    details: error.issues.map(e => e.message)
                });
                return;
            }

            if (error instanceof Error) {
                context.socket.emit(EventName.findMatch, {
                    status: "error",
                    message: error.message
                });
                return;
            }

            context.socket.emit(EventName.findMatch, {
                status: "error",
                message: "Unknown error",
                error: error
            });
        }
    };
};
