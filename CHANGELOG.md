# ChangeLog
#### 0.1.25

- feat: Optimized data preprocessing coding - when the feature values are all numerical, use the original values (plus normalization), and do not use one-hot coding
#### 0.1.24

- fix: i-louvain without cluster problem; 
#### 0.1.23

- perf: k-means algorithm: set K to minimum
#### 0.1.22

- fix: k-means algorithm, perf: louvain -- support specified parameters such as propertyKey,involvedKeys and uninvolvedKeys
#### 0.1.21

- perf: k-means algorithm -- Optimize parameters and return

#### 0.1.20

- feat: add k-means algorithm for nodes clustering

#### 0.1.19

- fix: GADDI matched failed problem;

#### 0.1.18

- feat: add one-hot data preprocessing;

#### 0.1.17

- feat: add consine-similarity algorithm and nodes-consine-similarity algorithm;

#### 0.1.16

- feat: add i-louvain based on louvain according to academic;

#### 0.1.15

- feat: k-core algorithm;

#### 0.1.14

- fix: GADDI with proper begin p node;
- feat: louvain with property similarity measure

#### 0.1.10

- fix: GADDI with better accuracy;

#### 0.1.9

- chore: separate sync and async functions into different entries;

#### 0.1.8

- fix: CPU usage increases due to 0.1.3-beta ~ 0.1.3 with publicPath configuration;
- fix: CPU usage increases due to 0.1.6 ~ 0.17 with browser output;
- feat: export fix: export detectAllCycles, detectAllDirectedCycle, detectAllUndirectedCycle;

#### 0.1.6

- fix: louvain with increased clusterId and node with correct new clusterId;

#### 0.1.5

- fix: worker async problem;
- chore: unify allPath and allPaths;

#### 0.1.2

- fix: failed to find result problem in dijkstra;

#### 0.1.1

- fix: shortestPath with wrong result;

#### 0.1.0

- fix: findShortestPath undefined is not interatable;

#### 0.1.0-beta.3

- fix: cannot read degree of undefined problem of GADDI;

#### 0.1.0-beta

- feat: worker for algorithms;
- feat: gaddi for graph pattern matching;

#### 0.0.7

- feat: dijkstra supports finding multiple shortest paths;
