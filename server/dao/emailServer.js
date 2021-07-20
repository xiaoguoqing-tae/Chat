var nodemailer = require('nodemailer')
var email = require('../config/email')

let transporter = nodemailer.createTransport({
    service:"qq",
    auth: {
        user: email.qq.user, // generated ethereal user
        pass: email.qq.pass, // generated ethereal password
    },
});
exports.emailSignUp = function (email,res) {
    let option = {
        from:"1072135321@qq.com",
        to:email,
        subject:"感谢您的注册",
        html:"<span>欢迎您的加入TY家族</span><a href='localhost:8080/'>点击进入</a>"
    };
    transporter.sendMail(option,function (err,msg) {
        if(err){
            // res.send(err)
            console.log(err)
        }else {
            res.send("发送成功")
            console.log("发送成功")
        }
    })

}