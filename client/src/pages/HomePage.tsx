import React from 'react';
import { useNavigate } from "react-router-dom"

// Component con cho từng mục menu theo dạng hàng ngang (trong bố cục cột)
function MenuOption({ title, description, icon, color, onClick }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
}) {

    return (
        <button
            onClick={onClick}
            className="group relative w-full max-w-xl flex items-center p-5 bg-slate-800/40 border border-slate-700 rounded-2xl transition-all duration-300 hover:bg-slate-700/60 hover:border-slate-400 hover:pl-10 shadow-xl"
        >
            {/* Vạch màu bên cạnh khi hover */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-gradient-to-b ${color} opacity-0 group-hover:opacity-100 transition-all`}></div>

            {/* Icon */}
            <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg mr-6 transform group-hover:scale-110 transition-transform`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-8 h-8 text-white"
                >
                    {icon}
                </svg>
            </div>

            {/* Text Content */}
            <div className="flex flex-col text-left">
                <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                    {title}
                </h3>
                <p className="text-slate-400 text-sm italic">{description}</p>
            </div>

            {/* Mũi tên chỉ hướng ở bên phải */}
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7" />
                </svg>
            </div>
        </button>
    );
}


type PlayMode = "ONLINE" | "OFFLINE" | "TUTORIAL"

export default function HomePage() {


    const navigate = useNavigate()
    function handleSelection(mode: PlayMode) {
        switch (mode) {
            case "ONLINE":
                navigate("/play-online")
                break;
            case "OFFLINE":
                navigate("/play-offline")
                break;
            default:
                break;
        }
    }

    return (
        <div className="min-h-screen bg-[#050811] flex flex-col items-center justify-center p-4">
            {/* Trang trí nền */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>

            {/* Header */}
            <div className="relative z-10 mb-12 text-center">
                <h2 className="text-blue-500 font-mono tracking-[0.3em] text-sm mb-2">Cờ </h2>
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase border-b-4 border-blue-600 pb-2">
                    1 Tướng 9 Quân
                </h1>
            </div>

            {/* Cột danh sách lựa chọn */}
            <div className="relative z-10 flex flex-col gap-4 w-full items-center">

                <MenuOption
                    title="Chơi Online"
                    description="Thi đấu với người chơi khác"
                    color="from-purple-600 to-fuchsia-500"
                    onClick={() => handleSelection('ONLINE')}
                    icon={<path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />}
                />

                <MenuOption
                    title="Chơi Offline"
                    description="Đấu tay đôi cùng bạn bè"
                    color="from-emerald-600 to-teal-500"
                    onClick={() => handleSelection('OFFLINE')}
                    icon={
                        <>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </>
                    }
                />

                <MenuOption
                    title="Hướng dẫn"
                    description="Cách điều khiển và luật chơi"
                    color="from-orange-600 to-yellow-500"
                    onClick={() => handleSelection('TUTORIAL')}
                    icon={<path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />}
                />
            </div>

            {/* Footer */}
            <div className="mt-12 text-slate-600 text-[10px] tracking-widest uppercase">
                v1.0.4 - Server Status: <span className="text-green-500">Online</span>
            </div>
        </div>
    );
}