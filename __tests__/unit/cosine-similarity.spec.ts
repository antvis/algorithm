import { cosineSimilarity } from "../../packages/graph/src";

describe('cosineSimilarity abnormal demo: ', () => {
    it('item contains only zeros: ', () => {
        const item = [0, 0, 0];
        const targetTtem = [3, 1, 1];
        const cosineSimilarityValue = cosineSimilarity(item, targetTtem);
        expect(cosineSimilarityValue).toBe(0);
    });
    it('targetTtem contains only zeros: ', () => {
        const item = [3, 5, 2];
        const targetTtem = [0, 0, 0];
        const cosineSimilarityValue = cosineSimilarity(item, targetTtem);
        expect(cosineSimilarityValue).toBe(0);
    });
    it('item and targetTtem both contains only zeros: ', () => {
        const item = [0, 0, 0];
        const targetTtem = [0, 0, 0];
        const cosineSimilarityValue = cosineSimilarity(item, targetTtem);
        expect(cosineSimilarityValue).toBe(0);
    });
});

describe('cosineSimilarity normal demo: ', () => {
    it('demo similar: ', () => {
        const item = [30, 0, 100];
        const targetTtem = [32, 1, 120];
        const cosineSimilarityValue = cosineSimilarity(item, targetTtem);
        expect(cosineSimilarityValue).toBeGreaterThanOrEqual(0);
        expect(cosineSimilarityValue).toBeLessThan(1);
        expect(Number(cosineSimilarityValue.toFixed(3))).toBe(0.999);
    });
    it('demo dissimilar: ', () => {
        const item = [10, 300, 2];
        const targetTtem = [1, 2, 30];
        const cosineSimilarityValue = cosineSimilarity(item, targetTtem);
        expect(cosineSimilarityValue).toBeGreaterThanOrEqual(0);
        expect(cosineSimilarityValue).toBeLessThan(1);
        expect(Number(cosineSimilarityValue.toFixed(3))).toBe(0.074);
    });
});
