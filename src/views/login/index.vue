<template>
  <div class="login">
    <div class="login-box">
      <div class="login-left">
        <img src="../../assets/images/login_left.png" alt="" />
      </div>
      <div class="login-right">
        <div class="login-btn">
          <wxlogin
              appid="wx3a6a5cc2924a2405"
              :scope="'snsapi_login'"
              :theme="'black'"
              state='wechat'
              :redirect_uri='redirectUri'
          >
          </wxlogin>
          <el-button @click="onClick('qw')" type="primary" size="large">企微登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import wxlogin from 'vue-wxlogin';
import {oauthLogin, wechatLogin} from "../../api/login";
import {GetQueryString} from '@/utils/validate';
import {setToken, getToken} from "../../utils/auth";

const router = useRouter();
const redirect = ref(undefined);

// 微信扫码登录
const redirectUri = encodeURIComponent("http://wang.shanhaiping.com/login")
const qRedirectUri = 'http://wang.shanhaiping.com/login'

// 微信
function getWechatLogin() {
  if (!getToken()) {
    let params = {
      appId: 'wx3a6a5cc2924a2405',
      authCode: GetQueryString('code'),
      corpId: ''
    }
    if (params.authCode !== '') {
      wechatLogin(params).then(res => {
        if (res.code === 200) {
          setToken(res.data.access_token)
          router.push({path: redirect.value || "/index"});
        } else {
          router.push({path: '/login'});
        }
      })
    } else {
      router.push({path: "/login"})
    }
  }
}
// 企业微信
function getOauthLogin() {
  if (!getToken()) {
    let params = {
      authCode: GetQueryString('auth_code') ? GetQueryString('auth_code')  : '',
      state: 'qrLoginsplit',
    }
    if (params.authCode !== '') {
      oauthLogin(params).then(res => {
        if (res.code === 200) {
          setToken(res.data.access_token)
          router.push({path: redirect.value || "/index"});
        } else {
          router.push({path: '/login'});
        }
      })
    } else {}
  }
}
// 登录
function onClick(){
  window.open(`https://open.work.weixin.qq.com/wwopen/sso/3rd_qrConnect?appid=ww15d16db33f11c8a2&redirect_uri=${encodeURIComponent(qRedirectUri)}&state=wecom&usertype=member`)
}
const login = ()=>{
  if(GetQueryString('state') === 'wecom'){
    getOauthLogin()
  }else if(GetQueryString('state') === 'wechat'){
    getWechatLogin()
  }
}
login()
</script>

<style lang="scss" scoped>
.login {
  img {
    width: 100%;
  }
  width: 100%;
  height: 100%;
  background: url("../../assets/images/login_bg.png");
  background-size: cover;
  position: relative;
  .login-box {
    max-width: 1000px;
    height: 525px;
    background: #fff;
    padding: 50px 20px;
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
    }
    .login-right {
      width: 520px;
      max-width: 100%;
      margin: 0 auto;
      overflow: hidden;
      .login-logo {
        width: 168px;
        height: 78px;
        display: block;
        margin: 0 auto;
        margin-bottom: 30px;
      }
      .login-title {
        font-size: 34px;
        color: #333;
        margin-bottom: 45px;
        text-align: center;
        font-weight: bold;
      }
      .login-btn {
        width: 80%;
        margin: 0 auto;
        & > div {
          text-align: center;
        }
        .el-button {
          width: 100%;
        }
      }
    }
  }
}
@media screen and (max-width: 1000px) {
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