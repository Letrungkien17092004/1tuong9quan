import express from "express";
import routers from "./routers/routers.js";


const app = express()

app.use(routers)

export default app