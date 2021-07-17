const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // to be used for development
      // target: 'http://localhost:3001', 
      target: 'https://excalidraw-backend.herokuapp.com', 
      changeOrigin: true,
      headers: {
        "Connection": "keep-alive"
      },
    })
  );
};