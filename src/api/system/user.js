import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/wecom/corpinfo/user/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    // url: '/wecom/corpinfo/user/' + parseStrEmpty(userId),
    url: '/wecom/corpinfo/user/getUserInfoForEdit/' + parseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/wecom/corpinfo/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/wecom/corpinfo/user/edit',
    method: 'POST',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/wecom/corpinfo/user/' + userId,
    method: 'delete'
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/wecom/corpinfo/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/wecom/corpinfo/user/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/wecom/corpinfo/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/wecom/corpinfo/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/wecom/corpinfo/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/wecom/corpinfo/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 查询某个用户的角色列表
export function getAuthRole(query) {
  return request({
    url: '/wecom/corpinfo/role/authUser/roleList',
    method: 'get',
    params: query
  })
}

// 批量选择用户授权
export function updateAuthRole(data) {
  return request({
    url: '/wecom/corpinfo/role/authUser/selectAll',
    method: 'POST',
    data: data
  })
}

// 同步通讯录
export function synchWeUser() {
  return request({
    url: '/wecom/corpinfo/user/synchWeUser',
    method: 'get'
  })
}
