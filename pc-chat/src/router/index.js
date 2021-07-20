import Vue from "vue"
import VueRouter from "vue-router";
Vue.use(VueRouter)


//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

import login from "../views/login.vue"
import chat from "../views/chat.vue"
import msg from "../components/chatlist.vue"
import chatroom from "../components/chatroom.vue"
import friendlist from "../components/friendlist.vue"
import friedInfo from "../components/friendInfo.vue"
import applylist from "../components/applylist.vue"
const routes = [
    {
        path:"/",
        name:"login",
        component:login
    },
    {
        path:"/chat",
        name:"chat",
        component:chat,
        children:[
            {
                path:"/chat/msg",
                name:"msg",
                component:msg,
                children:[
                    {
                        path:"/chat/msg/chatroom",
                        name:"chatroom",
                        component:chatroom,
                    }
                ]
            },
            {
                path:"/chat/friendlist",
                name:"friendlist",
                component:friendlist,
                children:[
                    {
                        path:"/chat/friendlist/friendInfo/:uid",
                        name:"friedInfo",
                        component:friedInfo,
                    },
                    {
                        path:"/chat/friendlist/applylist",
                        name:"applylist",
                        component:applylist,
                    }
                ]
            }
        ]
    }
]
const router = new VueRouter({
    routes
})
export default router