var dbserver = require("../dao/dbserver")

//获取好列表
exports.getFriend=function (req,res) {
    let data = req.body
    dbserver.getUser(data,res)
}

//聊天列表
exports.getchatlist=function (req,res) {
    let data = req.body
    dbserver.getIndex(data,res)
}

//获取一对一消息
exports.getLastMsg = function (req,res) {
    let data = req.body
    dbserver.getOneMsg(data,res)
}
//获取消息未读数
exports.unreadMsg = function (req,res) {
    let data = req.body
    dbserver.unreadMsg(data,res)
}
//已读未读修改
exports.updateMsg = function (req,res) {
    let data = req.body
    dbserver.updateMsg(data,res)
}


//获取群列表
exports.getGroup=function (req,res) {
    let uid = req.body.uid
    dbserver.getGroup(uid,res)
}

//获取群一对一消息
exports.getOneGroupMsg = function (req,res) {
    let gid = res.body.gid
    dbserver.getOneGroupMsg(gid,res)
}
//群已读未读修改
exports.updateGroupMsg = function (req,res) {
    let data = req.body
    dbserver.updateGroupMsg(data,res)
}
