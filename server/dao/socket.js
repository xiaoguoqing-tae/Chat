var dbserver = require("../dao/dbserver")
module.exports = function (io) {
    var users = {}
    io.on("connection",(socket)=>{
       //用户登录
        socket.on('login',(id)=>{
            console.log(socket.id)
            socket.emit('login',socket.id);
            socket.name = id;
            users[id] = socket.id
        })
        //用户离开
        socket.on("disconnecting",()=>{
            if(users.hasOwnProperty(socket.name)){
                delete  users[socket.name];
                console.log(socket.id+'离开')
            }
        })

        //用户一对一
        socket.on('msg',(msg,fromid,toid)=>{
            dbserver.upFriendLastTime({uid:fromid,fid:toid})
            var data = {}
            data={
                uid:fromid,
                fid:toid,
                msg:msg.message,
                type:msg.types,
                second:msg.second
            }
            dbserver.insertMsg(data)
            if(users[toid]){
                socket.to(users[toid]).emit('msg',msg,fromid,0)
            }
            socket.emit('msg',msg,toid,1)
        })
        //用户群聊
        socket.on('groupmsg',(msg,fromid,toid)=>{
            console.log(msg)
            dbserver.insertGroupMsg(fromid,toid,msg.message,msg.types,msg.second)
            io.emit('groupmsg',msg,fromid,toid)
        })
    })
}