import { playerService } from "../services"
import { useLoaderData, useNavigate } from "react-router-dom"
import { useLobby } from "../hooks"
import { useCallback, useEffect } from "react"

export async function playerLoader() {
    const playerCache = playerService.cacheData.player
    if (playerCache) {
        console.log("cache run")
        return playerCache
    }
    const player = playerService.readPlayerFromCookie()
    console.log("no cache run")
    if (player) {
        const validPlayer = await playerService.findById(player.playerId)
        if (validPlayer) {
            playerService.updateCache(validPlayer)
            return validPlayer
        }
    }

    const createdPlayer = await playerService.create()
    playerService.updateCache(createdPlayer)
    return createdPlayer
}

export default function Lobby() {
    const player = useLoaderData() as { playerId: string, playerName: string }
    const { findStatus, findMatch, matchId } = useLobby()
    const navigate = useNavigate()
    useEffect(() => {
        if (!matchId) { return }

        navigate(`/match/${matchId}`)
    },)

    const onClickFindMatch = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        if (findStatus === "waiting" || findStatus === "match found") {
            return
        }

        findMatch(player.playerId)
    }, [findMatch, findStatus])

    return <>
        <div className="min-h-screen bg-[#050811] flex flex-col items-center pt-10">
            <div className="w-lg flex flex-col items-center justify-center">
                <span className="text-6xl text-white font-bold">1 TƯỚNG 9 QUÂN</span>
                <span className="text-3xl text-blue-400">ONLINE</span>
            </div>

            <div className="w-lg flex flex-col items-center justify-center">
                <span className="text-xl text-cyan-500 font-bold">
                    Tên người chơi:
                    <span className="text-sm text-amber-400 font-bold"> {player.playerName}</span>
                </span>
            </div>

            {
                findStatus === "waiting" && (
                    <div className="flex justify-center mt-20">
                        <button disabled className="w-50 p-2 bg-blue-500 text-white text-2xl rounded-full cursor-pointer hover:bg-blue-500/90">CHỜ GHÉP TRẬN</button>
                    </div>
                )
            }

            {
                findStatus !== "waiting" && findStatus !== "match found" && (
                    <div className="flex justify-center mt-20">
                        <button
                            className="
                         w-50 p-2 bg-blue-500 
                         text-white text-2xl 
                         rounded-full 
                         cursor-pointer 
                         hover:bg-blue-500/90"

                            onClick={onClickFindMatch}
                        >
                            TÌM TRẬN
                        </button>
                    </div>
                )
            }

            {
                matchId && <h1 className="text-lg text-white">Tìm trận thành công id: {matchId}</h1>
            }
        </div>
    </>
}
