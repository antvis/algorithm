import { uniq } from '@antv/util';
import { PlainObject, DistanceType, GraphData } from '../types';
import Vector from './vector';

/**
 * 获取数据中所有的属性及其对应的值
 * @param dataList 数据集
 * @param involvedKeys 参与计算的key集合
 * @param uninvolvedKeys 不参与计算的key集合
 */
export const getAllKeyValueMap = (dataList: PlainObject[], involvedKeys?: string[], uninvolvedKeys?: string[]) => {
  let keys = [];
  // 指定了参与计算的keys时，使用指定的keys
  if (involvedKeys?.length) {
    keys = involvedKeys;
  } else {
    // 未指定抽取的keys时，提取数据中所有的key
    dataList.forEach(data => {
      keys = keys.concat(Object.keys(data));
    })
    keys = uniq(keys);
  }
  // 获取所有值非空的key的value数组
  const allKeyValueMap = {};
  keys.forEach(key => {
    let value = [];
    dataList.forEach(data => {
      if (data[key] !== undefined && data[key] !== '') {
        value.push(data[key]);
      }
    })
    if (value.length && !uninvolvedKeys?.includes(key)) {
      allKeyValueMap[key] = uniq(value);
    }
  })

  return allKeyValueMap;
}

/**
 * one-hot编码：数据特征提取
 * @param dataList 数据集
 * @param involvedKeys 参与计算的的key集合
 * @param uninvolvedKeys 不参与计算的key集合
 */
export const oneHot = (dataList: PlainObject[], involvedKeys?: string[], uninvolvedKeys?: string[]) => {
  // 获取数据中所有的属性及其对应的值
  const allKeyValueMap = getAllKeyValueMap(dataList, involvedKeys, uninvolvedKeys);
  const oneHotCode = [];
  if (!Object.keys(allKeyValueMap).length) {
    return oneHotCode;
  }
  
  // 对数据进行one-hot编码
  dataList.forEach((data, index) => {
    let code = [];
    if (Object.keys(allKeyValueMap).length === 1) {
      // 如果只有一个属性且所有的属性值都能转成数值型，则直接用属性值
      const key = Object.keys(allKeyValueMap)[0];
      const keyValue = allKeyValueMap[key];
      if (keyValue.every(value => !isNaN(Number(value)))) {
        code = [data[key]];
      }
    } else {
      Object.keys(allKeyValueMap).forEach(key => {
        const keyValue = data[key];
        const allKeyValue = allKeyValueMap[key];
        const valueIndex = allKeyValue.findIndex(value => keyValue === value);
        let subCode = [];
        for(let i = 0; i < allKeyValue.length; i++) {
          if (i === valueIndex) {
            subCode.push(1);
          } else {
            subCode.push(0);
          }
        }
        code = code.concat(subCode);
      })
    }
    oneHotCode[index] = code;
  })
  return oneHotCode;
}

/**
 * getDistance：获取两个元素之间的距离
 * @param item
 * @param otherItem
 * @param distanceType 距离类型
 * @param graphData 图数据
 */
export const getDistance = (item, otherItem, distanceType: DistanceType = DistanceType.EuclideanDistance, graphData?: GraphData) => {
  let distance = 0;
  switch (distanceType) {
    case DistanceType.EuclideanDistance:
      distance = new Vector(item).euclideanDistance(new Vector(otherItem));
      break;
    default:
      break;
  }
  return distance;
}

export default {
  getAllKeyValueMap,
  oneHot,
  getDistance,
}
