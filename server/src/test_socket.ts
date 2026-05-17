import io from "socket.io-client"

const base_url = "http://localhost:3000"





async function main() {
    const socket = io(`${base_url}/match`)

    socket.on("connect", () => {
        console.log("connected")
        // socket.timeout(2000).emit("test", { data: "123" }, (err: any) => {
        //     console.log("log in timeout + ack")
        //     console.log("err: ", err)
        // })

        socket.emit("test", { data: "123" }, (response: any) => {
            console.log("log in ack")
            console.log("response: ", response)
        })
    })

    socket.on("test", async (payload: any, callback: any) => {
        console.log("test event triger")
        console.log(payload, callback)
    })
}

main()


