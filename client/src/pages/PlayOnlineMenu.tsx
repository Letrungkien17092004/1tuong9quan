import { useState, type ReactNode, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { usePlayerService } from "../hooks"

function LobbyOption({ title, description, color, icon, onClick }: {
    title: string
    description: string
    color: string
    icon: ReactNode
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className="group relative w-full flex items-start gap-4 p-6 bg-slate-800/80 border border-slate-700 rounded-3xl shadow-xl transition-all duration-300 hover:bg-slate-700/90"
        >
            <div className={`flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8">
                    {icon}
                </svg>
            </div>
            <div className="text-left">
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="text-slate-400 text-sm leading-6">{description}</p>
            </div>
        </button>
    )
}

export default function PlayOnlineMenu() {
    const navigate = useNavigate()
    const { currentPlayer, createPlayer } = usePlayerService()
    const [statusMessage, setStatusMessage] = useState("")
    const [playerName, setPlayerName] = useState("Đang tải...")

    useEffect(() => {
        if (currentPlayer) {
            setPlayerName(currentPlayer.playerName)
        } else {
            setPlayerName("chưa có tài khoản")
        }
    }, [currentPlayer])

    return (
        <div className="min-h-screen bg-[#050811] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>
            <div className="absolute top-6 left-6 z-20 rounded-3xl border border-slate-700 bg-slate-950/90 p-4 shadow-xl backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-2">Player</p>
                <p className="text-sm font-semibold text-white">Tên player: <span className="text-cyan-300">{playerName}</span></p>
            </div>
            {statusMessage && (
                <div className="absolute top-6 left-1/2 z-20 -translate-x-1/2 rounded-3xl border border-cyan-500/40 bg-slate-900/95 px-5 py-4 shadow-2xl backdrop-blur-lg">
                    <p className="text-sm text-cyan-100">{statusMessage}</p>
                </div>
            )}
            <div className="relative z-10 w-full max-w-3xl">
                <div className="mb-10 text-center">
                    <p className="text-sm uppercase tracking-[0.4em] text-blue-400 mb-2">Sảnh chờ</p>
                    <h1 className="text-4xl sm:text-5xl font-black text-white">1 Tướng 9 Quân Online</h1>
                </div>

                <div className="flex flex-col gap-4">
                    <LobbyOption
                        title="Tìm trận"
                        description="Bắt đầu tìm đối thủ trực tuyến ngay lập tức."
                        color="from-cyan-500 to-blue-600"
                        icon={<path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10m-5 5v-4" />}
                        onClick={() => setStatusMessage("Đang tìm trận... vui lòng chờ trong giây lát.")}
                    />
                    <LobbyOption
                        title="Tạo tài khoản"
                        description="Tạo tài khoản mới để lưu tiến trình và kết nối bạn bè."
                        color="from-amber-500 to-orange-500"
                        icon={<path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />}
                        onClick={async () => {
                            try {
                                await createPlayer()
                                setStatusMessage("Tạo tài khoản thành công!")
                                setInterval(() => {
                                    setStatusMessage("")
                                }, 3000)
                            } catch (error) {
                                setStatusMessage("Lỗi tạo tài khoản.")
                                setInterval(() => {
                                    setStatusMessage("")
                                }, 3000)
                            }
                        }}
                    />
                </div>

                <div className="mt-8 flex items-center justify-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-2xl border border-slate-700 bg-slate-800/90 px-5 py-3 text-sm text-slate-300 transition hover:bg-slate-700">
                        Quay về
                    </button>
                </div>
            </div>
        </div>
    )
}
