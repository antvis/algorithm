import algorithm from '../../src/';

type IAlgorithm = typeof algorithm;
declare const window: Window & {
  Algorithm: IAlgorithm;
};

export const getAlgorithm = () =>
  new Promise<IAlgorithm>(resolve => {
    if (window.Algorithm) {
      resolve(window.Algorithm);
    }
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `${process.cwd()}/dist/index.min.js`;
    script.onload = function() {
      resolve(window.Algorithm);
    };
    document.body.append(script);
  });