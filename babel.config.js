module.exports = function (api) {
  api.cache(true);
  let plugins = [];

  plugins.push("react-native-worklets/plugin");

  plugins.push("@babel/plugin-transform-private-methods");
  plugins.push("@babel/plugin-transform-private-property-in-object");

  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"],
    plugins,
  };
};
