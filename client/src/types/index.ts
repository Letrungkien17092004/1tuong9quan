export interface IBoardNode {
    nodeId: string
    row: number
    col: number
}

export interface IPieceNode {
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
     * @param from from nodeId
     * @param to to nodeId
     */
    canMove(from: string, to: string): boolean

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
}

