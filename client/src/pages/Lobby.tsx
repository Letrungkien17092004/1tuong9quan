import { PlayerService } from "../services"
import { useLoaderData } from "react-router-dom"

export async function playerLoader() {
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

export default function Lobby() {
    const player = useLoaderData() as { playerId: string, playerName: string }
    return <>
        <div className="min-h-screen bg-[#050811] flex flex-col items-center pt-10">
            <div className="w-lg flex flex-col items-center justify-center">
                <span className="text-6xl text-white font-bold">1 TƯỚNG 9 QUÂN</span>
                <span className="text-3xl text-blue-400">ONLINE</span>
            </div>
            <div className="flex justify-center mt-20">
                <button className="w-50 p-2 bg-blue-500 text-white text-2xl rounded-full cursor-pointer hover:bg-blue-500/90">TÌM TRẬN</button>
            </div>
        </div>
    </>
}
