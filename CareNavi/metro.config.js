const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

// Create empty mock for http module (not needed in React Native)
const emptyModule = path.resolve(__dirname, 'src/utils/emptyModule.js');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      stream: require.resolve('stream-browserify'),
      events: require.resolve('events'),
      url: require.resolve('react-native-url-polyfill'),
      http: emptyModule,
      https: emptyModule,
      net: emptyModule,
      tls: emptyModule,
      fs: emptyModule,
      crypto: emptyModule,
      zlib: emptyModule,
      bufferutil: emptyModule,
      'utf-8-validate': emptyModule,
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
