import { useCallback, useRef, useState } from "react"

export interface INode {
    nodeId: string
    row: number
    col: number
}

export interface IPiece {
    pieceId: string
    side: "green" | "blue"
    isKing: boolean
    nodeId: string
}

export interface ILine {
    lineId: string
    nodeIds: string[]
}

export interface IGameEngine {

    readonly nodes: INode[]
    readonly edges: Record<string, string[]>
    readonly lines: ILine[]
    readonly pieces: IPiece[]

    readonly rows: number
    readonly cols: number

    canMove(pieceId: string, toNodeId: string): boolean

    canCapture(attackerId: string, targetId: string): boolean

    move(pieceId: string, toNodeId: string): void

    capture(attackerId: string, targetId: string): void

    getNodeFromId(nodeId: string): INode | undefined

    getPieceById(pieceId: string): IPiece | undefined

    getPieceByNodeId(nodeId: string): IPiece | undefined

    getLineBetween(nodeIdA: string, nodeIdB: string): ILine | undefined

    removePieceById(pieceId: string): void
}

class GameEngine implements IGameEngine {

    readonly nodes: INode[] = []
    readonly edges: Record<string, string[]> = {}
    readonly lines: ILine[] = []

    pieces: IPiece[] = []

    readonly rows = 5
    readonly cols = 5

    constructor() {

        const rowNames = ["A", "B", "C", "D", "E"]

        rowNames.forEach((rowName, rowIdx) => {
            for (let col = 0; col < this.cols; col++) {
                this.nodes.push({
                    nodeId: `${rowName}${col}`,
                    row: rowIdx,
                    col
                })
            }
        })

        // === add lines ===
        // horizontal
        rowNames.forEach((row, idx) => {
            this.lines.push({
                lineId: `horizontal_${idx}`,
                nodeIds: Array.from({ length: 5 }, (_, i) => `${row}${i}`)
            })
        })

        // vertical
        for (let c = 0; c < 5; c++) {
            this.lines.push({
                lineId: `vertical_${c}`,
                nodeIds: rowNames.map(r => `${r}${c}`)
            })
        }

        // cross
        this.lines.push({
            lineId: "main_cross_0",
            nodeIds: ["A0", "B1", "C2", "D3", "E4"]
        })

        this.lines.push({
            lineId: "main_cross_1",
            nodeIds: ["A4", "B3", "C2", "D1", "E0"]
        })

        this.lines.push({
            lineId: "sub_cross_0",
            nodeIds: ["A2", "B1", "C0"]
        })

        this.lines.push({
            lineId: "sub_cross_1",
            nodeIds: ["A2", "B3", "C4"]
        })

        this.lines.push({
            lineId: "sub_cross_2",
            nodeIds: ["C0", "D1", "E2"]
        })

        this.lines.push({
            lineId: "sub_cross_3",
            nodeIds: ["C4", "D3", "E2"]
        })

        this.buildEdges()

        this.setupInitialPieces()
    }

    /**
     * Set up edges for each node 
     */
    private buildEdges() {

        const add = (a: string, b: string) => {
            if (!this.edges[a]) this.edges[a] = []
            if (!this.edges[b]) this.edges[b] = []

            if (!this.edges[a].includes(b)) this.edges[a].push(b)
            if (!this.edges[b].includes(a)) this.edges[b].push(a)
        }

        this.lines.forEach(line => {
            for (let i = 0; i < line.nodeIds.length - 1; i++) {
                add(line.nodeIds[i], line.nodeIds[i + 1])
            }
        })
    }

    /**
     * Set up pieces
     */
    private setupInitialPieces() {

        const greenNodes = [
            "A0", "A1", "A2", "A3", "A4",
            "B0", "B1", "B3", "B4", "C0"
        ]

        const blueNodes = [
            "C4", "D0", "D1", "D3", "D4",
            "E0", "E1", "E2", "E3", "E4"
        ]

        let id = 0

        greenNodes.forEach(node => {
            this.pieces.push({
                pieceId: `piece_green_${id}`,
                side: "green",
                isKing: node === "A2",
                nodeId: node
            })
            id++
        })

        blueNodes.forEach(node => {
            this.pieces.push({
                pieceId: `piece_blue_${id}`,
                side: "blue",
                isKing: node === "E2",
                nodeId: node
            })
            id++
        })
    }

    /**
     * retrives a node by nodeId
     * @param nodeId 
     * @returns 
     */
    getNodeFromId(nodeId: string): INode | undefined {
        return this.nodes.find(n => n.nodeId === nodeId)
    }

    /**
     * Retrives a piece by pieceId
     * @param pieceId 
     * @returns 
     */
    getPieceById(pieceId: string): IPiece | undefined {
        return this.pieces.find(p => p.pieceId === pieceId)
    }

    /**
     * retrives a piece by its attached nodeId
     * @param nodeId 
     * @returns 
     */
    getPieceByNodeId(nodeId: string): IPiece | undefined {
        return this.pieces.find(p => p.nodeId === nodeId)
    }

    /**
     * Retrives a line between node A and node B
     * @param nodeIdA 
     * @param nodeIdB 
     * @returns 
     */
    getLineBetween(nodeIdA: string, nodeIdB: string): ILine | undefined {
        return this.lines.find(l =>
            l.nodeIds.includes(nodeIdA) &&
            l.nodeIds.includes(nodeIdB)
        )
    }

