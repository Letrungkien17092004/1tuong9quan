// GameResultOverlay.tsx

type GameResultOverlayProps = {
  winner: "blue" | "green",
  onReset: (e: React.MouseEvent) => void
};

export default function GameResultOverlay({ winner, onReset }: GameResultOverlayProps) {
  const winnerColor = winner === "blue" ? "bg-blue-500" : "bg-green-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050811]/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-8 rounded-2xl border border-white/10 bg-[#0b0f1a] px-12 py-12 shadow-[0_0_40px_rgba(0,0,0,0.6)]">

        {/* Winner display */}
        <div className="flex items-center gap-4">
          <div className={`size-10 rounded-full ${winnerColor}`} />
          <h2 className="text-2xl font-semibold text-white">
            {winner === "blue" ? "Blue" : "Green"} thắng
          </h2>
        </div>

        {/* Options */}
        <div className="flex gap-4">
          <button onClick={onReset}
            className="rounded-lg bg-white/10 px-6 py-2 text-white transition hover:bg-white/20 active:scale-95"
          >
            Chơi lại
          </button>

          <button
            className="rounded-lg border border-white/15 px-6 py-2 text-white/80 transition hover:bg-white/10 hover:text-white active:scale-95"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}