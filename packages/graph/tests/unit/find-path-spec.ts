import { findAllPath, findShortestPath } from "../../src";

const data = {
  nodes: [
    {
      id: "A",
      label: "A",
    },
    {
      id: "B",
      label: "B",
    },
    {
      id: "C",
      label: "C",
    },
    {
      id: "D",
      label: "D",
    },
    {
      id: "E",
      label: "E",
    },
    {
      id: "F",
      label: "F",
    },
    {
      id: "G",
      label: "G",
    },
    {
      id: "H",
      label: "H",
    },
  ],
  edges: [
    {
      source: "A",
      target: "B",
    },
    {
      source: "B",
      target: "C",
    },
    {
      source: "C",
      target: "G",
    },
    {
      source: "A",
      target: "D",
    },
    {
      source: "A",
      target: "E",
    },
    {
      source: "E",
      target: "F",
    },
    {
      source: "F",
      target: "D",
    },
    {
      source: "D",
      target: "E",
    },
  ],
};

describe("Shortest Path from source to target on graph", () => {
  it("find the shortest path", () => {
    const { length, path } = findShortestPath(data, "A", "C");
    expect(length).toBe(2);
    expect(path).toStrictEqual(["A", "B", "C"]);
  });

  it("find all shortest paths", () => {
    const { length, allPath } = findShortestPath(data, "A", "F");
    expect(length).toBe(2);
    expect(allPath[0]).toStrictEqual(["A", "E", "F"]);
    expect(allPath[1]).toStrictEqual(["A", "D", "F"]);

    const {
      length: directedLenght,
      path: directedPath,
      allPath: directedAllPath,
    } = findShortestPath(data, "A", "F", true);
    expect(directedLenght).toBe(2);
    expect(directedAllPath[0]).toStrictEqual(["A", "E", "F"]);
    expect(directedPath).toStrictEqual(["A", "E", "F"]);
  });

  it("find all paths", () => {
    const allPaths = findAllPath(data, "A", "E");
    expect(allPaths.length).toBe(3);
    expect(allPaths[0]).toStrictEqual(["A", "D", "F", "E"]);
    expect(allPaths[1]).toStrictEqual(["A", "D", "E"]);
    expect(allPaths[2]).toStrictEqual(["A", "E"]);
  });

  it("find all paths in directed graph", () => {
    const allPaths = findAllPath(data, "A", "E", true);
    expect(allPaths.length).toStrictEqual(2);
    expect(allPaths[0]).toStrictEqual(["A", "D", "E"]);
    expect(allPaths[1]).toStrictEqual(["A", "E"]);
  });

  it("find all shortest paths in weighted graph", () => {
    data.edges.forEach((edge, i) => {
      edge.weight = ((i % 2) + 1) * 2;
      if (edge.source === "F" && edge.target === "D") edge.weight = 10;
    });
    const { length, path, allPath } = findShortestPath(
      data,
      "A",
      "F",
      false,
      "weight"
    );
    expect(length).toBe(6);
    expect(allPath[0]).toStrictEqual(["A", "E", "F"]);
    expect(path).toStrictEqual(["A", "E", "F"]);
  });
});
