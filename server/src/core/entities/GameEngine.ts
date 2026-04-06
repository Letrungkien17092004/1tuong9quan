
export type Node = {
    nodeId: string
    row: number
    col: number
}

export type Piece = {
    pieceId: string
    side: "green" | "blue"
    isKing: boolean
    nodeId: string
}

export type Line = {
    lineId: string
    nodeIds: string[]
}

export default class GameEngine {

    nodes: Node[] = []
    edges: Record<string, string[]> = {}
    lines: Line[] = []

    pieces: Piece[] = []

    rows = 5
    cols = 5

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
                const nodeIds = line.nodeIds
                add(nodeIds[i]!, nodeIds[i + 1]!)
            }
        })
    }

    /**
     * Set up pieces
     */
    private setupInitialPieces() {

        this.pieces = []

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
    getNodeFromId(nodeId: string): Node | undefined {
        return this.nodes.find(n => n.nodeId === nodeId)
    }

    /**
     * Retrives a piece by pieceId
     * @param pieceId 
     * @returns 
     */
    getPieceById(pieceId: string): Piece | undefined {
        return this.pieces.find(p => p.pieceId === pieceId)
    }

    /**
     * retrives a piece by its attached nodeId
     * @param nodeId 
     * @returns 
     */
    getPieceByNodeId(nodeId: string): Piece | undefined {
        return this.pieces.find(p => p.nodeId === nodeId)
    }

    /**
     * Retrives a line between node A and node B
     * @param nodeIdA 
     * @param nodeIdB 
     * @returns 
     */
    getLineBetween(nodeIdA: string, nodeIdB: string): Line | undefined {
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
    performMove(pieceId: string, toNodeId: string) {

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

        const midNode = line.nodeIds[midIdx]!

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
    performCapture(attackerId: string, targetId: string) {

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

    /**
     * Start new game
     */
    resetPiece(): void {
        this.setupInitialPieces()
    }

    clone(): GameEngine {
        const copy = new GameEngine()
        copy.nodes = [...this.nodes]
        copy.pieces = [...this.pieces]
        copy.edges = {...this.edges}
        copy.lines = [...this.lines]
        return copy
    }
}