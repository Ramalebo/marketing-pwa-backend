const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: 'Multi-Channel Marketing',
    themeColor: '#00C851',
    msTileColor: '#00C851',
    appleMobileWebAppCapable: 'yes',
    mobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    iconPaths: {
      favicon32: 'logo.png',
      favicon16: 'logo.png',
      appleTouchIcon: 'logo.png',
      maskIcon: 'logo.png',
      msTileImage: 'logo.png'
    },
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\./,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 5 * 60
            }
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 30 * 24 * 60 * 60
            }
          }
        }
      ]
    }
  },
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://marketing-pwa-backend.onrender.com',
        changeOrigin: true,
        secure: true,
        logLevel: 'debug'
      },
      '/uploads': {
        target: 'https://marketing-pwa-backend.onrender.com',
        changeOrigin: true,
        secure: true
      }
    }
  }
});

