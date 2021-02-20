import { getAlgorithm } from './utils';

const data = {
  nodes: [
    {
      id: 'A',
    },
    {
      id: 'B',
    },
    {
      id: 'C',
    },
    {
      id: 'D',
    },
    {
      id: 'E',
    },
    {
      id: 'F',
    },
    {
      id: 'G',
    },
    {
      id: 'H',
    },
  ],
  edges: [
    {
      source: 'A',
      target: 'B',
    },
    {
      source: 'B',
      target: 'C',
    },
    {
      source: 'A',
      target: 'C',
    },
    {
      source: 'D',
      target: 'A',
    },
    {
      source: 'D',
      target: 'E',
    },
    {
      source: 'E',
      target: 'F',
    },
    {
      source: 'F',
      target: 'D',
    },
    {
      source: 'G',
      target: 'H',
    },
    {
      source: 'H',
      target: 'G',
    },
  ],
};

describe('(Async) find connected components', () => {
  it('detect strongly connected components in undirected graph', async done => {
    const { connectedComponentAsync } = await getAlgorithm();
    let result = await connectedComponentAsync(data, false);
    expect(result.length).toEqual(2);
    expect(result[0].map(node => node.id).sort()).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
    expect(result[1].map(node => node.id).sort()).toEqual(['G', 'H']);
    done();
  });

  it('detect strongly connected components in directed graph', async done => {
    const { connectedComponentAsync } = await getAlgorithm();
    let result = await connectedComponentAsync(data, true);
    expect(result.length).toEqual(5);
    expect(result[3].map(node => node.id).sort()).toEqual(['D', 'E', 'F']);
    expect(result[4].map(node => node.id).sort()).toEqual(['G', 'H']);
    done();
  });

  it('test connected components detection performance using large graph', async done => {
    fetch('https://gw.alipayobjects.com/os/basement_prod/da5a1b47-37d6-44d7-8d10-f3e046dabf82.json')
      .then(res => res.json())
      .then(async data => {
        const { connectedComponentAsync } = await getAlgorithm();

        data.nodes.forEach(node => {
          node.label = node.olabel;
          node.degree = 0;
          data.edges.forEach(edge => {
            if (edge.source === node.id || edge.target === node.id) {
              node.degree++;
            }
          });
        });

        let directedComps = await connectedComponentAsync(data, true);
        let undirectedComps = await connectedComponentAsync(data, false);
        expect(directedComps.length).toEqual(1589);
        expect(undirectedComps.length).toEqual(396);
        done();
      });
  });
});
