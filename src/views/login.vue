<template>
  <div class="login">
    <div class="login-box">
      <div class="login-left">
        <img src="@/assets/images/login_left.png" />
      </div>

      <el-form
        ref="loginRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <div class="title-container">
          <img src="@/assets/images/logo.png" class="login_logo" />
          <h3 class="title">智慧药店助手</h3>
        </div>

        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            type="text"
            size="large"
            auto-complete="off"
            placeholder="请输入账号"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            size="large"
            auto-complete="off"
            placeholder="请输入密码"
            @keyup.enter="handleLogin"
            show-password
          >
          </el-input>
        </el-form-item>
        <div class="tips">
          <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
          <router-link :to="'/register'" :underline="false" class="tips-pw">忘记密码？</router-link>
        </div>
        <el-form-item style="width: 100%">
          <el-button
            :loading="loading"
            size="large"
            type="primary"
            style="width: 100%"
            @click.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import useUserStore from "@/store/modules/user";


const userStore = useUserStore();
const router = useRouter();
const { proxy } = getCurrentInstance();

const loginForm = ref({
  username: "",
  password: "",
  rememberMe: false,
});

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
};

const loading = ref(false);
// 验证码开关
const captchaOnOff = ref(true);
// 注册开关
const register = ref(false);
const redirect = ref(undefined);

function handleLogin() {
  proxy.$refs.loginRef.validate((valid) => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在cookie中设置记住用户名
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.value.username, { expires: 30 });
        Cookies.set("password", encrypt(loginForm.value.password), {
          expires: 30,
        });
        Cookies.set("rememberMe", loginForm.value.rememberMe, { expires: 30 });
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      // 调用action的登录方法
      userStore
        .login(loginForm.value).then(() => {
          router.push({ path: redirect.value || "home" });
        }).catch(() => {
          loading.value = false;
        });
    }
  });
}

function showPwd() {}

function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  };
}

getCookie();
</script>

<style lang='scss' scoped>
.login {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;

  .login-box {
    max-width: 1200px;
    height: 640px;
    background: #fff;
    padding: 50px 80px 70px 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -webkit-box-shadow: 0 1px 15px #eee;
    box-shadow: 0 1px 15px #eee;
    border-radius: 10px;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;

    .login-left {
      width: 550px;
      height: 429px;
      margin-right: 40px;

      img {
        width: 100%;
      }
    }
    .login-form {
      position: relative;
      width: 520px;
      padding: 48px;
      max-width: 100%;
      margin: 0 auto;
      overflow: hidden;

      .el-input__inner {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: #333;
        height: 47px;
        font-size: 17px;

        input {
          height: 40px;
        }
      }
      .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 0px;
      }
      .title-container {
        position: relative;

        .login_logo {
          width: 168px;
          height: 78px;
          display: block;
          margin: 0 auto;
          margin-bottom: 30px;
        }

        .title {
          font-size: 34px;
          color: #333;
          margin-bottom: 45px;
          text-align: center;
          font-weight: bold;
        }
      }
      .tips {
        font-size: 14px;
        margin-bottom: 21px;
        display: flex;
        justify-content: space-between;
        align-items: baseline;

        .tips-pw {
          color: rgb(64, 158, 255);
        }
      }

      .el-form-item {
        margin-bottom: 30px;
      }
    }
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
@media screen and (max-width: 1200px) {
  .login {
    .login-box {
      width: 500px;
      padding: 25px !important;

      .login-left {
        display: none;
      }
    }
  }
}
</style>