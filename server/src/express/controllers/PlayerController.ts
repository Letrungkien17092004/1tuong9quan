import { CreatePlayerUsecase, FindPlayerByIdUsecase } from "../../core/usecases";
import { Request, Response } from "express";

export default class PlayerController {
    private createPlayerUsecase: CreatePlayerUsecase
    private findPlayerByIdUsecase: FindPlayerByIdUsecase

    constructor(createPlayerUsecase: CreatePlayerUsecase, findPlayerByIdUsecase: FindPlayerByIdUsecase) {
        this.createPlayerUsecase = createPlayerUsecase
        this.findPlayerByIdUsecase = findPlayerByIdUsecase
        this.create.bind(this)
        this.findById.bind(this)
    }

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const newPlayer = await this.createPlayerUsecase.execute()
            res.status(201).json({
                player: newPlayer
            })
            return
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    "error:": error.message
                })
                return
            }

            res.status(500).json({
                "error:": error
            })
            return
        }
    }

    findById = async (req: Request, res: Response): Promise<void> => {
        try {
            const playerId = req.params.id
            if (!playerId || typeof playerId !== 'string') {
                res.status(400).json({
                    error: 'Invalid player ID'
                })
                return
            }
            const player = await this.findPlayerByIdUsecase.execute(playerId)
            res.status(200).json({
                player: player
            })
            return
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    "error:": error.message
                })
                return
            }

            res.status(500).json({
                "error:": error
            })
            return
        }
    }


}