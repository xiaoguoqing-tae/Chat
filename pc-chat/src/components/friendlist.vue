<template>
  <div class="container">
    <div class="left">
      <search :width="width"></search>
      <div class="newfriend" @click="applylist">
          <div>好友申请</div>
          <div class="num" v-show="len>0">{{len}}</div>
      </div>
      <div class="fiedlist">
        <div class="f-item" v-for="(item, idex) in friendList" :key="idex">
          <div class="zm">{{ item.letter }}</div>
          <div
            v-for="(it, idx) in item.data"
            :key="idx"
            class="info"
            @click="showinfo(it)"
            :class="{ active: active == it.name }"
          >
            <img :src="url + '/' + it.imgurl" alt="" />
            <div class="name">{{ it.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <router-view :key="id" @update="update"></router-view>
  </div>
</template>

<script>
import apis from "../api/api";
import search from "../components/search.vue";
import pySort from "../utils/pySort";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      width: 250,
      friendList: [],
      active: -1,
      id: "",
      len:0
    };
  },
  components: {
    search,
  },
  created() {
    this.friendList = pySort(this.friendList, "name");
  },
  mounted() {
      this.getFriendlist()
      this.getapplylist()
  },
  computed: {
    ...mapGetters(["GET_UID", "GET_TOKEN"]),
  },
  methods: {
    getFriendlist(){
      const data = {
      uid: this.GET_UID,
      state: 0,
      token: this.token,
    };
    apis.getFriendlist(data).then((res) => {
        this.friendList = pySort(res.result, "name");
      console.log(res);
    });
    },
    showinfo(i) {
      this.active = i.name;
      this.id = i.id;
      this.$router.push({ name: "friedInfo", params: { uid: i.id } });
    },
    applylist() {
      this.$router.push({ name: "applylist" });
    },
    getapplylist() {
      const data = {
        uid: this.GET_UID,
        state: 1,
        token: this.GET_TOKEN,
      };
      apis.getapply(data).then((res) => {
          let list = res.result;
          this.len = list.length;
      });
    },
    update(e){
        this.len = e
        this.getFriendlist()
    }
  },
};
</script>

<style scoped lang="scss">
::-webkit-scrollbar-track-piece {
  //滚动条凹槽的颜色，还可以设置边框属性
  background-color: #f8f8f8;
}
::-webkit-scrollbar {
  //滚动条的宽度
  width: 9px;
  display: none;
}
::-webkit-scrollbar-thumb {
  //滚动条的设置
  background-color: #dddddd;
  background-clip: padding-box;
  border-radius: 20px;
  height: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #bbb;
}
.active {
  background: #cfcccc;
}
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  .left {
    width: 400px;
    height: 100vh;
    background: #e4e2e2;
    display: flex;
    flex-direction: column;
    .newfriend {
      width: 300px;
      height: 40px;
      line-height: 40px;
      background: #ffffff;
      text-align: center;
      margin-top: 5px;
      margin-left: 50px;
      cursor: pointer;
      position: relative;
      .num{
          position: absolute;
          background: #ee3c3c;
          height:25px;
          width: 25px;
          border-radius: 50%;
          line-height: 25px;
          right: 10px;
          top: 7px;
          color: #ffffff;
      }
    }
    .newfriend:active {
      background: #e4e2e2;
    }
    .fiedlist {
      display: flex;
      flex: 1;
      flex-direction: column;
      padding: 10px 10px 10px 5px;
      height: calc(100vh - 100px);
      overflow-y: auto;
      .f-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        border-bottom: 1px solid #cdcdcd;
        cursor: pointer;
        .zm {
          padding: 10px;
        }
        .info {
          width: 100%;
          padding: 10px;
          display: flex;
          align-items: center;
          img {
            width: 50px;
            height: 50px;
          }
          .name {
            font-size: 17px;
            font-weight: 500;
            padding-left: 20px;
          }
        }
      }
    }
  }
}
</style>
