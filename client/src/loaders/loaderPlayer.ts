import { PlayerService } from "../services"

export async function loaderPlayer() {
    const playerService = new PlayerService("http://localhost:3000")
    const player = playerService.readPlayerFromCookie()

    if (player) {
        const validPlayer = await playerService.findById(player.playerId)
        if (validPlayer) {
            return validPlayer
        }
    }

    const createdPlayer = await playerService.create()
    return createdPlayer
}