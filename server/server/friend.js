var dbserver = require("../dao/dbserver")

exports.applyfriend = function (req,res) {
    let data = req.body;
    dbserver.applyFriend(data,res)
}
exports.updateFriendState = function (req,res) {
    let data = req.body
    dbserver.updateFriendState(data,res)
}
exports.deleteFriend = function (req,res) {
    let data = req.body
    dbserver.deleteFriend(data,res)
}
exports.updateFriendStateIndex = function (req,res) {
    let data = req.body
    dbserver.updateFriendStateIndex(data,res)
}