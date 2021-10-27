
/**
 * 向量运算
 */
import { clone } from '@antv/util';

class Vector {
  arr: number[];

  constructor(arr) {
    this.arr = arr;
  }

  add(otherVector) {
    const otherArr = otherVector.arr;
    if (!this.arr?.length) {
      return new Vector(otherArr);
    }
    if (!otherArr?.length) {
      return new Vector(this.arr);
    }
    if (this.arr.length === otherArr.length) {
      let res = [];
      for(let key in this.arr) {
        res[key] = this.arr[key] + otherArr[key];
      }
      return new Vector(res);
    }
  }

  subtract(otherVector) {
    const otherArr = otherVector.arr;
    if (!this.arr?.length) {
      return new Vector(otherArr);
    }
    if (!otherArr?.length) {
      return new Vector(this.arr);
    }
    if (this.arr.length === otherArr.length) {
      let res = [];
      for(let key in this.arr) {
        res[key] = this.arr[key] - otherArr[key];
      }
      return new Vector(res);
    }
  }

  avg(length) {
    let res = [];
    for(let key in this.arr) {
      res[key] = this.arr[key] / length;
    }
    return new Vector(res);
  }

  negate() {
    let res = [];
    for(let key in this.arr) {
      res[key] = - this.arr[key];
    }
    return new Vector(res);
  }

  // 平方欧式距离
  squareEuclideanDistance(otherVector) {
    const otherArr = otherVector.arr;
    if (!this.arr?.length || !otherArr?.length) {
      return 0;
    }
    if (this.arr.length === otherArr.length) {
      let res = 0;
      for(let key in this.arr) {
        res += Math.pow(this.arr[key] - otherVector.arr[key], 2);
      }
      return res;
    }
  }

  // 归一化处理
  normalize() {
    let res = [];
    const cloneArr = clone(this.arr);
    cloneArr.sort((a, b) => a - b);
    const max = cloneArr[cloneArr.length - 1];
    const min = cloneArr[0];
    for(let key in this.arr) {
      res[key] = (this.arr[key] - min) / (max - min);
    }
    return new Vector(res);
  }
}

export default Vector;
