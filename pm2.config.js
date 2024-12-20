module.exports = {
  apps: [
    {
      name: "my-app",
      script: "./dist/src/main.js",
      instances: "1",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 8002,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8002,
      },
    },
  ],
};
