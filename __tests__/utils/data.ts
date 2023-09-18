import { NodeID, INode, IEdge } from "../../packages/graph/src/types";
/**
 * Convert the old version of the data format to the new version
 * @param data old data
 * @return {{nodes:INode[],edges:IEdge[]}} new data
 */
export const dataTransformer = (data: { nodes: { id: NodeID, [key: string]: any }[], edges: { source: NodeID, target: NodeID, [key: string]: any }[] }): { nodes: INode[], edges: IEdge[] } => {
    const { nodes, edges } = data;
    return {
        nodes: nodes.map((n) => {
            const { id, ...rest } = n;
            return { id, data: rest };
        }),
        edges: edges.map((e, i) => {
            const { id, source, target, ...rest } = e;
            return { id: id ? id : `edge-${i}`, target, source, data: rest };
        }),
    };
};