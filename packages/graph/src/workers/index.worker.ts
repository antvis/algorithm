import * as algorithm from './algorithm';
import { MESSAGE } from './constant';

const ctx: Worker = self as any;

interface Event {
  type: string;
  data: any;
}

ctx.onmessage = (event: Event) => {
  const { type, data } = event.data;
  if (typeof algorithm[type] === 'function') {
    const result = algorithm[type](...data);
    ctx.postMessage({ type: MESSAGE.SUCCESS, data: result });
    return;
  }

  ctx.postMessage({ type: MESSAGE.FAILURE });
};

// https://stackoverflow.com/questions/50210416/webpack-worker-loader-fails-to-compile-typescript-worker
export default null as any;
