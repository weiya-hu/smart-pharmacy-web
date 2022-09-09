import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/wecom/corpinfo/dept/list',
    method: 'get',
    params: query
  })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: '/wecom/corpinfo/dept/list/exclude/' + deptId,
    method: 'get'
  })
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/wecom/corpinfo/dept/' + deptId,
    method: 'get'
  })
}

// 查询部门下拉树结构
export function treeselect(query) {
  return request({
    url: '/wecom/corpinfo/dept/tree',
    method: 'get',
    params: query
  })
}

// 关系树
export function relTree() {
  return request({
    url: '/wecom/corpinfo/reltree/tree',
    method: 'GET'
  })
}
// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: '/wecom/corpinfo/reltree/roleBussinessTreeSelect/' + roleId,
    method: 'get'
  })
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/wecom/corpinfo/dept',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/wecom/corpinfo/dept',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: '/wecom/corpinfo/dept/' + deptId,
    method: 'delete'
  })
}
