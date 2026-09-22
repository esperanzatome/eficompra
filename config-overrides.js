

// config-overrides.js
module.exports = function override(config, env) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        zlib: require.resolve('browserify-zlib'), // Agregar el polyfill para zlib
        stream: require.resolve("stream-browserify"),
        path: require.resolve("path-browserify"),
        crypto: require.resolve("crypto-browserify"),
        http: require.resolve("stream-http"),
        fs: require.resolve("browserify-fs")
    };
    return config;
};
