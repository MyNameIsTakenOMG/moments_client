const { createProxyMiddleware} =require('http-proxy-middleware')

module.exports = function(app){
    app.use(['/api/user','/api/comments','/api/posts'],createProxyMiddleware({
        target:'http://[::1]:8000',
        changeOrigin:true,
    }))
}