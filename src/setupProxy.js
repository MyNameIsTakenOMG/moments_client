const { createProxyMiddleware} =require('http-proxy-middleware')

module.exports = function(app){
    app.use(['/user','/comments','/posts'],createProxyMiddleware({
        target:'http://[::1]:8000',
        changeOrigin:true,
    }))
}