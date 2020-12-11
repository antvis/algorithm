import LinkedList, { LinkedListNode } from '../../src/structs/linked-list'

describe('linked list struct', () => {
  it('init linedListNode', () => {
    const linkedNode1 = new LinkedListNode(1)
    const linkedNode2 = new LinkedListNode(2, linkedNode1)

    expect(linkedNode1.value).toBe(1)
    expect(linkedNode1.next).toBe(null)
    expect(linkedNode1.toString()).toEqual('1')

    expect(linkedNode2.value).toBe(2)
    expect(linkedNode2.next).toBe(linkedNode1)
    expect(linkedNode2.toString()).toBe('2')
  })

  const linkedList = new LinkedList()
  it('init linked list', () => {
    expect(linkedList).not.toBe(undefined)
  })

  it('find & append', () => {
    let node1 = linkedList.find({ value: 1 })
    expect(node1).toBe(null)

    // append node
    linkedList.append(1)
    node1 = linkedList.find({ value: 1 })

    expect(node1).not.toBe(null)
    expect(node1.value).toBe(1)
  })

  it('prepend', () => {
    linkedList.prepend(2)
    
    const node1 = linkedList.find({ value: 1 })
    const node2 = linkedList.find({ value: 2 })
    expect(linkedList.toArray()).toEqual([node2, node1])
    expect(linkedList.toString()).toEqual('2,1')
  })

  it('deleteHead', () => {
    const deleteHead = linkedList.deleteHead()
    expect(deleteHead).not.toBe(undefined)
    expect(deleteHead.value).toEqual(2)
    expect(deleteHead.next).toEqual({ next: null, value: 1 })
  })

  it('deleteTail', () => {
    linkedList.prepend(3)

    const deleteTail = linkedList.deleteTail()
    expect(deleteTail).not.toBe(undefined)
    expect(deleteTail.value).toBe(1)
    expect(deleteTail.next).toBe(null)
  })

  it('delete', () => {
    linkedList.append(5)
    linkedList.append(6)

    const node3 = linkedList.find({ value: 3 })
    const node5 = linkedList.find({ value: 5 })
    const node6 = linkedList.find({ value: 6 })
    expect(linkedList.toArray()).toEqual([node3, node5, node6])
    expect(linkedList.toString()).toEqual('3,5,6')

    // 删除一个不存在的元素
    let deleteNode = linkedList.delete(8)
    expect(deleteNode).toBe(null)

    // 删除存在的元素
    deleteNode = linkedList.delete(5)
    expect(deleteNode).not.toBe(null)
    expect(deleteNode.value).toBe(5)
    expect(deleteNode.next).toEqual({ next: null, value: 6 })

    deleteNode = linkedList.find({ value: 5 })
    expect(deleteNode).toBe(null)
  })

  it('reverse', () => {
    expect(linkedList.toString()).toEqual('3,6')
    linkedList.reverse()
    expect(linkedList.toString()).toEqual('6,3')
  })
})