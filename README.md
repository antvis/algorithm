### AntV Algorithm

It is an algorithm package of AntV, mainly includes graph related algorithms:
- **Community Detection**
  - k-core: K-Core community detection algorithm -- Find the closely related subgraph structure that conforms to the specified core degree K
  - louvain: LOUVAIN algorithm -- Divide communities according to Modularity
  - i-louvain: I-LOUVAIN algorithm -- Divide communities according to Modularity and Inertial Modularity (properties similarity)
  - labelPropagation: Label Propagation(LP) clustering algorithm
  - minimumSpanningTree: Generate the minimum spanning tree for a graph

- **nodes clustering**
  - k-means: K-Means algorithm - Cluster nodes into K clusters according to the distance between node

- **Similarity**
  - cosineSimilarity: Cosine Similarity algorithm -- Calculate cosine similarity
  - nodesCosineSimilarity: Nodes Cosine Similarity algorithm -- Calculate the cosine similarity between other nodes and seed node

- **Centrality**
  - pageRank: page rank algorithm for nodes ranking
  - degree: calculate the in degree, out degree, and total degree for nodes

- **Path**
  - dijkstra: Dijkstra shortest path algorithm
  - findPath: Find the shortest paths and all paths for two nodes by Dijkstra
  - floydWarshall: Floyd Warshall shortest path algorithm

- **Other**
  - neighbors: Find the neighbors for a node in the graph
  - GADDI: graph structural and semantic pattern matching algorithm
  - detectCycle: Detect the cycles of the graph data
  - dfs: Depth-First search algorithm
  - adjacentMatrix: calculate the adjacency matrix for graph data
  - connectedComponent: Calculate the connected components for graph data

All the algorithms above supports to be calculated with web-worker.