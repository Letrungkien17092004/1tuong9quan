// src/routers/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage, PlayOffline, Lobby, playerLoader } from "../pages/index.tsx";
import LoadingSpinner from "../components/Loading.tsx";

// 1. Định nghĩa router bằng hàm thay vì Component JSX
const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/play-offline",
        element: <PlayOffline />,
    },
    {
        path: "/play-online",
        element: <Lobby />,
        loader: playerLoader, // Loader chỉ chạy khi dùng createBrowserRouter,
        hydrateFallbackElement: <LoadingSpinner />
    },
]);

// 2. Component Routers chính sẽ trả về RouterProvider
export default function Routers() {
    return <RouterProvider router={router} />;
}