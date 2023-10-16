import { ID } from '@antv/graphlib';
import { INode, IEdge } from '../../packages/graph/src/types';
/**
 * Convert the old version of the data format to the new version
 * @param data old data
 * @return {{nodes:INode[],edges:IEdge[]}} new data
 */
export const dataTransformer = (data: {
  nodes: { id: ID; [key: string]: any }[];
  edges: { source: ID; target: ID; [key: string]: any }[];
}): { nodes: INode[]; edges: IEdge[] } => {
  const { nodes, edges } = data;
  return {
    nodes: nodes.map((n) => {
      const { id, ...rest } = n;
      return { id, data: rest ? rest : {} };
    }),
    edges: edges.map((e, i) => {
      const { id, source, target, ...rest } = e;
      return { id: id ? id : `edge-${i}`, target, source, data: rest };
    }),
  };
};

export const dataPropertiesTransformer = (data: { nodes: { id: NodeID, [key: string]: any }[], edges: { source: NodeID, target: NodeID, [key: string]: any }[] }): { nodes: INode[], edges: IEdge[] } => {
    const { nodes, edges } = data;
    return {
        nodes: nodes.map((n) => {
            const { id, properties, ...rest } = n;
            return { id, data: { ...properties, ...rest } };
        }),
        edges: edges.map((e, i) => {
            const { id, source, target, ...rest } = e;
            return { id: id ? id : `edge-${i}`, target, source, data: rest };
        }),
    };
};


export const dataLabelDataTransformer = (data: { nodes: { id: NodeID, [key: string]: any }[], edges: { source: NodeID, target: NodeID, [key: string]: any }[] }): { nodes: INode[], edges: IEdge[] } => {
    const { nodes, edges } = data;
    return {
        nodes: nodes.map((n) => {
            const { id, label, data } = n;
            return { id, data: { label, ...data } };
        }),
        edges: edges.map((e, i) => {
            const { id, source, target, ...rest } = e;
            return { id: id ? id : `edge-${i}`, target, source, data: rest };
        }),
    };
};