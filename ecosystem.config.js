// @format

module.exports = {
  apps: [
    {
      name: "backend",
      script: "./src/listen.mjs",
      watch: true,
      env: {
        NODE_ENV: "production"
      },
      time: true
    }
  ]
};
