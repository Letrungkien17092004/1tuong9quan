import io from "socket.io-client"

const base_url = "http://localhost:3000"





async function main() {
    const socket = io(`${base_url}/player`)

    socket.on("connect", () => {
        console.log("connected")
        console.log("emit")
        socket.emit("player:find-match", {
            playerId: "lol"
        })
    })

    socket.on("player:find-match", async (payload: any, callback: any) => {
        if (payload.status === "ok") {
            console.log("payload: ", payload)
        } else if (payload.status === "error" && payload.message === "Unauthorized") {
            console.log("error: ", payload.message)
            const genPlayerResponse = await fetch(`${base_url}/api/player`, {
                method: "POST"
            })

            const data = await genPlayerResponse.json()
            console.log("gen player data: ", data.player.playerId)
            socket.emit("player:find-match", {
                playerId: data.player.playerId
            })

        }
    })
}

main()


