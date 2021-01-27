import { GraphData, DegreeType } from '../types';
import createWorker from './createWorker';
import { ALGORITHM } from './constant';

/**
 * 获取节点的度
 * @param graphData 图数据
 */
const getDegreeAsync = (graphData: GraphData) =>
  createWorker<DegreeType>(ALGORITHM.getDegree)(graphData);

export { getDegreeAsync };
