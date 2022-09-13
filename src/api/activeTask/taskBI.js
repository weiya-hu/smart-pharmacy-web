import request from '@/utils/request'

//获取品牌选项
export function getBrandOption() {
    return request({
        url: `/es/queryParams/getBrand`,
        method: 'get',
    })
}

//获取活动列表
export function getEventOption() {
    return request({
        url: `/es/queryParams/getEvent`,
        method: 'get',
    })
}

//获取活动品类
export function getProductTypeOption() {
    return request({
        url: `/es/queryParams/getProductType`,
        method: 'get',
    })
}

//销售额和已发放金额
export function getSaleInfoAndRewardInfo(data) {
    return request({
        url: `/es/appIndex/saleInfoAndRewardInfo`,
        method: 'get',
        param: data
    })
}

//获取门店的bi列表数据
export function getStoreBiList(data) {
    return request({
        url: `/es/bi/order/app/getStoreBiList`,
        method: 'get',
        param: data
    })
}

//获取门店的bi数据
export function getStoreBi(data) {
    return request({
        url: `/es/bi/order/app/getStoreBi`,
        method: 'get',
        param: data
    })
}

//获取活动奖励的bi列表数据
export function getEventRewardBiList(data) {
    return request({
        url: `/es/bi/order/app/getEventRewardBiList`,
        method: 'get',
        param: data
    })
}

//获取活动奖励的bi数据
export function getEventRewardBi(data) {
    return request({
        url: `/es/bi/order/app/getEventRewardBi`,
        method: 'get',
        param: data
    })
}