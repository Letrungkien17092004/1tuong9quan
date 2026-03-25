import { error } from "console";
import { Server, Socket } from "socket.io";


type SocketPlayer = {
    socketId: string
} 

export default function playerSocket(io: Server) {
    const playerNamespace = io.of('/player')
    const waitingQueue: Array<SocketPlayer> = []

    playerNamespace.on("connection", (socket: Socket) => {
        console.log("new user connect to ", socket.nsp.name, " namespace")

        socket.on("find-match", (data) => {
            console.log("new msg on find-match")
            console.log(data)
            const opponent = waitingQueue.shift()
            if (opponent) {
                console.log("run here 1")
                const roomId = crypto.randomUUID()
                socket.join(roomId)
                playerNamespace.to(opponent.socketId).socketsJoin(roomId)
                playerNamespace.to(roomId).emit("find-match", "match-found")
            } else {
                console.log("run here 2")
                waitingQueue.push({
                    socketId: socket.id
                })
                socket.emit("waiting")
            }
        })

        socket.on("test", (payload, callback) => {
            console.log("received ", payload)
            callback("ok") 
        })
    })

    
}