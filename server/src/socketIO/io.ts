import { Server } from "socket.io";
import { registerSocket } from "./sockets/index.js";

const io = new Server()
registerSocket(io)

io.on("new_namespace", (namespace) => {
    console.log(`new namespace just created ${namespace.name}`)
})

export default io