export default (worker: any, workerScirptURL: string) => {
  const code = worker.toString();

  const blob = new Blob([`importScripts('${workerScirptURL}');(${code})()`], {
    type: 'text/javascript',
  });

  return new Worker(URL.createObjectURL(blob));
};
