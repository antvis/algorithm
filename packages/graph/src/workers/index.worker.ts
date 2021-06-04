import WebWorker from './worker';
interface Event {
  type: string;
  data: {
    _algorithmType: string;
    data: any;
  };
}

const Worker = (
  workerScriptURL: string = 'https://unpkg.com/@antv/algorithm@latest/dist/algorithm.min.js',
): Worker => {
  const workerCode = () => {
    const MESSAGE = {
      SUCCESS: 'SUCCESS',
      FAILURE: 'FAILURE',
    };

    const ctx: any = self;

    ctx.onmessage = (event: Event) => {
      const { _algorithmType, data } = event.data;
      if (typeof ctx.Algorithm[_algorithmType] === 'function') {
        const result = ctx.Algorithm[_algorithmType](data);
        ctx.postMessage({ _algorithmType: MESSAGE.SUCCESS, data: result });
        return;
      }

      ctx.postMessage({ _algorithmType: MESSAGE.FAILURE });
    };
  };

  return WebWorker(workerCode, workerScriptURL);
};

export default Worker;
