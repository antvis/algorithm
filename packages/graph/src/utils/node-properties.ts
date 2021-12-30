import { NodeConfig } from '../types';
import { secondReg, dateReg } from '../constants/time';

// 获取所有属性并排序
export const getAllSortProperties = (nodes: NodeConfig[] = [], n: number = 100) => {
  const propertyKeyInfo = {};
  nodes.forEach(node => {
    if (!node.properties) {
      return;
    }
    Object.keys(node.properties).forEach(propertyKey => {
      // 目前过滤只保留可以转成数值型的或日期型的, todo: 统一转成one-hot特征向量或者embedding
      if (propertyKey === 'id' || !`${node.properties[propertyKey]}`.match(secondReg) && 
        !`${node.properties[propertyKey]}`.match(dateReg) && 
        isNaN(Number(node.properties[propertyKey]))) {
        if (propertyKeyInfo.hasOwnProperty(propertyKey)) {
            delete propertyKeyInfo[propertyKey];
        }
        return;
      }
      if (propertyKeyInfo.hasOwnProperty(propertyKey)) {
        propertyKeyInfo[propertyKey] += 1;
      } else {
        propertyKeyInfo[propertyKey] = 1;
      }
    })
  })

  // 取top50的属性
  const sortKeys = Object.keys(propertyKeyInfo).sort((a,b) => propertyKeyInfo[b] - propertyKeyInfo[a]);
  return sortKeys.length < n ? sortKeys : sortKeys.slice(0, n);
}
  
const processProperty = (properties, propertyKeys) => propertyKeys.map(key => {
  if (properties.hasOwnProperty(key)) {
    // 可以转成数值的直接转成数值
    if (!isNaN(Number(properties[key]))) {
      return Number(properties[key]);
    }
    // 时间型的转成时间戳
    if (properties[key].match(secondReg) || properties[key].match(dateReg)) {
      // @ts-ignore
      return Number(Date.parse(new Date(properties[key]))) / 1000;
    }
  }
  return 0;
})
  
// 获取属性特征权重
export const getPropertyWeight = (nodes: NodeConfig[]) => {
  const propertyKeys = getAllSortProperties(nodes);
  let allPropertiesWeight = [];
  for (let i = 0; i < nodes.length; i++) {
    allPropertiesWeight[i] = processProperty(nodes[i].properties, propertyKeys);
  }
  return allPropertiesWeight;
}

// 获取所有节点的属性集合
export const getAllProperties = (nodes, key='properties') => {
  const allProperties = [];
  nodes.forEach(node => {
    if (!node.properties) {
      return;
    }
    allProperties.push(node[key]);
  })
  return allProperties;
}

export default {
  getAllSortProperties,
  getPropertyWeight,
  getAllProperties
}
