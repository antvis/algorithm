import { Edge, Node, PlainObject } from "@antv/graphlib";
import { KeyValueMap, NodeData, NodeID } from "./types";
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
  // Use the specified keys when the keys participating in the calculation is specified
  if (involvedKeys?.length) {
    keys = involvedKeys;
  } else {
    // When the extracted keys is not specified, all key in the data is extracted
    dataList.forEach((data) => {
      keys = keys.concat(Object.keys(data));
    });
    keys = uniq(keys);
  }
  // Get the value array of all key with non-null values
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
  // Get all attributes / features in the data and their corresponding values
  const allKeyValueMap = getAllKeyValueMap(dataList, involvedKeys, uninvolvedKeys);
  const oneHotCode: unknown[][] = [];
  if (!Object.keys(allKeyValueMap).length) {
    return oneHotCode;
  }
  // Get all attribute / feature values
  const allValue = Object.values(allKeyValueMap);
  // Whether the values of all attributes / features are numerical
  const isAllNumber = allValue.every((value) => value.every((item) => (typeof (item) === 'number')));
  // One-hot encode the data
  dataList.forEach((data, index) => {
    let code: unknown[] = [];
    Object.keys(allKeyValueMap).forEach((key) => {
      const keyValue = data[key];
      const allKeyValue = allKeyValueMap[key];
      const valueIndex = allKeyValue.findIndex((value) => keyValue === value);
      const subCode = [];
      // If all the values of the attribute / feature can be converted to numerical type and do not satisfy the box division, then use the value directly (todo: normalization is needed for faster convergence)
      if (isAllNumber) {
        subCode.push(keyValue);
      } else {
        // Encode one-hot
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

