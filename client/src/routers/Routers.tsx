import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage, PlayOffline, PlayOnlineMenu } from "../pages/index.tsx";

export default function Routers() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/play-pvp-offline" element={<PlayOffline />} />
                <Route path="/play-online-menu" element={<PlayOnlineMenu />} />
            </Routes>
        </BrowserRouter>
    )
}
