module.exports = {
  apps: [
    {
      name: "mission-control",
      cwd: "/data/.openclaw/workspace/mission-control",
      script: "npm",
      args: "start",
      env: {
        PORT: 3003,
        NODE_ENV: "production"
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      restart_delay: 5000
    },
    {
      name: "cloudflared",
      cwd: "/data/.openclaw/workspace",
      script: "./cloudflared",
      args: "tunnel run --token eyJhIjoiZWFkZmE0MTc0Y2VjYzAyYjJiOGQwN2Y5YTdkYmFlMzkiLCJ0IjoiZmJmZDJjZWQtOGI2MS00NGE3LTg0MmYtODQ0YmRiZWQ2OTFhIiwicyI6Illqa3pZVEl6TW1VdE9HSmlOQzAwTWpVNExUZ3daamt0WWpVM016bGhaR0V3TjJNMCJ9",
      instances: 1,
      autorestart: true,
      watch: false,
      restart_delay: 10000
    }
  ]
};