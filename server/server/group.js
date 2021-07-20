var dbserver = require("../dao/dbserver")

exports.buildgroup = function (req,res) {
    let data = req.body;
    dbserver.buildGroup(data,res)
}
exports.groupDetail = function (req,res) {
    let id = req.body.id;
    dbserver.groupDetail(id,res)
}
exports.applyToGroup = function (req,res) {
    let data = req.body
    dbserver.applyToGroup(data,res)
}
//获取群成员
exports.getgroupUser = function (req,res) {
    let data = req.body
    dbserver.getgroupUser(data,res)
}
//获取最后一条消息
exports.getLastGroupMsg = function(req,res){
    let data = req.body
    dbserver.getlastgroupMsg(data,res)
}
//群主审批
exports.headerapply = function (req,res) {
    let data = req.body
    dbserver.headerapply(data,res)
}
//群已读未读修改
exports.updateGroupUnread = function (req,res) {
    let data = req.body
    dbserver.updateGroupUnread(data,res)
}
//解散群
exports.deleteGroup = function (req,res) {
    let data = req.body
    dbserver.deleteGroup(data,res)
}
//退出群
exports.outGroup = function (req,res) {
    let data = req.body
    dbserver.deleteGroupUser(data,res)
}
//群信息修改
exports.GroupUpdate = function (req,res) {
    let data = req.body
    dbserver.GroupUpdate(data,res)
}