function withSearch(nextConfig = {}) {
  let cache = new Map();

  return Object.assign({}, nextConfig, {
    webpack: (config, options) => {
      config.module.rules.push({});

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    }
  });
}

module.exports = withSearch;
