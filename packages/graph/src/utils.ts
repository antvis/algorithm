import { Node, PlainObject } from "@antv/graphlib";
import { KeyValueMap, NodeData, NodeID, INode, IEdge } from "./types";
import { uniq } from "@antv/util";

export const getAllProperties = (nodes: Node<NodeData>[]) => {
  const allProperties: NodeData[] = [];
  nodes.forEach((node) => {
    allProperties.push(node.data);
  });
  return allProperties;
};

export const getAllKeyValueMap = (dataList: PlainObject[], involvedKeys?: string[], uninvolvedKeys?: string[]) => {
  let keys: string[] = [];
  // 指定了参与计算的keys时，使用指定的keys
  if (involvedKeys?.length) {
    keys = involvedKeys;
  } else {
    // 未指定抽取的keys时，提取数据中所有的key
    dataList.forEach((data) => {
      keys = keys.concat(Object.keys(data));
    });
    keys = uniq(keys);
  }
  // 获取所有值非空的key的value数组
  const allKeyValueMap: KeyValueMap = {};
  keys.forEach((key) => {
    const value: unknown[] = [];
    dataList.forEach((data) => {
      if (data[key] !== undefined && data[key] !== '') {
        value.push(data[key]);
      }
    });
    if (value.length && !uninvolvedKeys?.includes(key)) {
      allKeyValueMap[key] = uniq(value);
    }
  });

  return allKeyValueMap;
};

export const oneHot = (dataList: PlainObject[], involvedKeys?: string[], uninvolvedKeys?: string[]) => {
  // 获取数据中所有的属性/特征及其对应的值
  const allKeyValueMap = getAllKeyValueMap(dataList, involvedKeys, uninvolvedKeys);
  const oneHotCode: unknown[][] = [];
  if (!Object.keys(allKeyValueMap).length) {
    return oneHotCode;
  }

  // 获取所有的属性/特征值
  const allValue = Object.values(allKeyValueMap);
  // 是否所有属性/特征的值都是数值型
  const isAllNumber = allValue.every((value) => value.every((item) => (typeof (item) === 'number')));

  // 对数据进行one-hot编码
  dataList.forEach((data, index) => {
    let code: unknown[] = [];
    Object.keys(allKeyValueMap).forEach((key) => {
      const keyValue = data[key];
      const allKeyValue = allKeyValueMap[key];
      const valueIndex = allKeyValue.findIndex((value) => keyValue === value);
      const subCode = [];
      // 如果属性/特征所有的值都能转成数值型，不满足分箱，则直接用值（todo: 为了收敛更快，需做归一化处理）
      if (isAllNumber) {
        subCode.push(keyValue);
      } else {
        // 进行one-hot编码
        for (let i = 0; i < allKeyValue.length; i++) {
          if (i === valueIndex) {
            subCode.push(1);
          } else {
            subCode.push(0);
          }
        }
      }
      code = code.concat(subCode);
    });
    oneHotCode[index] = code;
  });
  return oneHotCode;
};

/**
 * Convert the old version of the data format to the new version
 * @param data old data
 * @return {{nodes:INode[],edges:IEdge[]}} new data
 */
export const dataTransformer = (data: { nodes: { id: NodeID, [key: string]: any }[], edges: { source: NodeID, target: NodeID, [key: string]: any }[] }): { nodes: INode[], edges: IEdge[] } => {
  const { nodes, edges } = data;
  return {
    nodes: nodes.map(n => {
      const { id, ...rest } = n;
      return { id, data: rest };
    }),
    edges: edges.map((e, i) => {
      const { id, source, target, ...rest } = e;
      return { id: id ? id : `edge-${i}`, target, source, data: rest };
    }),
  }
}