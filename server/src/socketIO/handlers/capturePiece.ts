import z from "zod";
import { Handler } from "../types.js";
import { EventName } from "../eventName.js";
import {
    FindPlayerByIdUsecase,
    CapturePieceUsecase
} from "../../core/usecases/index.js";

const PayloadSchema = z.object({
    matchId: z.string(),
    playerId: z.string(),
    attackerId: z.string(),
    targetId: z.string()
});

export const createCapturePieceHandler = (
    findPlayerByIdUsecase: FindPlayerByIdUsecase,
    capturePieceUsecase: CapturePieceUsecase
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

            const matchAfterCapture = await capturePieceUsecase.execute(
                validPayload.matchId,
                player.playerId,
                validPayload.attackerId,
                validPayload.targetId
            );

            context.ioNamespace.to(matchAfterCapture.matchId).emit(EventName.changeState, {
                new_state: matchAfterCapture.getState()
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Validation Error:", error.cause);
                context.socket.emit(EventName.capturePiece, {
                    status: "error",
                    type: "VALIDATION_FAILED",
                    details: error.issues.map(e => e.message)
                });
                return;
            }

            if (error instanceof Error) {
                context.socket.emit(EventName.capturePiece, {
                    status: "error",
                    message: error.message
                });
                return;
            }

            context.socket.emit(EventName.capturePiece, {
                status: "error",
                message: "Unknown error",
                error: error
            });
        }
    };
};
