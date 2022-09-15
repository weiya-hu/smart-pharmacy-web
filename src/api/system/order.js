import request from '@/utils/request'

// 查询订单列表
export function getOrderList(query) {
    return request({
        url: '/es/orderList/getAllList',
        method: 'get',
        params: query
    })
}

// 自定义上传
export function addDynamicHeaderExcelUrl(query) {
    return request({
        url: `/product/order/addDynamicHeaderExcelUrl?fileUrl=${query}`,
        method: 'post',
    })
}