import WebWorker from './worker';
interface Event {
  type: string;
  data: {
    type: string;
    data: any;
  };
}

const Worker = (
  workerScriptURL: string = 'https://unpkg.com/@antv/algorithm@latest/dist/algorithm.min.js',
  messageId = '',
): Worker => {
  const context = `self.MessageID = "${messageId}";`;
  const workerCode = () => {
    const ctx: any = self;
    const MessageID = ctx.MessageID;

    const MESSAGE = {
      SUCCESS: `SUCCESS${MessageID}`,
      FAILURE: `FAILURE${MessageID}`,
    };

    ctx.onmessage = (event: Event) => {
      const { type, data } = event.data;
      if (typeof ctx.Algorithm[type] === 'function') {
        const result = ctx.Algorithm[type](data);
        ctx.postMessage({ type: MESSAGE.SUCCESS, data: result });
        return;
      }

      ctx.postMessage({ type: MESSAGE.FAILURE });
    };
  };

  return WebWorker(workerCode, workerScriptURL, context);
};

export default Worker;
