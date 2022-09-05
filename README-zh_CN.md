### AntV Algorithm

AntV 算法包，包括图算法及其他各类算法。

graph 包下面包括的都是图算法。

AntV 共支持以下图算法：
- **社区发现**
  - k-core: K-Core社区发现算法 -- 找到符合指定核心度K的密切相关子图结构
  - louvain: LOUVAIN 算法 -- 根据模块度划分社区
  - i-louvain: I-LOUVAIN 算法 -- 根据模块度和惯性模块度（属性相似度）划分社区
  - labelPropagation: 标签传播算法
  - minimumSpanningTree: 图的最小生成树

- **节点聚类**
  - k-means: K-Means算法 - 根据节点之间的距离将节点分为K个簇

- **相似性**
  - cosineSimilarity: 余弦相似度算法 -- 计算两个元素的余弦相似度
  - nodesCosineSimilarity: 节点余弦相似度算法 -- 计算节点与种子节点之间的余弦相似度


- **中心性**
  - pageRank: 节点排序的页面排序算法
  - degree: 计算节点的入度、出度和总度

- **路径**
  - dijkstra: Dijkstra 最短路径算法
  - findPath: 通过Dijkstra找到两个节点的最短路径和所有路径
  - floydWarshall: 弗洛伊德最短路径算法

- **其它**
  - neighbors: 在图中查找节点的邻居
  - GADDI: 图结构和语义模式匹配算法
  - detectCycle: 环路检测
  - dfs: D深度优先遍历
  - adjacentMatrix: 邻接矩阵
  - connectedComponent: 联通子图

并支持在 web-worker 中计算上述算法
