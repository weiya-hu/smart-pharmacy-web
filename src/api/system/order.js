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
        timeout:120000
    })
}

//获取映射关系
export function getMapping() {
    return request({
        url: `/product/dynamicddi/getMapping`,
        method: 'get',
        timeout:120000
    })
}

//提交映射关系
export function setConvertMapping(data) {
    return request({
        url: `/product/dynamicddi/setConvertMapping`,
        method: 'post',
        data: data
    })
}

//获取自定义表头数据
export function queryProductOrderDynamicHeaderData() {
    return request({
        url: `/product/dynamicddi/queryProductOrderDynamicHeaderData`,
        method: 'get',
    })
}
