import request from '@/utils/request'

// 禁用租户
export function disableTenant(data) {
    return request({
        url: '/system/system/tenant/disable/' + data,
        method: 'post',
    })
}
// 启用租户
export function enableTenant(data) {
    return request({
        url: '/system/system/tenant/enable/' + data,
        method: 'post'
    })
}
// 租户列表
export function listTenant(data) {
    return request({
        url: '/system/system/tenant/list',
        method: 'get',
        params: data
    })
}
// 保存租户信息
export function saveTenant(data) {
    return request({
        url: '/system/system/tenant/save',
        method: 'post',
        data
    })
}
// 查看租户企业代开发应用授权信息
export function getTenantInfo(data){
    return request({
        url: '/system/system/tenant/getTenantAgentInfo',
        method: 'get',
        params: data
    })
}
// 查询租户菜单下拉树结构
export function treeselectTenant(data) {
    return request({
        url: '/wecom/corpMenu/treeselect',
        method: 'get',
        params: data
    })
}
// 根据租户菜单编号获取详情信息
export function getTenant(menuId){
    return request({
        url: '/wecom/corpMenu/' + menuId,
        method: 'get'
    })
}
// 修改租户菜单
export function updateTenant(data){
    return request({
        url: '/wecom/corpMenu/update',
        method: 'put',
        data
    })
}
// 查看租户详情
export function infoTenant(data){
    return request({
        url: '/system/system/tenant/detail',
        method: 'get',
        params: data
    })
}