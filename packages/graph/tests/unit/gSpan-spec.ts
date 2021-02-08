import gSpan from "../../src/gSpan/gSpan";

const data1 = {
  nodes: [
    {
      id: "0",
      cluster: "B",
    },
    {
      id: "1",
      cluster: "B",
    },
    {
      id: "2",
      cluster: "B",
    },
    {
      id: "3",
      cluster: "C",
    },
    {
      id: "4",
      cluster: "B",
    },
    {
      id: "5",
      cluster: "D",
    },
    {
      id: "6",
      cluster: "B",
    },
    {
      id: "7",
      cluster: "C",
    },
    {
      id: "8",
      cluster: "C",
    },
    {
      id: "9",
      cluster: "C",
    },
    {
      id: "10",
      cluster: "B",
    },
    {
      id: "11",
      cluster: "B",
    },
    {
      id: "12",
      cluster: "B",
    },
    {
      id: "13",
      cluster: "B",
    },
    {
      id: "14",
      cluster: "B",
    },
    {
      id: "15",
      cluster: "B",
    },
    {
      id: "16",
      cluster: "B",
    },
    {
      id: "17",
      cluster: "B",
    },
    {
      id: "18",
      cluster: "B",
    },
  ],
  edges: [
    {
      source: "0",
      target: "1",
      cluster: "b",
    },
    {
      source: "0",
      target: "2",
      cluster: "b",
    },
    {
      source: "2",
      target: "3",
      cluster: "c",
    },
    {
      source: "2",
      target: "4",
      cluster: "b",
    },
    {
      source: "3",
      target: "5",
      cluster: "b",
    },
    {
      source: "4",
      target: "6",
      cluster: "b",
    },
    {
      source: "5",
      target: "7",
      cluster: "b",
    },
    {
      source: "5",
      target: "8",
      cluster: "b",
    },
    {
      source: "5",
      target: "9",
      cluster: "b",
    },
    {
      source: "6",
      target: "10",
      cluster: "b",
    },
    {
      source: "6",
      target: "9",
      cluster: "c",
    },
    {
      source: "7",
      target: "11",
      cluster: "c",
    },
    {
      source: "8",
      target: "12",
      cluster: "c",
    },
    {
      source: "10",
      target: "13",
      cluster: "b",
    },
    {
      source: "11",
      target: "14",
      cluster: "b",
    },
    {
      source: "11",
      target: "15",
      cluster: "b",
    },
    {
      source: "12",
      target: "16",
      cluster: "b",
    },
    {
      source: "12",
      target: "15",
      cluster: "b",
    },
    {
      source: "14",
      target: "17",
      cluster: "b",
    },
    {
      source: "16",
      target: "18",
      cluster: "b",
    },
  ],
};
const data2 = {
  nodes: [
    {
      id: "0",
      cluster: "B",
    },
    {
      id: "1",
      cluster: "B",
    },
    {
      id: "2",
      cluster: "F",
    },
    {
      id: "3",
      cluster: "F",
    },
    {
      id: "4",
      cluster: "C",
    },
    {
      id: "5",
      cluster: "C",
    },
    {
      id: "6",
      cluster: "C",
    },
    {
      id: "7",
      cluster: "C",
    },
    {
      id: "8",
      cluster: "C",
    },
    {
      id: "9",
      cluster: "C",
    },
  ],
  edges: [
    {
      source: "0",
      target: "1",
      cluster: "b",
    },
    {
      source: "0",
      target: "2",
      cluster: "b",
    },
    {
      source: "1",
      target: "3",
      cluster: "b",
    },
    {
      source: "2",
      target: "4",
      cluster: "c",
    },
    {
      source: "2",
      target: "5",
      cluster: "c",
    },
    {
      source: "2",
      target: "6",
      cluster: "b",
    },
    {
      source: "3",
      target: "7",
      cluster: "c",
    },
    {
      source: "3",
      target: "8",
      cluster: "c",
    },
    {
      source: "3",
      target: "9",
      cluster: "b",
    },
  ],
};
const data3 = {
  nodes: [
    {
      id: "0",
      cluster: "F",
    },
    {
      id: "1",
      cluster: "F",
    },
    {
      id: "2",
      cluster: "B",
    },
    {
      id: "3",
      cluster: "B",
    },
    {
      id: "4",
      cluster: "B",
    },
    {
      id: "5",
      cluster: "B",
    },
    {
      id: "6",
      cluster: "B",
    },
    {
      id: "7",
      cluster: "B",
    },
    {
      id: "8",
      cluster: "B",
    },
    {
      id: "9",
      cluster: "B",
    },
    {
      id: "10",
      cluster: "B",
    },
    {
      id: "11",
      cluster: "B",
    },
    {
      id: "12",
      cluster: "B",
    },
    {
      id: "13",
      cluster: "B",
    },
    {
      id: "14",
      cluster: "C",
    },
    {
      id: "15",
      cluster: "C",
    },
    {
      id: "16",
      cluster: "B",
    },
    {
      id: "17",
      cluster: "C",
    },
    {
      id: "18",
      cluster: "C",
    },
    {
      id: "19",
      cluster: "B",
    },
  ],
  edges: [
    {
      source: "0",
      target: "1",
      cluster: "b",
    },
    {
      source: "0",
      target: "2",
      cluster: "b",
    },
    {
      source: "1",
      target: "3",
      cluster: "b",
    },
    {
      source: "2",
      target: "4",
      cluster: "e",
    },
    {
      source: "2",
      target: "5",
      cluster: "e",
    },
    {
      source: "3",
      target: "6",
      cluster: "e",
    },
    {
      source: "3",
      target: "7",
      cluster: "e",
    },
    {
      source: "4",
      target: "2",
      cluster: "b",
    },
    {
      source: "4",
      target: "9",
      cluster: "e",
    },
    {
      source: "5",
      target: "10",
      cluster: "e",
    },
    {
      source: "6",
      target: "11",
      cluster: "b",
    },
    {
      source: "6",
      target: "12",
      cluster: "e",
    },
    {
      source: "7",
      target: "13",
      cluster: "e",
    },
    {
      source: "8",
      target: "14",
      cluster: "c",
    },
    {
      source: "8",
      target: "15",
      cluster: "b",
    },
    {
      source: "9",
      target: "16",
      cluster: "e",
    },
    {
      source: "10",
      target: "16",
      cluster: "e",
    },
    {
      source: "11",
      target: "17",
      cluster: "c",
    },
    {
      source: "11",
      target: "18",
      cluster: "b",
    },
    {
      source: "12",
      target: "19",
      cluster: "e",
    },
    {
      source: "13",
      target: "19",
      cluster: "e",
    },
  ],
};

describe("gSpan", () => {
  it("gSpan first test", () => {
    const graphDataMap = {
      "a-name": data1,
      "b-name": data2,
      "c-name": data3,
    };
    const result = gSpan({
      graphs: graphDataMap,
      minSupport: 3,
      minNodeNum: 2,
      maxNodeNum: 4,
    });
    console.log(result);
  });
});
