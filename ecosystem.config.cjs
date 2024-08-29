module.exports = {
  apps: [
    {
      name: 'dream-captcher',
      script: 'dist/server.js',
      instances: 'max', // Usa todos los núcleos disponibles
      exec_mode: 'cluster', // Modo de ejecución en clúster para balanceo de carga
      watch: false, // No observar cambios en archivos
      max_memory_restart: '12G', // Reiniciar si el uso de memoria excede 1GB
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};