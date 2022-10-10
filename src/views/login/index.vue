<template>
  <div class="login" v-loading="loading"  element-loading-text="登录中···">
    <div class="login-box">
      <div class="login-left">
        <img src="../../assets/images/login_left.png" alt=""/>
      </div>
      <div class="login-right">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="微信扫码登录" name="first">
            <wxlogin
                appid="wx3a6a5cc2924a2405"
                :scope="'snsapi_login'"
                :theme="'black'"
                state='wechat'
                :redirect_uri='redirectUri'
                href="data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDI0MHB4O2JvcmRlcjogMDt9Ci5pbXBvd2VyQm94IC50aXRsZSB7ZGlzcGxheTogbm9uZTt9Ci5pbXBvd2VyQm94IC5pbmZvIHt3aWR0aDogMjQwcHg7fQouc3RhdHVzX2ljb24ge2Rpc3BsYXk6IG5vbmV9Ci5pbXBvd2VyQm94IC5zdGF0dXMge3RleHQtYWxpZ246IGNlbnRlcjt9IA=="
            >
            </wxlogin>
          </el-tab-pane>
          <el-tab-pane label="企业微信扫码登陆" name="second">
            <iframe :src="authUrl" height="400px" width="100%" frameborder="0"></iframe>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="扫码注册" width="400px" :close-on-click-modal="false">
      <div class="wechat-url">
        <img src="@/assets/images/register.png" alt=""/>
      </div>
    </el-dialog>
    <el-dialog v-model="dialogUrlVisible" title="扫码添加" width="400px" :close-on-click-modal="false">
      <div class="wecom-url">
        <img src="@/assets/images/register-wecom.png" alt=""/>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import wxlogin from 'vue-wxlogin';
import {oauthLogin, wechatLogin} from "../../api/login";
import {GetQueryString} from '@/utils/validate';
import {setToken, getToken,removeToken} from "../../utils/auth";

const {proxy} = getCurrentInstance();
const router = useRouter(), route = useRoute();
const redirect = ref(undefined);
const activeName = ref('first')
const dialogVisible = ref(false)
const dialogUrlVisible = ref(false)
const loading = ref(false)

// 微信扫码登录
const redirectUri = encodeURIComponent("http://platform.shanhaiping.com/")
const authUrl = `https://open.work.weixin.qq.com/wwopen/sso/3rd_qrConnect?appid=ww15d16db33f11c8a2&redirect_uri=${redirectUri}&state=wecom&usertype=member&href=data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDIyMHB4O30KLmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5OiBub25lO30KLmltcG93ZXJCb3ggLmluZm8ge3dpZHRoOiAyMjBweDt9Ci5zdGF0dXNfaWNvbiB7ZGlzcGxheTogbm9uZSAgIWltcG9ydGFudH0KLmltcG93ZXJCb3ggLnN0YXR1cyB7dGV4dC1hbGlnbjogY2VudGVyO30g`

// 微信
function getWechatLogin() {
  let params = {
    appId: 'wx3a6a5cc2924a2405',
    authCode: GetQueryString('code'),
    corpId: ''
  }
  if (params.authCode !== '') {
    loading.value = true
    wechatLogin(params).then(res => {
      if (res.code === 200) {
        loading.value = false
        setToken(res.data.access_token)
        console.log('res',res)
        router.push({path: "/index"});
      } else {
        loading.value = false
        window.history.pushState(null,null,'/')
        dialogVisible.value = true
      }
    }).catch(e => {
      // dialogVisible.value = true
      window.history.pushState(null,null,'/')
      dialogVisible.value = true
      loading.value = false
    })
  } else {
    router.push({path: "/login"})
  }
}

// 企业微信
function getOauthLogin() {
  let params = {
    authCode: GetQueryString('auth_code') ? GetQueryString('auth_code') : '',
    state: 'qrLoginsplit',
  }
  if (params.authCode !== '') {
    loading.value = true
    oauthLogin(params).then(res => {
      if (res.code === 200) {
        loading.value = false
        setToken(res.data.access_token)
        router.push({path: "/index"});
      } else {
        loading.value = false
        window.history.pushState(null,null,'/')
        dialogUrlVisible.value = true
      }
    }).catch(err => {
      // dialogUrlVisible.value = true
      window.history.pushState(null,null,'/')
      dialogUrlVisible.value = true
      loading.value = false
    })
  } else {
    router.push({path: "/login"})
  }
}

const wecomControlLogin = () => {
  let params = {
    authCode: GetQueryString('auth_code') ? GetQueryString('auth_code') : '',
    state: 'oauthLoginsplit',
  }
  if (params.authCode !== '') {
    oauthLogin(params).then(res => {
      if (res.code === 200) {
        setToken(res.data.access_token)
        router.push({path: "/index"});
      } else {
        router.push({path: '/login'});
      }
    })
  } else {
    router.push({path: "/login"});
  }
}

const login = async () => {
  if (process.env.NODE_ENV == "development") {
    setToken('eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjoxNTcyMTg2MDU1MTk1MDEzMTIwLCJ1c2VyX2tleSI6ImQ1M2Q0ZDRiODJiYTRhYjBhYzc2NDI0MmJmM2JiYWI5IiwidXNlcm5hbWUiOiLllJDmsLjkuYUifQ.wQQNLmUPuEpqapyxC68PDJwbjNPzf4vtrpXJyZWx6q097d9csndDv5ER05Qbe7WMU5xKNYJOH7MNdRHiMniMmQ')
    //开发环境
  } else if (process.env.NODE_ENV == "production") {
    //生产环境
    removeToken()
  }

  if (GetQueryString('state') === 'wecom') {
    await getOauthLogin()
  } else if (GetQueryString('state') === 'wechat') {
    await getWechatLogin()
  } else if (GetQueryString('state') === 'oauthLoginsplit') {
    wecomControlLogin()
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
    max-width: 980px;
    height: 568px;
    background: #fff;
    padding: 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 1px 15px #eee;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .login-left {
      width: 520px;
      height: 435px;
    }

    .login-right {
      width: 400px;
      margin: 0 auto;
      overflow: hidden;
      padding: 0 20px 0 40px;

      :deep(.el-tabs__nav) {
        transform: translateX(52px) !important;
      }

      #pane-first {
        text-align: center;
      }
    }
  }

  :deep(.el-dialog__body) {
    padding-top: 10px;
  }

  .wecom-url {
    width: 240px;
    margin: 0 auto;
  }

  .wechat-url {
    width: 200px;
    margin: 0 auto;
  }
}

@media screen and (max-width: 980px) {
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
