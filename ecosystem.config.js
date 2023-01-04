module.exports = {
  apps: [
    {
      name: 'valun',
      script: './dist/main.js',
      instances: 1,
      exec_mode: 'cluster',
      watch: ['src'],
      ignore_watch: ['node_modules', 'uploads'],
    },
  ],
};
