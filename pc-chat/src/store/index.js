import Vue from "vue";
import Vuex from "vuex";
import {SET_UID,GET_UID,SET_TOKEN,GET_TOKEN} from "../store/storeType"
import { loadFromSession } from "../storage/sessionStorage";
Vue.use(Vuex);

let uid = ""
let token = ""
const user = loadFromSession("user")
if(user){
  uid = user.id
  token = user.token
}

const store = new Vuex.Store({
  state: {
    uid:uid,
    token:token
  },
  getters:{
    [GET_UID](state){
        return state.uid
    },
    [GET_TOKEN](state){
        return state.token
    }
  },
  mutations:{
    [SET_UID](state,payload){
        state.uid = payload
    },
    [SET_TOKEN](state,payload){
        state.token = payload
    }
  },
  actions:{

  }
})
export default store;