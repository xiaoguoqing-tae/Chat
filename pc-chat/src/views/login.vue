<template>
  <div class="login-container">
    <div class="input-container" :class="[animate1, animate4]">
      <div class="top-information">欢迎您，请登录</div>
      <div class="input-warpper">
        <span></span
        ><input
          class="input-content"
          placeholder="用户名"
          type="input"
          autocomplete="off"
          v-model="userName"
        />
      </div>
      <div class="input-warpper">
        <span></span
        ><input
          class="input-content"
          placeholder="密码"
          type="password"
          autocomplete="off"
          v-model="password"
        />
      </div>
      <button class="commit" @click="toLogin">登录</button>
      <div class="foot-tip">如果忘记密码，请联系管理员重置。</div>
      <div class="register" @click="register">注册账号</div>
    </div>
    <div class="register-container" :class="[animate2, animate3]">
      <div class="top-information">欢迎您，请进行账号注册</div>
      <div class="input-warpper">
        <span></span
        ><input
          class="input-content"
          placeholder="邮箱"
          type="input"
          autocomplete="off"
          v-model="zc_userName"
        />
      </div>
      <div class="input-warpper">
        <span></span
        ><input
          class="input-content"
          placeholder="密码"
          type="password"
          autocomplete="off"
          v-model="zc_password"
        />
      </div>
      <div class="input-warpper">
        <span></span
        ><input
          class="input-content"
          placeholder="用户名"
          type="input"
          autocomplete="off"
          v-model="name"
        />
      </div>
      <button class="commit" @click="toregister">注册</button>
      <div class="tologin" @click="backlogin">返回登录</div>
    </div>
  </div>
</template>

<script>
import apis from "../api/api";
import { saveToSession } from "../storage/sessionStorage";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      userName: "",
      password: "",
      zc_userName: "",
      zc_password: "",
      name: "",
      animate1: "",
      animate2: "",
      animate3: "opcity",
      animate4: "",
    };
  },
  created() {},
  mounted() {},
  methods: {
    ...mapMutations(["SET_UID", "SET_TOKEN"]),
    toLogin() {
      const data = {
        data: this.userName,
        pwd: this.password,
      };
      apis.login(data).then((res) => {
        console.log(res);
        if (res.status == 200) {
          saveToSession("user", res.back);
          this.SET_UID(res.back.id);
          this.SET_TOKEN(res.back.token);
          this.$router.push({ name: "msg" });
        }
      });
    },
    toregister() {
      const data = {
        name: this.name,
        mail: this.zc_userName,
        pwd: this.zc_password,
      };
      apis.register(data).then((res) => {
          if(res.status==200){
              this.$message("注册成功")
              setTimeout(()=>{
                  this.backlogin()
              },800)
          }
        console.log(res);
      });
    },
    register() {
      this.animate1 = "animate__animated animate__bounceOutUp";
      setTimeout(() => {
        this.animate2 = "animate__animated animate__bounceInDown";
        this.animate3 = "opcity1";
      }, 800);
    },
    backlogin() {
      this.animate2 = "animate__animated animate__bounceOutUp";
      setTimeout(() => {
        this.animate1 = "animate__animated animate__bounceInDown";
        this.animate3 = "opcity1";
      }, 800);
    },
  },
};
</script>

<style lang="scss">
.opcity {
  display: none;
}
.opcity1 {
  display: block;
}
.login-container {
  width: 100%;
  height: 100vh;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url("~@/assets/bg.jpeg");
  .input-container {
    width: 358px;
    height: 300px;
    position: absolute;
    top: 30%;
    left: 40%;
    border-radius: 6px;
    padding: 0 40px;
    box-sizing: border-box;
    background: linear-gradient(
      to bottom,
      rgba(204, 255, 255, 0.5) 0%,
      rgba(82, 152, 197, 0.5) 100%
    );
    .top-information {
      font-size: 14px;
      padding-top: 20px;
      padding-bottom: 15px;
      font-family: "Microsoft YaHei";
      font-weight: bold;
      color: rgba(255, 255, 255, 0.5);
      text-align: left;
    }
    .input-warpper {
      height: 40px;
      background-color: #fff;
      margin-bottom: 15px;
      line-height: 40px;
    }
    .commit {
      font-size: 18px;
      font-weight: 500;
      font-family: "Microsoft YaHei";
      color: #fff;
      background-color: #ea8625;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      width: 100%;
      padding: 10px;
      cursor: pointer;
      border: none;
      outline: none !important;
    }
    .commit:hover {
      background-color: #eab025;
    }
    .foot-tip {
      text-align: center;
      color: #fff;
      margin-top: 25px;
      opacity: 0.5;
      font-size: 12px;
      box-sizing: border-box;
    }
    .register {
      color: #fff;
      opacity: 0.5;
      font-size: 13px;
      padding-top: 15px;
      text-decoration: underline;
      cursor: pointer;
    }
    .register:hover {
      color: rgb(175, 22, 55);
    }
  }
  input {
    width: 100%;
    line-height: 18px;
    border: none;
    box-sizing: border-box;
    font-size: 14px;
    box-shadow: none !important;
    height: auto;
    padding: 11px 10px;
    color: #cccccc !important;
    background-color: #fff !important;
  }
  input:focus {
    outline: none;
  }
  .register-container {
    width: 358px;
    height: 350px;
    position: absolute;
    top: 30%;
    left: 40%;
    border-radius: 6px;
    padding: 0 40px;
    box-sizing: border-box;
    background: linear-gradient(
      to bottom,
      rgba(204, 255, 255, 0.5) 0%,
      rgba(82, 152, 197, 0.5) 100%
    );
    .top-information {
      font-size: 14px;
      padding-top: 20px;
      padding-bottom: 15px;
      font-family: "Microsoft YaHei";
      font-weight: bold;
      color: rgba(37, 36, 36, 0.5);
      text-align: left;
    }
    .input-warpper {
      height: 40px;
      background-color: #fff;
      margin-bottom: 15px;
      line-height: 40px;
    }
    .commit {
      font-size: 18px;
      font-weight: 500;
      font-family: "Microsoft YaHei";
      color: #fff;
      background-color: #ea8625;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      width: 100%;
      padding: 10px;
      cursor: pointer;
      border: none;
      outline: none !important;
    }
    .commit:hover {
      background-color: #eab025;
    }
    .tologin {
      color: #fff;
      opacity: 0.5;
      font-size: 16px;
      padding-top: 25px;
      text-decoration: underline;
      cursor: pointer;
    }
    .tologin:hover {
      color: rgb(175, 22, 55);
    }
  }
}
</style>