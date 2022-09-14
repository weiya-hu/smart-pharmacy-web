import request from '@/utils/request'

// 查询订单列表
export function getOrderList(query) {
    return request({
        url: '/es/orderList/getAllList',
        method: 'get',
        params: query
    })
}