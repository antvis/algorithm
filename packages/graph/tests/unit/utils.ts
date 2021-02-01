export const getAlgorithm = () =>
  new Promise(resolve => {
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
