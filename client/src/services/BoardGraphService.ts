import type { IBoardNode, IPieceNode, IBoardLine } from "../types/index.ts"

export default class BoardGraphService {
    readonly nodes: IBoardNode[]
    readonly edges: Record<string, string[]>
    readonly lines: IBoardLine[]
    readonly pieces: IPieceNode[]
    readonly rows: number
    readonly cols: number
    readonly cell: number

    constructor(rows: number, cols: number, cell: number) {
        this.nodes = []
        this.edges = {}
        this.lines = []
        this.pieces = []
        this.rows = rows
        this.cols = cols
        this.cell = cell

        // create node with nodeId such as: A0, A01, B0, B1...
        // create each row one by one
        const rowNames: ["A", "B", "C", "D", "E"] = ["A", "B", "C", "D", "E"]
        rowNames.forEach((rowName, rowIdx) => {
            for (let colIdx = 0; colIdx < this.cols; colIdx++) {
                const newNode: IBoardNode = {
                    nodeId: `${rowName}${colIdx}`,
                    row: rowIdx,
                    col: colIdx
                }
                this.nodes.push(newNode)
            }
        })

        this.edges["A0"] = ["A1", "B0", "B1"]
        this.edges["A1"] = ["A0", "B1", "B2"]
        this.edges["A2"] = ["A1", "B1", "B2", "B3", "A3"]
        this.edges["A3"] = ["A2", "B3", "A4"]
        this.edges["A4"] = ["A3", "B3", "B4"]

        this.edges["B0"] = ["A0", "B1", "C0"]
        this.edges["B1"] = ["A0", "B0", "C0", "C1", "C2", "B2", "A2", "A1"]
        this.edges["B2"] = ["B1", "C2", "B3", "A2"]
        this.edges["B3"] = ["A2", "B2", "C2", "C3", "C4", "B4", "A4", "A3"]
        this.edges["B4"] = ["B3", "C4", "A4"]

        this.edges["C0"] = ["B0", "D0", "B1", "C1", "D1"]
        this.edges["C1"] = ["C0", "D1", "C2", "B1"]
        this.edges["C2"] = ["B1", "C1", "D1", "D2", "D3", "C3", "B3", "B2"]
        this.edges["C3"] = ["C2", "D3", "C4", "B3"]
        this.edges["C4"] = ["B3", "C3", "D3", "B4", "D4"]

        this.edges["D0"] = ["C0", "E0", "D1"]
        this.edges["D1"] = ["C0", "D0", "E0", "E1", "E2", "D2", "C2", "C1"]
        this.edges["D2"] = ["D1", "E2", "D3", "C2"]
        this.edges["D3"] = ["C2", "D2", "E2", "E3", "E4", "D4", "C4", "C3"]
        this.edges["D4"] = ["D3", "E4", "C4"]

        this.edges["E0"] = ["D0", "D1", "E1"]
        this.edges["E1"] = ["E0", "D1", "E2"]
        this.edges["E2"] = ["D1", "E1", "E3", "D3", "D2"]
        this.edges["E3"] = ["E2", "D3", "E4"]
        this.edges["E4"] = ["D3", "E3", "D4"]

        // setup the default position for each piece
        let pieceCount = 0
        this.pieces.push({
            pieceId: `piece_green_${pieceCount}`,
            side: "green",
            isKing: false,
            nodeId: "A0"
        })
        pieceCount++
        this.pieces.push({
            pieceId: `piece_green_${pieceCount}`,
            side: "green",
            isKing: false,
            nodeId: "A1"
        })
        pieceCount++
        this.pieces.push({
            pieceId: `piece_green_${pieceCount}`,
            side: "green",
            isKing: true, // king
            nodeId: "A2"
        })
        pieceCount++
        this.pieces.push({
            pieceId: `piece_green_${pieceCount}`,
            side: "green",
            isKing: false,
            nodeId: "A3"
        })
        pieceCount++
        this.pieces.push({
            pieceId: `piece_green_${pieceCount}`,
            side: "green",
            isKing: false,
            nodeId: "A4"
        })
        pieceCount++
        this.pieces.push({
            pieceId: `piece_green_${pieceCount}`,
            side: "green",
            isKing: false,
            nodeId: "B0"
        })
        pieceCount++
        this.pieces.push({
            pieceId: `piece_green_${pieceCount}`,
            side: "green",
            isKing: false,
            nodeId: "B1"
        })
        pieceCount++
        this.pieces.push({
            pieceId: `piece_green_${pieceCount}`,
            side: "green",
            isKing: false,
            nodeId: "B3"
        })
        pieceCount++
        this.pieces.push({
            pieceId: `piece_green_${pieceCount}`,
            side: "green",
            isKing: false,
            nodeId: "B4"
        })
        pieceCount++
        this.pieces.push({
            pieceId: `piece_green_${pieceCount}`,
            side: "green",
            isKing: false,
            nodeId: "C0"
        })

        // blue
        pieceCount++
        this.pieces.push({
            pieceId: `piece_blue_${pieceCount}`,
            side: "blue",
            isKing: false,
            nodeId: "C4"
        })
        pieceCount++
        this.pieces.push({
            pieceId: `piece_blue_${pieceCount}`,
            side: "blue",
            isKing: false,
            nodeId: "D0"
        })
        pieceCount++
        this.pieces.push({
            pieceId: `piece_blue_${pieceCount}`,
            side: "blue",
            isKing: false,
            nodeId: "D1"
        })
        pieceCount++
        this.pieces.push({
            pieceId: `piece_blue_${pieceCount}`,
            side: "blue",
            isKing: false,
            nodeId: "D3"
        })
        pieceCount++
        this.pieces.push({
            pieceId: `piece_blue_${pieceCount}`,
            side: "blue",
            isKing: false,
            nodeId: "D4"
        })
        pieceCount++
        this.pieces.push({
            pieceId: `piece_blue_${pieceCount}`,
            side: "blue",
            isKing: false,
            nodeId: "E0"
        })
        pieceCount++
        this.pieces.push({
            pieceId: `piece_blue_${pieceCount}`,
            side: "blue",
            isKing: false,
            nodeId: "E1"
        })
        pieceCount++
        this.pieces.push({
            pieceId: `piece_blue_${pieceCount}`,
            side: "blue",
            isKing: true, // king
            nodeId: "E2"
        })
        pieceCount++
        this.pieces.push({
            pieceId: `piece_blue_${pieceCount}`,
            side: "blue",
            isKing: false,
            nodeId: "E3"
        })
        pieceCount++
        this.pieces.push({
            pieceId: `piece_blue_${pieceCount}`,
            side: "blue",
            isKing: false,
            nodeId: "E4"
        })

    }

