import { CreatePlayerUsecase } from "../../core/usecases";
import { Request, Response } from "express";

export default class PlayerController {
    private createPlayerUsecase: CreatePlayerUsecase

    constructor(createPlayerUsecase: CreatePlayerUsecase) {
        this.createPlayerUsecase = createPlayerUsecase
        this.create.bind(this)
    }

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const newPlayer = await this.createPlayerUsecase.excute()
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


}