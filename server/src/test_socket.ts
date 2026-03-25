import io from "socket.io-client"

const socket0 = io("http://localhost:3000")
const socket = io("http://localhost:3000/player")

socket0.on("connect", () => {
    console.log("socket 0 client connect ok, id: ", socket0.id) // id khác nhau
})

socket.on("connect", () => {
    console.log("client connect ok, id: ", socket.id) // id khác nhau
})

setTimeout(() => {
    socket.timeout(5000).emit("test", "test data", (err: any) => {
        if (err) {
            console.log("something wrong")
        } else {
            console.log("emit oke")
        }
    })
}, 2000)
