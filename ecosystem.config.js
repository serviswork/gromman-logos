module.exports = {
  apps: [{
    name: "gromman-smtp",
    script: "server.js",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    },
    // Дополнительные настройки для стабильности
    instances: 1,
    exec_mode: "fork",
    watch: false,
    max_memory_restart: "200M",
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    log_file: "./logs/combined.log",
    time: true,
    // Автоматический перезапуск при сбоях
    autorestart: true,
    max_restarts: 10,
    min_uptime: "10s",
    // Переменные окружения из .env
    env_file: ".env"
  }]
} 