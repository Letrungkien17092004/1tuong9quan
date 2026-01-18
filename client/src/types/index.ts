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
    attemptMove(fromPieceId: string, toNodeId: string): void

    /**
     * get common line betwwen two nodes
     * @param nodeIdA nodeId A
     * @param nodeIdB nodeId B
     */
    getCommonLine(nodeIdA: string, nodeIdB: string): IBoardLine | undefined
    
    /**
     * get a piece by nodeId has attached to that element
     * @param nodeId 
     */
    getPieceByNodeId(nodeId: string): IPieceNode | undefined

    /**
     * Remove a piece by pieceId
     * @param pieceId 
     * @returns true if success, otherwise false
     */
    removePieceById(pieceId: string): void
    
    /**
     * Check if one node can capture another node
     * @param pieceIdA pieceId of the capture node
     * @param pieceIdB pieceId of the node will be captured
     */
    canCapture(pieceIdA: string, pieceIdB: string): boolean

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
    tryCapturePiece(pieceIdA: string, pieceIdB: string): boolean

}

