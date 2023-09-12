import { Vector } from "./vector";

/**
Calculates the cosine similarity
@param item - The element.
@param targetItem - The target element.
@returns The cosine similarity between the item and the targetItem.
*/
export const cosineSimilarity = (
    item: number[],
    targetItem: number[],
): number => {
    // Vector of the target element
    const targetItemVector = new Vector(targetItem);
    // Norm of the target element vector
    const targetNodeNorm2 = targetItemVector.norm2();
    // Vector of the item
    const itemVector = new Vector(item);
    // Norm of the item vector
    const itemNorm2 = itemVector.norm2();
    // Calculate the dot product of the item vector and the target element vector
    const dot = targetItemVector.dot(itemVector);
    const norm2Product = targetNodeNorm2 * itemNorm2;
    // Calculate the cosine similarity between the item vector and the target element vector
    const cosineSimilarity = norm2Product ? dot / norm2Product : 0;
    return cosineSimilarity;
}
