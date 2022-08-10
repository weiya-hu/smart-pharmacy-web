import request from '@/utils/request'

// 查询DDI订单列表
export function listOrder(query) {
    return request({
        url: '/wecom/order/list',
        method: 'get',
        params: query
    })
}

// 查询DDI订单详细
export function getOrder(id) {
    return request({
        url: '/wecom/order/' + id,
        method: 'get'
    })
}

// 新增DDI订单
export function addOrder(data) {
    return request({
        url: '/wecom/order',
        method: 'post',
        data: data
    })
}

// 修改DDI订单
export function updateOrder(data) {
    return request({
        url: '/wecom/order',
        method: 'put',
        data: data
    })
}

// 删除DDI订单
export function delOrder(id) {
    return request({
        url: '/wecom/order/' + id,
        method: 'delete'
    })
}

// 导出DDI订单
export function exportOrder(query) {
    return request({
        url: '/wecom/order/export',
        method: 'get',
        params: query
    })
}