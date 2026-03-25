import { createServer } from "http"
import app from "./express/app.js"
import io from "./socketIO/io.js"
const httpServer = createServer(app)
io.attach(httpServer)


httpServer.listen(3000, () => {
    console.log("server listening on port: 3000")
})
