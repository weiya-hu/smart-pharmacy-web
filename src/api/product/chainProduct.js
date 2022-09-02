import request from '@/utils/request'

// 查询连锁门店销售的所有产品的数据列表
export function listProduct(query) {
    return request({
        url: '/product/chain/product/list',
        method: 'get',
        params: query
    })
}

// 查询连锁门店销售的所有产品的数据详细
export function getProduct(productChainid) {
    return request({
        url: `/product/chain/product/${productChainId}`,
        method: 'get'
    })
}

// 新增连锁门店销售的所有产品的数据
export function addProduct(data) {
    return request({
        url: '/product/chain/product',
        method: 'post',
        data: data
    })
}

// 修改连锁门店销售的所有产品的数据
export function updateProduct(data) {
    return request({
        url: '/product/chain/product',
        method: 'put',
        data: data
    })
}

// 删除连锁门店销售的所有产品的数据
export function delProduct(productChainid) {
    return request({
        url: `/product/chain/product/${productChainId}`,
        method: 'delete'
    })
}

// 导出连锁门店销售的所有产品的数据
export function exportProduct(query) {
    return request({
        url: '/wecom/product/export',
        method: 'get',
        params: query
    })
}
