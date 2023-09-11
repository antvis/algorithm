
/**
 * ListNode in LinkedList
 */
export class LinkedListNode<T> {
  public value: T;

  public next: LinkedListNode<T>;

  constructor(value: T, next: LinkedListNode<T> = null) {
    this.value = value;
    this.next = next;
  }

  toString(callback?: Function) {
    return callback ? callback(this.value) : `${this.value}`;
  }
}

export default class LinkedList<T> {
  public head: LinkedListNode<T>;

  public tail: LinkedListNode<T>;

  public compare: Function;
  defaultComparator = (a: T, b: T) => {
    if (a === b) {
      return true;
    }
    return false;
  };

  constructor(comparator?: Function) {
    this.head = null;
    this.tail = null;
    this.compare = comparator || this.defaultComparator;
  }

  /**
   * Adds the specified element to the header of the linked list
   * @param value The element
   */
  prepend(value: T) {
    // 在头部添加一个节点
    const newNode = new LinkedListNode(value, this.head);
    this.head = newNode;

    if (!this.tail) {
      this.tail = newNode;
    }

    return this;
  }

  /**
   * Adds the specified element to the linked list
   * @param value The element
   */
  append(value: T) {
    const newNode = new LinkedListNode(value);

    // 如果不存在头节点，则将创建的新节点作为头节点
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;

      return this;
    }

    // 将新节点附加到链表末尾
    this.tail.next = newNode;
    this.tail = newNode;

    return this;
  }

  /**
   * Delete the specified element
   * @param value The element
   */
  delete(value: T): LinkedListNode<T> {
    if (!this.head) {
      return null;
    }

    let deleteNode = null;

    // 如果删除的是头部元素，则将next作为头元素
    while (this.head && this.compare(this.head.value, value)) {
      deleteNode = this.head;
      this.head = this.head.next;
    }

    let currentNode = this.head;

    if (currentNode !== null) {
      // 如果删除了节点以后，将next节点前移
      while (currentNode.next) {
        if (this.compare(currentNode.next.value, value)) {
          deleteNode = currentNode.next;
          currentNode.next = currentNode.next.next;
        } else {
          currentNode = currentNode.next;
        }
      }
    }

    // 检查尾部节点是否被删除
    if (this.compare(this.tail.value, value)) {
      this.tail = currentNode;
    }

    return deleteNode;
  }

  /**
   * Finds the first occurrence of a node in the linked list that matches the specified value or satisfies the callback function.
  @param value - The value to search for in the linked list.
  @param callback - An optional callback function to determine if a node matches the search criteria.
  Copy.The callback should accept a value from a node as its argument and return a boolean indicating a match.
  @returns The first LinkedListNode<T> that matches the search criteria, or null if no match is found.
  */
  find({ value = undefined, callback = undefined }: { value: T, callback: Function }): LinkedListNode<T> {
    if (!this.head) {
      return null;
    }
    let currentNode = this.head;
    while (currentNode) {
      //find by callback first
      if (callback && callback(currentNode.value)) {
        return currentNode;
      }
      if (value !== undefined && this.compare(currentNode.value, value)) {
        return currentNode;
      }
      currentNode = currentNode.next;
    }

    return null;
  }

  /**
   * Delete tail node
   */
  deleteTail() {
    const deletedTail = this.tail;

    if (this.head === this.tail) {
      // 链表中只有一个元素
      this.head = null;
      this.tail = null;
      return deletedTail;
    }

    let currentNode = this.head;
    while (currentNode.next) {
      if (!currentNode.next.next) {
        currentNode.next = null;
      } else {
        currentNode = currentNode.next;
      }
    }

    this.tail = currentNode;

    return deletedTail;
  }

  /**
   * Delete head node
   */
  deleteHead() {
    if (!this.head) {
      return null;
    }

    const deletedHead = this.head;

    if (this.head.next) {
      this.head = this.head.next;
    } else {
      this.head = null;
      this.tail = null;
    }

    return deletedHead;
  }

  /**
   * Convert a set of elements to nodes in a linked list
   * @param values element in linkedlist
   */
  fromArray(values: T[]) {
    values.forEach((value) => this.append(value));
    return this;
  }

  /**
   * Convert nodes in a linked list into array elements
   */
  toArray() {
    const nodes = [];

    let currentNode = this.head;

    while (currentNode) {
      nodes.push(currentNode);
      currentNode = currentNode.next;
    }

    return nodes;
  }

  /**
   * Invert element nodes in a linked list
   */
  reverse() {
    let currentNode = this.head;
    let prevNode = null;
    let nextNode = null;
    while (currentNode) {
      // 存储下一个元素节点
      nextNode = currentNode.next;

      // 更改当前节点的下一个节点，以便将它连接到上一个节点上
      currentNode.next = prevNode;

      // 将 prevNode 和 currentNode 向前移动一步
      prevNode = currentNode;
      currentNode = nextNode;
    }

    this.tail = this.head;
    this.head = prevNode;
  }

  toString(callback: Function = undefined) {
    return this.toArray()
      .map((node) => node.toString(callback))
      .toString();
  }
}
