import { isEqual, uniq } from '@antv/util';
import { Edge } from '@antv/graphlib';
import { getAllProperties, oneHot, getDistance } from './utils';
import { Vector } from "./vector";
import { ClusterData, DistanceType, Graph, EdgeData, Cluster, NodeID } from './types';

/**
 * Calculates the centroid based on the distance type and the given index.
 * @param distanceType The distance type to use for centroid calculation.
 * @param allPropertiesWeight The weight matrix of all properties.
 * @param index The index of the centroid.
 * @returns The centroid.
 */
const getCentroid = (distanceType: DistanceType, allPropertiesWeight: number[][], index: number) => {
    let centroid: number[] = [];
    switch (distanceType) {
        case DistanceType.EuclideanDistance:
            centroid = allPropertiesWeight[index];
            break;
        default:
            centroid = [];
            break;
    }
    return centroid;
};

/**
 * Performs the k-means clustering algorithm on a graph.
 * @param graph The graph to perform clustering on.
 * @param k The number of clusters.
 * @param involvedKeys The keys of properties to be considered for clustering. Default is an empty array.
 * @param uninvolvedKeys The keys of properties to be ignored for clustering. Default is ['id'].
 * @param distanceType The distance type to use for clustering. Default is DistanceType.EuclideanDistance.
 * @returns The cluster data containing the clusters and cluster edges.
 */
