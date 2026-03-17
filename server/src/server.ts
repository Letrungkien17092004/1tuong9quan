import { createServer } from "http"
import { Server, Socket } from "socket.io"


type UserData = {
    userId: string
}

type UserWithSocket = UserData & {
    socket: Socket
}

const httpServer = createServer()

const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
})

const matchQueue: UserWithSocket[] = []

io.on("connection", (socket) => {

    socket.on("register", () => {
        const randomID = crypto.randomUUID()
        socket.emit("register", {
            userId: randomID
        })
    })

    socket.on("find-matches", ({ userId }: UserData) => {
        if (matchQueue.length > 0) {
            const userInQueue = matchQueue.pop()!
            const randomRoomId = crypto.randomUUID()
            userInQueue.socket.join(randomRoomId)
            socket.join(randomRoomId)
            io.to(randomRoomId).emit("find-matches", {
                message: "match found",
                roomId: randomRoomId
            })
            return
        }

        // add user to queue
        matchQueue.push({
            userId: userId,
            socket: socket
        })
        socket.emit("find-matches", {
            message: "finding"
        })
    })

    socket.on("disconnect", () => {
        console.log("user disconnected")
    })


})

httpServer.listen(3000, () => {
    console.log("server listening on port: 3000")
})
