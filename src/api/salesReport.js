import request from '@/utils/request'

//查询销售看板统计信息
export function getSalesProductOrder(data) {
    return request({
        url: `/es/productOrder/getProductOrder`,
        method: 'get',
        params: data
    })
}

//获取动销店铺占比
export function getStoreRatio(data) {
    return request({
        url: `/es/productOrder/getStoreRatio`,
        method: 'get',
        params: data
    })
}

//获取动销品牌占比
export function getBrandRatio(data) {
    return request({
        url: `/es/productOrder/getBrandRatio`,
        method: 'get',
        params: data
    })
}

//获取动销单品占比


export function getProductRatio(data) {
    return request({
        url: `/es/productOrder/getProductRatio`,
        method: 'get',
        params: data
    })
}

//获取总数据和任务下拉列表
export function getOrderList(data) {
    return request({
        url: `/es/productOrder/getProductOrder`,
        method: 'get',
        params: data
    })
}

//获取不同任务下的销售活动占比

export function getActivityAndNormal(data) {
    return request({
        url: `/es/productOrder/getActivityAndNormal`,
        method: 'get',
        params: data
    })
}