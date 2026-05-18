import { createServer } from "http"
import app from "./express/app.js"
import io from "./socketIO/io.js"
import ENV from "./config/ENV.js"


const httpServer = createServer(app)
io.attach(httpServer)


httpServer.listen(ENV.PORT, () => {
    console.log(`server listening on port: ${ENV.PORT}`)
})