    /**
     * check can move from piece to node
     * @param pieceId 
     * @param toNodeId 
     * @returns 
     */
    canMove(pieceId: string, toNodeId: string): boolean {

        const piece = this.getPieceById(pieceId)

        if (!piece) throw new Error("piece not found")

        const edge = this.edges[piece.nodeId]

        if (!edge) return false

        // has a path to node
        const hasPath = edge.includes(toNodeId)

        // the node does not have any pieces attached
        const empty = !this.getPieceByNodeId(toNodeId)

        return hasPath && empty
    }

    /**
     * Moves a piece to nodeId
     * @param pieceId 
     * @param toNodeId 
     */
    move(pieceId: string, toNodeId: string) {

        if (!this.canMove(pieceId, toNodeId)) {
            throw new Error("invalid move")
        }

        const piece = this.getPieceById(pieceId)!

        piece.nodeId = toNodeId
    }

    /**
     * Check can capture a piece
     * @param attackerId 
     * @param targetId 
     * @returns 
     */
    canCapture(attackerId: string, targetId: string) {

        const attacker = this.getPieceById(attackerId)
        const target = this.getPieceById(targetId)

        if (!attacker || !target) throw new Error("invalid piece")

        // attacker must be king
        if (!attacker.isKing) return false

        // attacker and target must be on opposite sides
        if (attacker.side === target.side) return false

        // you can only capture the king when you have captured 4 piece
        if (target.isKing) {
            const remainingPieceOfTarget = this.pieces.filter((piece) => piece.side === target.side && piece.isKing === false)
            if (remainingPieceOfTarget.length > 5) {
                window.confirm("Chưa ăn đủ 4 quân")
                return false
            }
        }

        const line = this.getLineBetween(attacker.nodeId, target.nodeId)

        // attacker and target must be on the same line
        if (!line) return false

        const idxA = line.nodeIds.indexOf(attacker.nodeId)
        const idxB = line.nodeIds.indexOf(target.nodeId)

        // the number of steps from attacker to target must be 2
        if (Math.abs(idxA - idxB) !== 2) return false

        const midIdx = (idxA + idxB) / 2

        const midNode = line.nodeIds[midIdx]

        const midPiece = this.getPieceByNodeId(midNode)

        if (!midPiece) return false

        // attacker and midPiece (piece between attacker and target) must be on same side
        return midPiece.side === attacker.side
    }

    /**
     * Capture a piece
     * @param attackerId 
     * @param targetId 
     */
    capture(attackerId: string, targetId: string) {

        if (!this.canCapture(attackerId, targetId)) {
            throw new Error("invalid capture")
        }

        const target = this.getPieceById(targetId)!

        const node = target.nodeId

        this.removePieceById(targetId)

        const attacker = this.getPieceById(attackerId)!

        attacker.nodeId = node
    }

    /**
     * remove a piece by pieceId
     * @param pieceId 
     */
    removePieceById(pieceId: string) {

        const before = this.pieces.length

        this.pieces = this.pieces.filter(p => p.pieceId !== pieceId)

        if (before === this.pieces.length) {
            throw new Error("remove piece failure")
        }
    }
}

export default function useOfflineBoardManager() {

    const engineRef = useRef<IGameEngine>(new GameEngine())

    const [nodes] = useState([...engineRef.current.nodes])

    const [pieces, setPieces] = useState([...engineRef.current.pieces])

    const [remainingBlue, setRemainingBlue] = useState<number>(10)
    const [remainingGreen, setRemainingGreen] = useState<number>(10)
    const [isDone, setIsDone] = useState<boolean>(false)
    const [winner, setWinner] = useState<"blue" | "green" | undefined>(undefined)


    const move = useCallback((pieceId: string, nodeId: string) => {

        engineRef.current.move(pieceId, nodeId)

        setPieces([...engineRef.current.pieces])

    }, [])

    const capture = useCallback((attackerId: string, targetId: string) => {

        engineRef.current.capture(attackerId, targetId)

        setPieces([...engineRef.current.pieces])
        const countBlue = engineRef.current.pieces.filter(piece => piece.side === "blue").length
        const countGreen = engineRef.current.pieces.filter(piece => piece.side === "green").length
        setRemainingBlue(countBlue)
        setRemainingGreen(countGreen)
        const kingIfBlue = engineRef.current.pieces.find(piece => piece.side === "blue" && piece.isKing === true)
        const kingIfGreen = engineRef.current.pieces.find(piece => piece.side === "green" && piece.isKing === true)

        console.log(kingIfGreen)
        console.log(kingIfBlue)
        if (!kingIfBlue) {
            setWinner("green")
            setIsDone(true)
        }
        if (!kingIfGreen) {
            setWinner("blue")
            setIsDone(true)
        }
        if (countBlue === 0) {
            setWinner("green")
            setIsDone(true)
        }
        if (countGreen === 0) {
            setWinner("blue")
            setIsDone(true)
        }


    }, [])

    const canMove = useCallback((pieceId: string, nodeId: string) => {
        return engineRef.current.canMove(pieceId, nodeId)
    }, [])

    const canCapture = useCallback((attackerId: string, targetId: string) => {
        return engineRef.current.canCapture(attackerId, targetId)
    }, [])

    const getPieceByNodeId = useCallback((nodeId: string) => {
        return engineRef.current.getPieceByNodeId(nodeId)
    }, [])

    const getPieceById = useCallback((id: string) => {
        return engineRef.current.getPieceById(id)
    }, [])

    return {
        nodes,
        pieces,

        move,
        capture,

        canMove,
        canCapture,

        getPieceByNodeId,
        getPieceById,

        remainingBlue,
        remainingGreen,
        isDone,
        winner
    }
}