import request from '@/utils/request'

// 查询厂家的产品信息列表
export function listProduct(query) {
    return request({
        url: '/wecom/product/list',
        method: 'get',
        params: query
    })
}

// 查询厂家的产品信息详细
export function getProduct(productMakerid) {
    return request({
        url: '/wecom/product/' + productMakerid,
        method: 'get'
    })
}

// 新增厂家的产品信息
export function addProduct(data) {
    return request({
        url: '/wecom/product',
        method: 'post',
        data: data
    })
}

// 修改厂家的产品信息
export function updateProduct(data) {
    return request({
        url: '/wecom/product',
        method: 'put',
        data: data
    })
}

// 删除厂家的产品信息
export function delProduct(productMakerid) {
    return request({
        url: '/wecom/product/' + productMakerid,
        method: 'delete'
    })
}

// 导出厂家的产品信息
export function exportProduct(query) {
    return request({
        url: '/wecom/product/export',
        method: 'get',
        params: query
    })
}
