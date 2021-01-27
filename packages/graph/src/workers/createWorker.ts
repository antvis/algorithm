import Worker from './index.worker';
import { MESSAGE } from './constant';

interface Event {
  type: string;
  data: any;
}

/**
 * 创建一个在worker中运行的算法
 * @param type 算法类型
 */
const createWorker = <R>(type: string) => (...data) =>
  new Promise<R>((resolve, reject) => {
    const worker = new Worker();

    worker.postMessage({
      type,
      data,
    });

    worker.onmessage = (event: Event) => {
      const { data, type } = event.data;
      if (MESSAGE.SUCCESS === type) {
        resolve(data);
      } else {
        reject();
      }

      worker.terminate();
    };
  });

export default createWorker;
