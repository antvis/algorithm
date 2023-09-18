/**
 * Disjoint set to support quick union
 */
export default class UnionFind {
  count: number;

  parent: { [key: number | string]: number | string };

  constructor(items: (number | string)[]) {
    this.count = items.length;
    this.parent = {};
    for (const i of items) {
      this.parent[i] = i;
    }
  }

  // find the root of the item
  find(item: (number | string)) {
    let resItem = item;
    while (this.parent[resItem] !== resItem) {
      resItem = this.parent[resItem];
    }
    return resItem;
  }

  union(a: (number | string), b: (number | string)) {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA === rootB) return;
    // make the element with smaller root the parent
    if (rootA < rootB) {
      if (this.parent[b] !== b) this.union(this.parent[b], a);
      this.parent[b] = this.parent[a];
    } else {
      if (this.parent[a] !== a) this.union(this.parent[a], b);
      this.parent[a] = this.parent[b];
    }
  }

  // Determine that A and B are connected
  connected(a: (number | string), b: (number | string)) {
    return this.find(a) === this.find(b);
  }
}
