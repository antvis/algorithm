### AntV Algorithm

AntV 算法包，包括图算法及其他各类算法。

graph 包下面包括的都是图算法。

AntV 共支持以下图算法：

- adjacentMatrix 邻接矩阵
- connectedComponent 联通子图
- degree: in degree, out degree 出度入度
- detectCycle 环检测
- dfs 深度优先遍历
- dijkstra 最短路径算法
- findPath: shortest path, all paths 寻找最短路径、所有路径
- floydWarshall 弗洛伊德最短路径算法
- labelPropagation 标签传播自动聚类
- louvain 自动聚类
- pageRank 网页排序
- neighbors 邻居
- minimumSpanningTree 最小生成树
- GADDI 模式匹配

并支持在 web-worker 中计算上述算法
