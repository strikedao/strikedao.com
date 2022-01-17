// @format

module.exports = {
  apps: [
    {
      name: "backend",
      script: "./src/listen.mjs",
      env: {
        NODE_ENV: "production"
      },
      time: true
    },
    {
      name: "renderer",
      script: "./src/renderer.mjs",
      env: {
        NODE_ENV: "production"
      },
      time: true
    }
  ]
};
