module.exports = api => {
  api.cache(() => process.env.NODE_ENV);
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          loose: true,
          modules: false,
          targets: { node: 'current' },
        },
      ],
      '@babel/preset-typescript',
      {
        plugins: ['@babel/plugin-proposal-class-properties'],
      },
    ],
  };
};