export const kMeans = (
    graph: Graph,
    k: number = 3,
    involvedKeys: string[] = [],
    uninvolvedKeys: string[] = [],
    distanceType: DistanceType = DistanceType.EuclideanDistance,
): ClusterData => {
    const nodes = graph.getAllNodes();
    const edges = graph.getAllEdges();
    const nodeToOriginIdx = new Map<NodeID, number>();
    const nodeToCluster = new Map<NodeID, string>();
    const defaultClusterInfo: ClusterData = {
        clusters: [
            {
                id: "0",
                nodes,
            }
        ],
        clusterEdges: [],
        nodeToCluster,
    };

    // When the distance type is Euclidean distance and there are no attributes in data, return directly
    if (distanceType === DistanceType.EuclideanDistance && !nodes.every((node) => node.data)) {
        return defaultClusterInfo;
    }
    let properties = [];
    let allPropertiesWeight: number[][] = [];
    if (distanceType === DistanceType.EuclideanDistance) {
        properties = getAllProperties(nodes);
        allPropertiesWeight = oneHot(properties, involvedKeys, uninvolvedKeys) as number[][];
    }
    if (!allPropertiesWeight.length) {
        return defaultClusterInfo;
    }
    const allPropertiesWeightUniq = uniq(allPropertiesWeight.map((item) => item.join('')));
    // When the number of nodes or the length of the attribute set is less than k, k will be adjusted to the smallest of them
    const finalK = Math.min(k, nodes.length, allPropertiesWeightUniq.length);
    for (let i = 0; i < nodes.length; i++) {
        nodeToOriginIdx.set(nodes[i].id, i);
    }
    const centroids: number[][] = [];
    const centroidIndexList: number[] = [];
    const clusters: Cluster[] = [];
    for (let i = 0; i < finalK; i++) {
        if (i === 0) {
            // random choose centroid
            const randomIndex = Math.floor(Math.random() * nodes.length);
            switch (distanceType) {
                case DistanceType.EuclideanDistance:
                    centroids[i] = allPropertiesWeight[randomIndex];
                    break;
                default:
                    centroids[i] = [];
                    break;
            }
            centroidIndexList.push(randomIndex);
            nodeToCluster.set(nodes[randomIndex].id, `${i}`);
            clusters[i] = {
                id: `${i}`,
                nodes: [nodes[randomIndex]]
            };
        } else {
            let maxDistance = -Infinity;
            let maxDistanceNodeIndex = 0;
            // Select the point with the farthest average distance from the existing centroid as the new centroid
            for (let m = 0; m < nodes.length; m++) {
                if (!centroidIndexList.includes(m)) {
                    let totalDistance = 0;
                    for (let j = 0; j < centroids.length; j++) {
                        // Find the distance from the node to the centroid (Euclidean distance of the default node attribute)
                        let distance = 0;
                        switch (distanceType) {
                            case DistanceType.EuclideanDistance:
                                distance = getDistance(allPropertiesWeight[nodeToOriginIdx.get(nodes[m].id)], centroids[j], distanceType);
                                break;
                            default:
                                break;
                        }
                        totalDistance += distance;
                    }
                    // The average distance from the node to each centroid (default Euclidean distance)
                    const avgDistance = totalDistance / centroids.length;
                    // Record the distance and node index to the farthest centroid
                    if (avgDistance > maxDistance &&
                        !centroids.find((centroid) => isEqual(centroid, getCentroid(distanceType, allPropertiesWeight, nodeToOriginIdx.get(nodes[m].id))))) {
                        maxDistance = avgDistance;
                        maxDistanceNodeIndex = m;
                    }
                }
            }
            centroids[i] = getCentroid(distanceType, allPropertiesWeight, maxDistanceNodeIndex);
            centroidIndexList.push(maxDistanceNodeIndex);
            clusters[i] = {
                id: `${i}`,
                nodes: [nodes[maxDistanceNodeIndex]]
            };
            nodeToCluster.set(nodes[maxDistanceNodeIndex].id, `${i}`);
        }
    }


    let iterations = 0;
    while (true) {
        for (let i = 0; i < nodes.length; i++) {
            let minDistanceIndex = 0;
            let minDistance = Infinity;
            if (!(iterations === 0 && centroidIndexList.includes(i))) {
                for (let j = 0; j < centroids.length; j++) {
                    let distance = 0;
                    switch (distanceType) {
                        case DistanceType.EuclideanDistance:
                            distance = getDistance(allPropertiesWeight[i], centroids[j], distanceType);
                            break;
                        default:
                            break;
                    }
                    if (distance < minDistance) {
                        minDistance = distance;
                        minDistanceIndex = j;
                    }
                }
                // delete node 
                const cId = nodeToCluster.get(nodes[i].id);
                if (cId !== undefined) {
                    for (let n = clusters[Number(cId)].nodes.length - 1; n >= 0; n--) {
                        if (clusters[Number(cId)].nodes[n].id === nodes[i].id) {
                            clusters[Number(cId)].nodes.splice(n, 1);
                        }
                    }
                }
                // Divide the node into the class corresponding to the centroid (cluster center) with the smallest distance.
                nodeToCluster.set(nodes[i].id, `${minDistanceIndex}`);
                clusters[minDistanceIndex].nodes.push(nodes[i]);
            }
        }
        // Determine if there is a centroid (cluster center) movement
        let centroidsEqualAvg = false;
        for (let i = 0; i < clusters.length; i++) {
            const clusterNodes = clusters[i].nodes;
            let totalVector = new Vector([]);
            for (let j = 0; j < clusterNodes.length; j++) {
                totalVector = totalVector.add(new Vector(allPropertiesWeight[nodeToOriginIdx.get(clusterNodes[j].id)]));
            }
            // Calculates the mean vector for each category
            const avgVector = totalVector.avg(clusterNodes.length);
            // If the mean vector is not equal to the centroid vector
            if (!avgVector.equal(new Vector(centroids[i]))) {
                centroidsEqualAvg = true;
                // Move/update the centroid (cluster center) of each category to this mean vector
                centroids[i] = avgVector.getArr();
            }
        }
        iterations++;
        // Stop if each node belongs to a category and there is no centroid (cluster center) movement or the number of iterations exceeds 1000
        if (nodes.every((node) => !nodeToCluster.get(node.id)) && centroidsEqualAvg || iterations >= 1000) {
            break;
        }
    }

    // get the cluster edges
    const clusterEdges: Edge<EdgeData>[] = [];
    const clusterEdgeMap: {
        [key: string]: Edge<EdgeData>
    } = {};
    let edgeIndex = 0;
    edges.forEach((edge) => {
        const { source, target } = edge;
        const sourceClusterId = nodeToCluster.get(source);
        const targetClusterId = nodeToCluster.get(target);
        const newEdgeId = `${sourceClusterId}---${targetClusterId}`;
        if (clusterEdgeMap[newEdgeId]) {
            (clusterEdgeMap[newEdgeId].data.count as number)++;
        } else {
            const newEdge = {
                id: edgeIndex++,
                source: sourceClusterId,
                target: targetClusterId,
                data: { count: 1 },
            };
            clusterEdgeMap[newEdgeId] = newEdge;
            clusterEdges.push(newEdge);
        }
    });

    return { clusters, clusterEdges, nodeToCluster };
};

