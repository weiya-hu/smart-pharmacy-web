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
        method: 'POST',
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
