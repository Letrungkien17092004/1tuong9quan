import express from "express";
import cors from "cors";
import routers from "./routers/routers.js";


const app = express()

app.use(cors({ origin: '*' }));

app.use(routers)

export default app