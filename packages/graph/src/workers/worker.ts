export default (worker: any, workerScirptURL: string, context: string) => {
  const code = worker.toString();

  const blob = new Blob([`importScripts('${workerScirptURL}');${context}(${code})()`], {
    type: 'text/javascript',
  });

  return new Worker(URL.createObjectURL(blob));
};
