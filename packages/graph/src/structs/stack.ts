import LinkedList from './linked-list';
export default class Stack<T> {

  private linkedList: LinkedList<T>;

  private maxStep: number;

  constructor(maxStep: number = 10) {
    this.linkedList = new LinkedList();
    this.maxStep = maxStep;
  }

  get length() {
    return this.linkedList.toArray().length;
  }

  /**
   * Determine whether the stack is empty, if there is no header element in the linked list, the stack is empty
   */
  isEmpty() {
    return !this.linkedList.head;
  }

  /**
   * Whether to the maximum length of the defined stack, if the maximum length is reached, the stack is no longer allowed to enter the stack
   */
  isMaxStack() {
    return this.toArray().length >= this.maxStep;
  }

  /**
   * Access the top element
   */
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.linkedList.head.value;
  }

  push(value: T) {
    this.linkedList.prepend(value);
    if (this.length > this.maxStep) {
      this.linkedList.deleteTail();
    }
  }

  pop() {
    const removeHead = this.linkedList.deleteHead();
    return removeHead ? removeHead.value : null;
  }

  toArray() {
    return this.linkedList.toArray().map((node) => node.value);
  }

  clear() {
    while (!this.isEmpty()) {
      this.pop();
    }
  }
}
