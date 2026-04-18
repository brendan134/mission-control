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
      args: "tunnel run --token eyJhIjoiZWFkZmE0MTc0Y2VjYzAyYjJiOGQwN2Y5YTdkYmFlMzkiLCJ0IjoiNzNhNTg1MjgtN2Q0My00ZjZkLWI3YjUtOWQ2ZDMxNzQwYjJlIiwicyI6Ik0yTTNOVE14TldJdE5XSXhOUzAwTnpFeUxXRmlORE10TUdFMFlqRmxObVJsTVdVNCJ9",
      instances: 1,
      autorestart: true,
      watch: false,
      restart_delay: 10000
    }
  ]
};