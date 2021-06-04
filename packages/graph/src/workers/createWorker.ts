import { MESSAGE } from './constant';
import Worker from './index.worker';
import { uniqueId } from '../util';
interface Event {
  type: string;
  data: {
    type: string;
    data: any;
  };
}

/**
 * 创建一个在worker中运行的算法
 * @param type 算法类型
 * @param workerScirptURL
 */
const createWorker = <R>(type: string, workerScirptURL?: string) => data =>
  new Promise<R>((resolve, reject) => {
    const messageId = uniqueId();
    const worker = Worker(workerScirptURL, messageId);
    worker.postMessage({
      type: type,
      data,
    });

    worker.onmessage = (event: Event) => {
      const { data, type } = event.data;
      if (MESSAGE.SUCCESS + messageId === type) {
        resolve(data);
      } else {
        reject();
      }

      worker.terminate();
    };
  });

export default createWorker;
