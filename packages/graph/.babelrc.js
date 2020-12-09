module.exports = api => {
  api.cache(() => process.env.NODE_ENV);
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          loose: true,
          modules: false,
        },
      ],
      {
        "plugins": [
          "@babel/plugin-proposal-class-properties"
        ]
      }
    ]
  };
};