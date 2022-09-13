import request from '@/utils/request'

//查询首页看板统计
export function getActivityReportNumbers(data) {
    return request({
        url: `/es/bi/order/pc/getNumbers`,
        method: 'get',
        params: data
    })
}

// 获取统计图数据
export function getSalesHistogram(data) {
    return request({
        url: `/es/bi/order/pc/getSalesHistogram`,
        method: 'get',
        params: data
    })
}

//获取区域业务组织架构
export function getAreaTree(data) {
    return request({
        url: `/wecom/corpinfo/reltree/tree`,
        method: 'get',
        params: data
    })
}

//获取区域销售情况
export function getRegionSaleInfo(data) {
    return request({
        url: `/es/bi/order/pc/getRegionSaleInfo`,
        method: 'get',
        params: data
    })
}

//获取品牌销售排行
export function getBrandTop(data) {
    return request({
        url: `/es/bi/order/pc/getBrandTop`,
        method: 'get',
        params: data
    })
}

//获取单品销售排行
export function getProductTop(data) {
    return request({
        url: `/es/bi/order/pc/getProductTop`,
        method: 'get',
        params: data
    })
}
