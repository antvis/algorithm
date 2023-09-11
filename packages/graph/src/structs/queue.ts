import LinkedList from './linked-list';

export default class Queue<T> {
  public linkedList: LinkedList<T>;

  constructor() {
    this.linkedList = new LinkedList<T>();
  }

  public isEmpty() {
    return !this.linkedList.head;
  }

  /**
   * get the first element without dequeue
   */
  public peek() {
    if (!this.linkedList.head) {
      return null;
    }
    return this.linkedList.head.value;
  }

  /**
   * enqueue an element at the tail
   * @param value
   */
  public enqueue(value: T) {
    this.linkedList.append(value);
  }

  /**
   * Dequeue the first element. If the queue is empty, return null.
   */
  public dequeue() {
    const removeHead = this.linkedList.deleteHead();
    return removeHead ? removeHead.value : null;
  }

  public toString(callback?: any) {
    return this.linkedList.toString(callback);
  }
}
