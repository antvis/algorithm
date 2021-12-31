
/**
 * 向量运算
 */
import { clone } from '@antv/util';

class Vector {
  arr: number[];

  constructor(arr) {
    this.arr = arr;
  }

  getArr() {
    return this.arr || [];
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
      for (let index in this.arr) {
        res[index] = this.arr[index] + otherArr[index];
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
      for (let index in this.arr) {
        res[index] = this.arr[index] - otherArr[index];
      }
      return new Vector(res);
    }
  }

  avg(length) {
    let res = [];
    if (length !== 0) {
      for (let index in this.arr) {
        res[index] = this.arr[index] / length;
      }
    }
    return new Vector(res);
  }

  negate() {
    let res = [];
    for (let index in this.arr) {
      res[index] = - this.arr[index];
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
      for (let index in this.arr) {
        res += Math.pow(this.arr[index] - otherVector.arr[index], 2);
      }
      return res;
    }
  }

  // 欧式距离
  euclideanDistance(otherVector) {
    const otherArr = otherVector.arr;
    if (!this.arr?.length || !otherArr?.length) {
      return 0;
    }
    if (this.arr.length === otherArr.length) {
      let res = 0;
      for (let index in this.arr) {
        res += Math.pow(this.arr[index] - otherVector.arr[index], 2);
      }
      return Math.sqrt(res);
    } else {
      console.error('The two vectors are unequal in length.')
    }
  }

  // 归一化处理
  normalize() {
    let res = [];
    const cloneArr = clone(this.arr);
    cloneArr.sort((a, b) => a - b);
    const max = cloneArr[cloneArr.length - 1];
    const min = cloneArr[0];
    for (let index in this.arr) {
      res[index] = (this.arr[index] - min) / (max - min);
    }
    return new Vector(res);
  }

  // 2范数 or 模长
  norm2() {
    if (!this.arr?.length) {
      return 0;
    }
    let res = 0;
      for (let index in this.arr) {
        res += Math.pow(this.arr[index], 2);
      }
    return Math.sqrt(res);
  }

  // 两个向量的点积
  dot(otherVector) {
    const otherArr = otherVector.arr;
    if (!this.arr?.length || !otherArr?.length) {
      return 0;
    }
    if (this.arr.length === otherArr.length) {
      let res = 0;
      for (let index in this.arr) {
        res += this.arr[index] * otherVector.arr[index];
      }
      return res;
    } else {
      console.error('The two vectors are unequal in length.')
    }
  }

  // 两个向量比较
  equal(otherVector) {
    const otherArr = otherVector.arr;
    if (this.arr?.length !== otherArr?.length) {
      return false;
    }
    for (let index in this.arr) {
      if (this.arr[index] !== otherArr[index]) {
        return false;
      }
    }
    return true;
  }
}

export default Vector;
