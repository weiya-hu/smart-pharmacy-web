import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: 'auth/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: 'auth/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'delete'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}
// 微信扫码登录
export function wechatLogin(data) {
  return request({
    url: '/auth/wechatLogin',
    method: 'get',
    params: data
  })
}
// 企微扫码登录
export function oauthLogin(data) {
  return request({
    url: '/auth/oauthLogin',
    method: 'get',
    params: data
  })
}

/**
 * @name 账号密码登录
 */
 export function authLogin_api (data){
  return request({
    url: '/auth/login',
    method: 'post',
    data: data
  })
}