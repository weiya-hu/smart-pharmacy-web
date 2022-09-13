import request from '@/utils/request'

// 查询岗位列表
export function listPost(query) {
  return request({
    url: '/wecom/corpinfo/job/page',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
// export function getPost(postId) {
export function getPost(query) {
  return request({
    url: '/wecom/corpinfo/job/get',
    method: 'get',
    // params:{id:postId}
    params: query
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: '/wecom/corpinfo/job/create',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: '/wecom/corpinfo/job/update',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delPost(postId) {
  return request({
    url: '/wecom/corpinfo/job/delete',
    method: 'delete',
    params:{id:postId}
  })
}
