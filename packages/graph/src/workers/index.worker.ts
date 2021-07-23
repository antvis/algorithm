import * as algorithm from './algorithm';
import { MESSAGE } from './constant';

const ctx: Worker = (typeof self !== 'undefined') ? self : {} as any;

interface Event {
  type: string;
  data: any;
}

ctx.onmessage = (event: Event) => {
  const { _algorithmType, data } = event.data;
  // 如果发送内容没有私有类型。说明不是自己发的。不管
  // fix: https://github.com/antvis/algorithm/issues/25
  if(!_algorithmType){
    return;
  }
  if (typeof algorithm[_algorithmType] === 'function') {
    const result = algorithm[_algorithmType](...data);
    ctx.postMessage({ _algorithmType: MESSAGE.SUCCESS, data: result });
    return;
  }
  ctx.postMessage({ _algorithmType: MESSAGE.FAILURE });
};

// https://stackoverflow.com/questions/50210416/webpack-worker-loader-fails-to-compile-typescript-worker
export default null as any;
