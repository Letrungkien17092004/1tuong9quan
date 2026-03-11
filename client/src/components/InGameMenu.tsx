
interface InGameMenuProps {
    replayHandler?: (e: React.MouseEvent) => void
    backHomeHandler?: (e: React.MouseEvent) => void
}

export default function InGameMenu({ replayHandler, backHomeHandler }: InGameMenuProps) {
    return <>
        <div className="w-full flex justify-evenly items-center">
            <div onClick={replayHandler} className="p-2 bg-amber-400 rounded-sm">
                <span className="text-xl font-medium text-black">CHƠI LẠI</span>
            </div>

            <div onClick={backHomeHandler} className="p-2 bg-amber-400 rounded-sm">
                <span className="text-xl font-medium text-black">VỀ TRANG CHỦ</span>
            </div>
        </div>
    </>
}