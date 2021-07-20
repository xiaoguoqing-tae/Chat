var bodyParser = require('body-parser')
var jwt = require("./dao/jwt")
const express = require('express')
const app = express()
const exStatic = require("express-static");
const port = 3000
//socketio
var server = app.listen(3001)
var io = require("socket.io").listen(server)
require("./dao/socket")(io)
//跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.sendStatus(200);/*让options请求快速返回*/
    else  next();
});
//防止数据过大
app.use(bodyParser.urlencoded({limit:"50mb",extended:true}))
app.use(bodyParser.json({limit:"50mb"}))
//获取静态路径
app.use(express.static(__dirname+'/data'))
//token验证
app.use(function (req,res,next) {
    if(typeof(req.body.token)!=='undefined'){
        let token = req.body.token;
        let tokenMatch = jwt.verifyToken(token);
        if(tokenMatch==1){
            next()
        }else {
            res.send({status:300})
        }
    }else {
        next()
    }
})

require("./router/index")(app);
require("./router/files")(app);

app.use(function (req,res,next) {
    let err = new Error("not found")
    err.status = 404;
    next(err)
})
app.use(function (err,req,res,next) {
    res.status(err.status || 500)
    res.send(err.message)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
