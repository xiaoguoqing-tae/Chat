import fetch from "@/utils/myaxios";
// import qs from "qs";
export default {
    login(data){
        const obj = {
            url:"/singin/match",
            method:"POST",
            params:data
        }
        return fetch(obj)
    },
    register(data){
        const obj = {
            url:"/singup/add",
            method:"POST",
            params:data
        }
        return fetch(obj)
    },
    getchatlist(data){
        const obj = {
            url:"/index/chatlist",
            method:"POST",
            params:data
        }
        return fetch(obj)
    },
    getmsg(data){
        const obj = {
            url:"/index/getlastmsg",
            method:"POST",
            params:data
        }
        return fetch(obj)
    },
    getunread(data){
        const obj = {
            url:"/index/unreadmsg",
            method:"POST",
            params:data
        }
        return fetch(obj)
    },
    updatemsg(data){
        const obj = {
            url:"/index/updatemsg",
            method:"POST",
            params:data
        }
        return fetch(obj)
    },
    //聊天页的列表显示与否
    updateFriendStateIndex(data){
        const obj = {
            url:"/index/updateIndex",
            method:"POST",
            params:data
        }
        return fetch(obj)
    },
    getchatmsg(data){
        const obj = {
            url:"/chat/msg",
            method:"POST",
            params:data
        }
        return fetch(obj)
    },
    getFriendlist(data){
        const obj = {
            url:"/index/getfriend",
            method:"POST",
            params:data
        }
        return fetch(obj)
    },
    getFriendInfo(data){
        const obj = {
            url:"/user/detail",
            method:"POST",
            params:data
        }
        return fetch(obj)
    },
    search(data){
        const obj = {
            url:"/search/user",
            method:"POST",
            params:data
        }
        return fetch(obj)
    },
    isfriend(data){
        const obj = {
            url:"/search/isfriend",
            method:"POST",
            params:data
        }
        return fetch(obj)
    },
    addfriend(data){
        const obj = {
            url:"/friend/applyfriend",
            method:"POST",
            params:data
        }
        return fetch(obj)
    },
    getapply(data){
        const obj = {
            url:"/index/getfriend",
            method:"POST",
            params:data
        }
        return fetch(obj)
    },
    //接受好友
    accept(data){
        const obj = {
            url:"/friend/updatefriendstate",
            method:"POST",
            params:data
        }
        return fetch(obj)
    },
    //拒绝好友
    refuse(data){
        const obj = {
            url:"/friend/deletefriend",
            method:"POST",
            params:data
        }
        return fetch(obj)
    },
    //上传图片
    uploadimg(data){
        const obj = {
            url:"/files/upload",
            method:"POST",
            params:data
        }
        return fetch(obj)
    }
}