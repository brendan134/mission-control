module.exports = {
  apps: [
    {
      name: "mission-control",
      cwd: "/data/.openclaw/workspace/mission-control",
      script: "npm",
      args: "run dev",
      env: {
        PORT: 3003,
        NODE_ENV: "development"
      },
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: "500M",
      restart_delay: 5000
    },
    {
      name: "cloudflared",
      cwd: "/data/.openclaw/workspace",
      script: "./cloudflared",
      args: "tunnel run --token eyJhIjoiZWFkZmE0MTc0Y2VjYzAyYjJiOGQwN2Y5YTdkYmFlMzkiLCJ0IjoiNGE2YjI4NWUtODgyZC00NDRmLWJiZTYtOGY1M2RmZmY1NzliIiwicyI6IlpXSTFOemxtTVRNdE1tSmtOeTAwTlRJeExUbG1Nell0TXpVM1pURTNaakpqWWpkaSJ9",
      instances: 1,
      autorestart: true,
      watch: false,
      restart_delay: 10000
    }
  ]
};
