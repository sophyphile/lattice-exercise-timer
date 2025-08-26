module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [  
        // If using "@/..." imports, enable this alias:
        ['module-resolver', { alias: { '@': './' } }],
  
        // If using Reanimated, keep this:
        // 'react-native-reanimated/plugin',
      ],
    };
  };
  