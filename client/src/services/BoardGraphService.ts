import type { IBoardNode, IPieceNode, IBoardLine, IBoardGraph } from "../types/index.ts"

export default class BoardGraphService implements IBoardGraph {
    readonly nodes: IBoardNode[]
    readonly edges: Record<string, string[]>
    readonly lines: IBoardLine[]
    pieces: IPieceNode[]
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

        // add lines
        this.lines.push({
            lineId: "horizontal_line_0",
            nodeIds: ["A0", "A1", "A2", "A3", "A4"]
        })
        this.lines.push({
            lineId: "horizontal_line_1",
            nodeIds: ["B0", "B1", "B2", "B3", "B4"]
        })
        this.lines.push({
            lineId: "horizontal_line_2",
            nodeIds: ["C0", "C1", "C2", "C3", "C4"]
        })
        this.lines.push({
            lineId: "horizontal_line_3",
            nodeIds: ["D0", "D1", "D2", "D3", "D4"]
        })
        this.lines.push({
            lineId: "horizontal_line_4",
            nodeIds: ["E0", "E1", "E2", "E3", "E4"]
        })

        // vertical line
        this.lines.push({
            lineId: "vertical_line_0",
            nodeIds: ["A0", "B0", "C0", "D0", "E0"]
        })
        this.lines.push({
            lineId: "vertical_line_1",
            nodeIds: ["A1", "B1", "C1", "D1", "E1"]
        })
        this.lines.push({
            lineId: "vertical_line_2",
            nodeIds: ["A2", "B2", "C2", "D2", "E2"]
        })
        this.lines.push({
            lineId: "vertical_line_3",
            nodeIds: ["A3", "B3", "C3", "D3", "E3"]
        })
        this.lines.push({
            lineId: "vertical_line_4",
            nodeIds: ["A4", "B4", "C4", "D4", "E4"]
        })

        // main cross line
        this.lines.push({
            lineId: "main_cross_line_0",
            nodeIds: ["A0", "B1", "C2", "D3", "E4"]
        })
        this.lines.push({
            lineId: "main_cross_line_1",
            nodeIds: ["A4", "B3", "C2", "D1", "E0"]
        })

        // sub cross line
        this.lines.push({
            lineId: "sub_cross_line_0",
            nodeIds: ["A2", "B1", "C0"]
        })
        this.lines.push({
            lineId: "sub_cross_line_1",
            nodeIds: ["A2", "B3", "C4"]
        })
        this.lines.push({
            lineId: "sub_cross_line_2",
            nodeIds: ["C0", "D1", "E2"]
        })
        this.lines.push({
            lineId: "sub_cross_line_3",
            nodeIds: ["C4", "D3", "E2"]
        })


        // add edges
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

        const edge = this.edges[fromNodeId]
        // there exists a path between start node and destination node
        const condition1 = edge.includes(toNodeId)
        // the destination node already hasn't a piece attached
        const condition2 = !(this.getPieceByNodeId(toNodeId))

        if (!edge) {
            throw new Error("invalid fromNodeId")
        }

        if (condition1 && condition2) {
            return true
        }
        return false
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
    attemptMove(fromPieceId: string, toNodeId: string): void {
        const piece = this.getPieceById(fromPieceId)
        if (!piece) {
            throw new Error("piece was not found")
        }

        const canMove = this.canMove(piece.nodeId, toNodeId)
        if (canMove) {
            piece.nodeId = toNodeId // auto update in this.pieces because it's reference
        }
    }

    /**
     * get common line betwwen two nodes
     * @param nodeIdA nodeId A
     * @param nodeIdB nodeId B
     */
    getCommonLine(nodeIdA: string, nodeIdB: string): IBoardLine | undefined {
        const line = this.lines.find(_line => (
            _line.nodeIds.includes(nodeIdA) &&
            _line.nodeIds.includes(nodeIdB)
        ))
        if (!line) { return undefined }
        return {
            ...line
        }
    }

    /**
     * get a piece by nodeId has attached to that element
     * @param nodeId 
     */
    getPieceByNodeId(nodeId: string): IPieceNode | undefined {
        return this.pieces.find(_piece => _piece.nodeId === nodeId)
    }

    /**
     * Check if one node can capture another node
     * @param pieceIdA pieceId of the capture node
     * @param pieceIdB pieceId of the node will be captured
     */
    canCapture(pieceIdA: string, pieceIdB: string): boolean {
        const pieceA = this.getPieceById(pieceIdA)
        const pieceB = this.getPieceById(pieceIdB)

        if (!pieceA || !pieceB) {
            throw new Error("invalid pieceId")
        }

        // if piece A is not king
        if (pieceA.isKing === false) { return false }
        // if piece A and B are allies
        if (pieceA.side === pieceB.side) { return false }

        const commonLine = this.getCommonLine(pieceA.nodeId, pieceB.nodeId)
        // there is no common line
        if (!commonLine) {
            return false
        }

        // get index of piece A, B in line by nodeId
        const idxAInLine = commonLine.nodeIds.indexOf(pieceA.nodeId)
        const idxBInLine = commonLine.nodeIds.indexOf(pieceB.nodeId)

        // Rules of the game: the distance from a to b must be equal 2
        if (Math.abs(idxAInLine - idxBInLine) !== 2) {
            return false
        }

        // get the index of piece located between piece A and B
        const midIdx = (idxAInLine + idxBInLine) / 2
        const nodeIdOfMidPiece = commonLine.nodeIds[midIdx]
        const midPiece = this.getPieceByNodeId(nodeIdOfMidPiece)

        if (!midPiece) {
            return false
        }

        if (midPiece.side !== pieceA.side) {
            return false
        }
        return true
    }

    /**
     * Remove a piece by pieceId
     * @param pieceId 
     * @returns true if success, otherwise false
     */
    removePieceById(pieceId: string): void {
        const lengthBeforeRemove = this.pieces.length
        const newPieces = this.pieces.filter((piece) => piece.pieceId !== pieceId)
        const lengthAfterRemove = newPieces.length
        this.pieces = newPieces
        console.log(lengthBeforeRemove, lengthAfterRemove)
        if (lengthBeforeRemove === lengthAfterRemove) {
            throw new Error("remove piece failure")
        }
    }

    moveAfterCapture(fromPieceId: string, toNodeId: string): void {
        const piece = this.getPieceById(fromPieceId)
        if (!piece) {
            throw new Error("piece was not found")
        }
        piece.nodeId = toNodeId // auto update in this.pieces because it's reference
    }

    /**
     * Capture a piece
     * # include following way:
     * - check can capture
     * - remove piece will be captured
     * - move piece canture to new position (asign new nodeId)
     * 
     * @param pieceIdA 
     * @param pieceIdB 
     * @returns 
     */
    tryCapturePiece(pieceIdA: string, pieceIdB: string): boolean {
        const canCap = this.canCapture(pieceIdA, pieceIdB)
        if (!canCap) { return false }
        const pieceB = this.getPieceById(pieceIdB)
        if (!pieceB) { throw new Error("check can capture ok but, pieceB was not found afterward") }

        this.removePieceById(pieceIdB)
        this.moveAfterCapture(pieceIdA, pieceB.nodeId)
        return true
    }

}