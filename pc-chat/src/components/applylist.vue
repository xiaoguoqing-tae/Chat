<template>
  <div class="applylist">
    <div class="head">
      <div class="name">新的朋友</div>
      <img src="../assets/more.png" alt="" />
    </div>
    <div class="friendlist">
      <div class="box">
        <div class="apply-item" v-for="(item, index) in applylist" :key="index">
          <img :src="item.imgurl" alt="" />
          <div class="item-info">
            <div>{{ item.name }}</div>
            <div>{{ item.msg }}</div>
          </div>
          <div class="btn btn2" @click="detailmsg(item.id, 1)">接受</div>
          <div class="btn btn1" @click="detailmsg(item.id, 0)">拒绝</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import api from "../api/api";
export default {
  props: {},
  components: {},
  data() {
    return {
      applylist: [],
    };
  },
  computed: {
    ...mapGetters(["GET_UID", "GET_TOKEN"]),
  },
  created() {},
  mounted() {
    this.getapplylist();
  },
  methods: {
    getapplylist() {
      const data = {
        uid: this.GET_UID,
        state: 1,
        token: this.GET_TOKEN,
      };
      api.getapply(data).then((res) => {
        if (res.status == 200) {
          let list = res.result;
          this.applylist = list;
          if (list.length > 0) {
            list.forEach((item, index) => {
              item.imgurl = this.url + item.imgurl;
              this.getlastmsg(list, index);
            });
          }
          console.log(this.applylist);
        }
      });
    },
    getlastmsg(arr, i) {
      const data = {
        fid: arr[i].id,
        uid: this.GET_UID,
        token: this.GET_TOKEN,
      };
      api.getmsg(data).then((res) => {
        if (res.status == 200) {
          let e = res.result.message;
          arr[i].msg = e;
          arr.splice(i, 1, arr[i]);
        }
      });
    },
    //处理消息
    detailmsg(id, n) {
      const data = {
        uid: this.GET_UID,
        fid: id,
        token: this.GET_TOKEN,
      };
      if (n == 0) {
        api.refuse(data).then((res) => {
          if (res.status == 200) {
            for (let i = 0; i < this.applylist.length; i++) {
              if (this.applylist[i].id == id) {
                this.applylist.splice(i, 1);
                this.$emit("update",this.applylist.length)
              }
            }
          }
        });
      } else {
        api.accept(data).then((res) => {
          if (res.status == 200) {
            for (let i = 0; i < this.applylist.length; i++) {
              if (this.applylist[i].id == id) {
                this.applylist.splice(i, 1);
                this.$emit("update",this.applylist.length)
              }
            }
          }
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.applylist {
  flex: 1;
  border-right: 1px solid #f7f3f3;
  border-left: 1px solid #f7f3f3;
  position: relative;
  .head {
    width: 100%;
    height: 60px;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f7f3f3;
    .name {
      padding-left: 50px;
      font-size: 25px;
      font-weight: bold;
    }
    img {
      width: 30px;
      padding-right: 20px;
    }
  }
  .friendlist {
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 60%;
      height: calc(100vh-60px);
      overflow-y: auto;
      .apply-item {
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #dad6d6;
        position: relative;
        img {
          width: 50px;
          height: 50px;
        }
        .item-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding-left: 15px;
          div:nth-child(2) {
            color: #cfc9c9;
            font-size: 14px;
            padding-top: 5px;
          }
        }
        .btn {
          width: 70px;
          height: 30px;
          line-height: 30px;
          position: absolute;
          cursor: pointer;
        }
        .btn2 {
          background: #3ece67;
          right: 20px;
        }
        .btn1 {
          background: #f00e21;
          right: 120px;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
