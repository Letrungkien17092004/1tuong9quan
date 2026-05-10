import z from "zod";
import { Handler } from "../types.js";
import { EventName } from "../eventName.js";
import {
    FindPlayerByIdUsecase,
    MovePieceUsecase
} from "../../core/usecases/index.js";

const PayloadSchema = z.object({
    matchId: z.string(),
    playerId: z.string(),
    targetPieceId: z.string(),
    targetNodeId: z.string()
});

export const createMovePieceHandler = (
    findPlayerByIdUsecase: FindPlayerByIdUsecase,
    movePieceUsecase: MovePieceUsecase
): Handler => {
    return async (context, payload, callback) => {
        try {
            if (typeof callback === "function") {
                callback({ status: "received" });
            }

            const validPayload = PayloadSchema.parse(payload);
            const player = await findPlayerByIdUsecase.execute(validPayload.playerId);

            if (!player) {
                throw new Error("player wasn't found");
            }

            const matchAfterMove = await movePieceUsecase.execute(
                validPayload.matchId,
                player.playerId,
                validPayload.targetPieceId,
                validPayload.targetNodeId
            );

            context.ioNamespace.to(matchAfterMove.matchId).emit(EventName.changeState, {
                new_state: matchAfterMove.getState()
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Validation Error:", error.cause);
                context.socket.emit(EventName.movePiece, {
                    status: "error",
                    type: "VALIDATION_FAILED",
                    details: error.issues.map(e => e.message)
                });
                return;
            }

            if (error instanceof Error) {
                context.socket.emit(EventName.movePiece, {
                    status: "error",
                    message: error.message
                });
                return;
            }

            context.socket.emit(EventName.movePiece, {
                status: "error",
                message: "Unknown error",
                error: error
            });
        }
    };
};
