import request from '@/utils/request'

// 查询生产厂家列表
export function listMaker(query) {
    return request({
        url: '/wecom/corpinfo/maker/list',
        method: 'get',
        params: query
    })
}

// 查询生产厂家详细
export function getMaker(makerId) {
    return request({
        url: '/wecom/corpinfo/maker/' + makerId,
        method: 'get'
    })
}

// 新增生产厂家
export function addMaker(data) {
    return request({
        url: '/wecom/corpinfo/maker',
        method: 'post',
        data: data
    })
}

// 修改生产厂家
export function updateMaker(data) {
    return request({
        url: '/wecom/corpinfo/maker',
        method: 'put',
        data: data
    })
}

// 删除生产厂家
export function delMaker(makerId) {
    return request({
        url: '/wecom/corpinfo/maker/' + makerId,
        method: 'delete'
    })
}

// 导出生产厂家
export function exportMaker(query) {
    return request({
        url: '/wecom/corpinfo/maker/export',
        method: 'get',
        params: query
    })
}
