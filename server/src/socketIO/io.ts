import { Server } from "socket.io";
import { bootMatchNamespace } from "./namespaces/index.js";

const io = new Server();

// Boot all namespaces
bootMatchNamespace(io);

io.on("new_namespace", (namespace) => {
    console.log(`new namespace just created ${namespace.name}`);
});

export default io;
