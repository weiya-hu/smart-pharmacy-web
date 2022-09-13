import request from '@/utils/request'

// 查询业务树
export function listReltree(query) {
    return request({
        url: '/wecom/corpinfo/reltree/tree',
        method: 'get',
        params: query
    })
}
// 获取关系树节点详细信息
export function getReltree(nodeid) {
    return request({
        url: `/wecom/corpinfo/reltree/detail/${nodeid}`,
        method: 'get'
    })
}

// 新增关系树
export function addReltree(data) {
    return request({
        url: '/wecom/corpinfo/reltree/add',
        method: 'post',
        data: data
    })
}

// 修改关系树
export function updateReltree(data) {
    return request({
        url: '/wecom/corpinfo/reltree/update',
        method: 'PUT',
        data: data
    })
}

// 删除关系树
export function delReltree(nodeid) {
    return request({
        url: `/wecom/corpinfo/reltree/${nodeid}`,
        method: 'delete'
    })
}

// 查询生产厂家列表
export function makerList() {
    return request({
        url: `/wecom/corpinfo/maker/list`,
        method: 'GET'
    })
}
// 查询连锁门店列表
export function chainList() {
    return request({
        url: `/wecom/corpinfo/chain/list`,
        method: 'GET'
    })
}
// 查询门店列表
export function storeList() {
    return request({
        url: `/wecom/corpinfo/store/list`,
        method: 'GET'
    })
}

// 关系树列表
export function listPage(data) {
    return request({
        url: `/wecom/corpinfo/reltree/listPage`,
        method: 'POST',
        data
    })
}
