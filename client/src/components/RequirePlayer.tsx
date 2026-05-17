import { useEffect, useState } from "react"
import { usePlayerService } from "../hooks"
import LoadingSpinner from "./Loading.tsx"
interface Props {
    children: React.ReactNode
}

export default function RequirePlayer({ children }: Props) {
    const playerServiceHook = usePlayerService()

    useEffect(() => {
        const f = async () => {

            const player = playerServiceHook.readPlayerFromCookie()
            if (player) {
                playerServiceHook.setPlayer(player)
            }
        }
    }, [])

    if (!playerServiceHook.player) {
        return <>
            <div className="w-full">
                <LoadingSpinner />
            </div>
        </>
    }

    return <>{children}</>
}

