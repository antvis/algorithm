
export default class MinBinaryHeap {
  list: number[];

  compareFn: (a: any, b: any) => number;

  constructor(compareFn: (a: any, b: any) => number) {
    this.compareFn = compareFn || ((a: number, b: number) => {
      return a - b;
    });
    this.list = [];
  }

  getLeft(index: number) {
    return 2 * index + 1;
  }

  getRight(index: number) {
    return 2 * index + 2;
  }

  getParent(index: number) {
    if (index === 0) {
      return null;
    }
    return Math.floor((index - 1) / 2);
  }

  isEmpty() {
    return this.list.length <= 0;
  }

  top() {
    return this.isEmpty() ? undefined : this.list[0];
  }

  delMin() {
    const top = this.top();
    const bottom = this.list.pop();
    if (this.list.length > 0) {
      this.list[0] = bottom;
      this.moveDown(0);
    }
    return top;
  }

  insert(value: number) {
    if (value !== null) {
      this.list.push(value);
      const index = this.list.length - 1;
      this.moveUp(index);
      return true;
    }
    return false;
  }

  moveUp(index: number) {
    let i = index;
    let parent = this.getParent(i);
    while (i && i > 0 && this.compareFn(this.list[i], this.list[i]) > 0) {
      // swap
      const tmp = this.list[parent];
      this.list[parent] = this.list[i];
      this.list[i] = tmp;
      // [this.list[i], this.list[parent]] = [this.list[parent], this.list[i]]
      i = parent;
      parent = this.getParent(i);
    }
  }

  moveDown(index: number) {
    let element = index;
    const left = this.getLeft(index);
    const right = this.getRight(index);
    const size = this.list.length;
    if (left !== null && left < size && this.compareFn(this.list[element], this.list[left]) > 0) {
      element = left;
    } else if (
      right !== null &&
      right < size &&
      this.compareFn(this.list[element], this.list[right]) > 0
    ) {
      element = right;
    }
    if (index !== element) {
      [this.list[index], this.list[element]] = [this.list[element], this.list[index]];
      this.moveDown(element);
    }
  }
}
