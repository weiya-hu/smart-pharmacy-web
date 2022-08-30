import request from '@/utils/request'

// 查询门店销售的产品数据从连锁产品库中继承列表
export function listStore(query) {
    return request({
        url: '/wecom/store/list',
        method: 'get',
        params: query
    })
}

// 查询门店销售的产品数据从连锁产品库中继承详细
export function getStore(productChainid) {
    return request({
        url: '/wecom/store/' + productChainid,
        method: 'get'
    })
}

// 新增门店销售的产品数据从连锁产品库中继承
export function addStore(data) {
    return request({
        url: '/wecom/store',
        method: 'post',
        data: data
    })
}

// 修改门店销售的产品数据从连锁产品库中继承
export function updateStore(data) {
    return request({
        url: '/wecom/store',
        method: 'put',
        data: data
    })
}

// 删除门店销售的产品数据从连锁产品库中继承
export function delStore(productChainid) {
    return request({
        url: '/wecom/store/' + productChainid,
        method: 'delete'
    })
}

// 导出门店销售的产品数据从连锁产品库中继承
export function exportStore(query) {
    return request({
        url: '/wecom/store/export',
        method: 'get',
        params: query
    })
}
