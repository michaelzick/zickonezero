const path = require("path");

module.exports = {
  "stories": ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],

  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-mdx-gfm",
    "@storybook/addon-webpack5-compiler-babel",
    "@chromatic-com/storybook"
  ],

  "framework": {
    name: "@storybook/nextjs",
    options: {}
  },

  docs: {
    autodocs: true
  },

  webpackFinal: async (config) => {
    config.resolve.alias["next/image"] = path.resolve(__dirname, "nextImageMock.js");
    return config;
  },
}
