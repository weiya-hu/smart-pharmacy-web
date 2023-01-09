<template>
  <div class="login" v-loading="loading" element-loading-text="登录中···">
    <div class="login-box">
      <div class="login-left">
        <!--        <img src="../../assets/images/login_left.png" alt=""/>-->
        <video width="520" height="435" playsinline="" autoplay="" muted="" loop="">
          <source src="../../assets/video/login_left.mp4" type="video/mp4">
        </video>
      </div>
      <div class="login-right" :class="(envMode === 'development' || envMode === 'staging') && 'login-right-stage'">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="微信扫码登录" name="first">
            <wxlogin
                v-if="activeName == 'first'"
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
            <iframe :src="authUrl" height="400px" width="100%" frameborder="0" v-if="activeName == 'second'"></iframe>
          </el-tab-pane>
          <el-tab-pane v-if="envMode === 'development' || envMode === 'staging'" label="账号密码登录" name="third">
            <div class="password-login" v-if="activeName == 'third'">
              <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
                <el-form-item prop="username">
                  <el-input
                    v-model="loginForm.username"
                    auto-complete="off"
                    placeholder="请输入账号"
                    size="large"
                    type="text"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    v-model="loginForm.password"
                    auto-complete="off"
                    placeholder="请输入密码"
                    show-password
                    size="large"
                    type="password"
                    @keyup.enter="passwordLogin"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item style="width: 100%">
                  <el-button
                    :loading="loading"
                    size="large"
                    style="width: 100%"
                    type="primary"
                    @click.prevent="passwordLogin"
                  >
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
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
import {oauthLogin, wechatLogin, authLogin_api} from "../../api/login";
import {GetQueryString} from '@/utils/validate';
import {setToken, removeToken} from "../../utils/auth";

const {proxy} = getCurrentInstance();
const router = useRouter(), route = useRoute();
const redirect = ref(undefined);
const activeName = ref('first')
const dialogVisible = ref(false)
const dialogUrlVisible = ref(false)
const loading = ref(false)
const envMode = ref(import.meta.env.MODE)
const loginForm = ref({
  username: '',
  password: '',
  platformProductId: 'dianji',
})

const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
}

const loginRef = ref()

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
        if (res.data.need_register) {
          loading.value = false
          window.history.pushState(null, null, '/')
          dialogVisible.value = true
        } else {
          setToken(res.data.access_token)
          router.push({path: "/index"});
        }
      }
    }).catch(e => {
      // dialogVisible.value = true
      window.history.pushState(null, null, '/')
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
        setToken(res.data.access_token)
        router.push({path: "/index"});
      } else {
        loading.value = false
        window.history.pushState(null, null, '/')
        dialogUrlVisible.value = true
      }
    }).catch(err => {
      // dialogUrlVisible.value = true
      window.history.pushState(null, null, '/')
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
    loading.value = true
    oauthLogin(params).then(res => {
      if (res.code === 200) {
        setToken(res.data.access_token)
        router.push({path: "/index"});
      } else {
        loading.value = false
        router.push({path: '/login'});
      }
    })
  } else {
    loading.value = false
    router.push({path: "/login"});
  }
}

const login = async () => {
  if (process.env.NODE_ENV == "development") {
  setToken('eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjoxNTc1NjkzNjY3MTY5NTEzNDcyLCJ1c2VyX2tleSI6ImFlMzE1NzFhNDQ5OTRjMTdhMTIzODA0Njg2NDljYmNkIiwidXNlcm5hbWUiOiLnjovnvo7ojJwifQ.XPzRPw2FMq0OtXUVgjR0kmBXlNb7Yyjl__PQbFHfjelgXjQ1Fa75ESACNz5VFLQrKzzn37F7-SZj49O4p76mlQ')
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

//账号密码登录入口
const passwordLogin = () => {
  loginRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      authLogin_api(loginForm.value)
        .then((res) => {
          if (res.code === 200) {
            setToken(res.data.access_token)
            router.replace({ path: "/index" })
          } else {
            loading.value = false
            window.history.pushState(null, '', '/')
          }
        })
        .catch((err) => {
          window.history.pushState(null, '', '/')
          loading.value = false
        })
    }
  })
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
      //width: 520px;
      //height: 435px;
      width: auto;
      height: auto;
    }

    .login-right {
      width: 400px;
      margin: 0 auto;
      overflow: hidden;
      //padding: 0 20px 0 40px;
      padding: 35px 40px 0 0;

      :deep(.el-tabs__nav) {
        transform: translateX(52px) !important;
      }

      #pane-first {
        text-align: center;
      }
    }
    .login-right-stage {
      :deep(.el-tabs__nav) {
        transform: translateX(0) !important;
      }
    }
    .password-login {
      height: 404px;
      padding: 30px 40px;
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
