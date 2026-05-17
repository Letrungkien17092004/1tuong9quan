interface LoadingProps {
    message?: string;
    className?: string;
}

export default function LoadingSpinner({
    message = "Đang tải...",
    className = ""
}: LoadingProps) {
    return (
        <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px] ${className}`}>

            {/* Vòng xoay thuần Tailwind CSS */}
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />

            {/* Thông báo */}
            {message && (
                <p className="mt-3 text-sm font-semibold text-gray-700 tracking-wide">
                    {message}
                </p>
            )}
        </div>
    );
}