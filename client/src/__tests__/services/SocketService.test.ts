import SocketService from "../../services/SocketService.js";


async function main() {
    console.log("running")
    const sks = new SocketService(
        "http://localhost:3000",
        {
            namespace: "/match",
            autoConnect: true
        }
    )

    sks.onFindMatch(payload => {
        console.log("find match event")
        console.log(payload)
    })


    sks.onJoinMatch(payload => {
        console.log("join match event")
        console.log(payload)
    })

    sks.onChangeState(payload => {
        console.log("change state event")
        console.log(payload)
    })

    // sks.findMatch({
    //     playerId: "2"
    // })

    sks.joinMatch({
        playerId: "2",
        matchId: "c4fa4934-784d-4f71-a866-63ba174eb093"
    })

}

main()