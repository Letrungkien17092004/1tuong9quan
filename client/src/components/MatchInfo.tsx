

interface MatchInfoProps {
    currentTurn: "blue" | "green",
    remainingBlue: number,
    remainingGreen: number
}

export default function MatchInfo({currentTurn, remainingBlue, remainingGreen}: MatchInfoProps) {
    return <>
        <div className="w-full p-2 flex flex-col items-center">
            <div className="w-xs flex justify-start items-center">
                <div className="size-10 rounded-full bg-green-500"></div>
                <span className=" text-xl font-medium text-white ml-1">Còn lại {remainingGreen}</span>
            </div>

            <div className="w-xs flex justify-start items-center mt-2">
                <div className="size-10 rounded-full bg-blue-500"></div>
                <span className=" text-xl font-medium text-white ml-1">Còn lại {remainingBlue}</span>
            </div>

            <div className="w-xs flex justify-start items-center mt-2">
                <span className=" text-xl font-medium text-white mr-1">Lượt của</span>
                {
                    currentTurn == "blue"
                    ? <div className="size-10 rounded-full bg-blue-500"></div>
                    : <div className="size-10 rounded-full bg-green-500"></div>
                }
                
            </div>
        </div>
    </>
}