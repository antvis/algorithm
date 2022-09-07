/**
 * 数据预处理
 */
import { uniq } from '@antv/util';
import { PlainObject, DistanceType, GraphData, KeyValueMap } from '../types';
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
  const allKeyValueMap: KeyValueMap = {};
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
  // 获取数据中所有的属性/特征及其对应的值
  const allKeyValueMap = getAllKeyValueMap(dataList, involvedKeys, uninvolvedKeys);
  const oneHotCode = [];
  if (!Object.keys(allKeyValueMap).length) {
    return oneHotCode;
  }

  // 获取所有的属性/特征值
  const allValue = Object.values(allKeyValueMap);
  // 是否所有属性/特征的值都是数值型
  const isAllNumber = allValue.every(value => value.every(item => (typeof(item) === 'number')));

  // 对数据进行one-hot编码
  dataList.forEach((data, index) => {
    let code = [];
    Object.keys(allKeyValueMap).forEach(key => {
      const keyValue = data[key];
      const allKeyValue = allKeyValueMap[key];
      const valueIndex = allKeyValue.findIndex(value => keyValue === value);
      let subCode = [];
      // 如果属性/特征所有的值都能转成数值型，不满足分箱，则直接用值（todo: 为了收敛更快，需做归一化处理）
      if (isAllNumber) {
        subCode.push(keyValue);
      } else {
        // 进行one-hot编码
        for(let i = 0; i < allKeyValue.length; i++) {
          if (i === valueIndex) {
            subCode.push(1);
          } else {
            subCode.push(0);
          }
        }
      }
      code = code.concat(subCode);
    })
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
