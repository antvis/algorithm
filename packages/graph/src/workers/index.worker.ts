import WebWorker from './worker';

interface Event {
  type: string;
  data: {
    _algorithmType: string;
    data: any;
  };
}

const Worker = (
  workerScriptURL: string = 'https://unpkg.com/@antv/algorithm@latest/dist/index.min.js',
) => {
  const workerCode = () => {
    const MESSAGE = {
      SUCCESS: 'SUCCESS',
      FAILURE: 'FAILURE',
    };

    const ctx: Worker = self as any;
    ctx.onmessage = (event: Event) => {
      const { _algorithmType, data } = event.data;
      if (typeof Algorithm[_algorithmType] === 'function') {
        const result = Algorithm[_algorithmType](...data);
        ctx.postMessage({ _algorithmType: MESSAGE.SUCCESS, data: result });
        return;
      }

      ctx.postMessage({ _algorithmType: MESSAGE.FAILURE });
    };
  };

  return new WebWorker(workerCode, workerScriptURL);
};

export default Worker;
