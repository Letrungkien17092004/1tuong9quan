import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage, PlayOffline } from "../pages/index.tsx";

export default function Routers() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/play-pvp-offline" element={<PlayOffline />} />
            </Routes>
        </BrowserRouter>
    )
}
