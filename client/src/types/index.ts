export interface IBoardNode {
    nodeId: string
    row: number
    col: number
}

export interface IPieceNode {
    pieceId: string
    side: "green" | "blue"
    isKing: boolean
    nodeId: string
}

export interface IBoardLine {
    lineId: string
    nodeIds: string[]
}

export interface IBoardGraph {
    readonly nodes: IBoardNode[]
    readonly edges: Record<string, string[]>
    readonly lines: IBoardLine[]
    readonly pieces: IPieceNode[]
    readonly rows: number
    readonly cols: number
    readonly cell: number

    /**
     * check can move from the node to other node by nodeId
     * @param fromNodeId from nodeId
     * @param toNodeId to nodeId
     */
    canMove(fromNodeId: string, toNodeId: string): boolean

    /**
     * Convert from row and col positions of a node to pixel positions
     * @param nodeId 
     */
    convertNodeToPixel(nodeId: string): { x: number, y: number }

    /**
     * find a node by nodeId
     * @param nodeId 
     */
    getNodeFromId(nodeId: string): IBoardNode | undefined

    /**
     * find a piece by the pieceId
     * @param pieceId 
     */
    getPieceById(pieceId: string): IPieceNode | undefined

    /**
     * Move a piece
     * @param fromPieceId 
     * @param toNodeId 
     * @returns 
     */
    movePiece(fromPieceId: string, toNodeId: string): boolean
}

