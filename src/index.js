const express = require('express');
const app = express();
const {serverconfig,Logger} = require("./config")
//proxysetup
const { createProxyMiddleware } = require('http-proxy-middleware');
app.use('/flightsService', createProxyMiddleware({ 
    target:serverconfig.FLIGHT_SERVER, 
    changeOrigin: true, 
    pathRewrite: {'^/flightsService' : '/'} 
}));

app.use('/bookingsService', createProxyMiddleware({ 
    target:serverconfig.BOOKING_SERVER, 
    changeOrigin: true, 
    pathRewrite: {'^/bookingsService' : '/'} 
}));


//rate limiter
const rateLimit  = require('express-rate-limit');  

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 15 minutes
	limit: 12, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
})
app.use(limiter)

const apiroutes = require("./routes")
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api",apiroutes)
app.listen(serverconfig.PORT,()=>{
    console.log(`server listening on ${serverconfig.PORT}`);
    Logger.info(`server listening on ${serverconfig.PORT}`,"root",{})

})