    /**
     * check can move from the node to other node by nodeId
     * @param fromNodeId from nodeId
     * @param toNodeId to nodeId
     */
    canMove(fromNodeId: string, toNodeId: string): boolean {
        if (this.edges[fromNodeId]) {
            return this.edges[fromNodeId].includes(toNodeId)
        }
        throw new Error("invalid nodeId")
    }

    /**
     * Convert from row and col positions of a node to pixel positions
     * @param nodeId 
     */
    convertNodeToPixel(nodeId: string): { x: number, y: number } {
        const node = this.getNodeFromId(nodeId)
        if (node) {
            return {
                x: node.col * this.cell,
                y: node.row * this.cell
            }
        }
        throw new Error("invalid nodeId")
    }

    /**
     * find a node by nodeId
     * @param nodeId 
     */
    getNodeFromId(nodeId: string): IBoardNode | undefined {
        return this.nodes.find(node => node.nodeId === nodeId)
    }

    /**
     * find a piece by the pieceId
     * @param pieceId 
     */
    getPieceById(pieceId: string): IPieceNode | undefined {
        return this.pieces.find(piece => piece.pieceId === pieceId)
    }

    /**
     * Move a piece
     * @param fromPieceId 
     * @param toNodeId 
     * @returns 
     */
    movePiece(fromPieceId: string, toNodeId: string): boolean {
        const piece = this.getPieceById(fromPieceId)
        if (piece && this.canMove(piece.nodeId, toNodeId)) {
            piece.nodeId = toNodeId // auto update in this.pieces because it's reference
            return true
        }
        return false
    }
}