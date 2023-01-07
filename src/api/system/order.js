import request from '@/utils/request'
import axios from 'axios'

// 查询订单列表
// export function getOrderList(query) {
//     return request({
//         url: '/es/orderList/getAllList',
//         method: 'get',
//         params: query
//     })
// }

// 自定义上传
export function addDynamicHeaderExcelUrl(query) {
    return request({
        url: `/product/order/addDynamicHeaderExcelUrl?fileUrl=${query}`,
        method: 'post',
        timeout: 120000
    })
}

//获取映射关系
export function getMapping() {
    return request({
        url: `/product/dynamicddi/getMapping`,
        method: 'get',
        timeout: 120000
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

//获取自定义表头数据
export function getOrderList(data) {
    return request({
        url: `/es/orderListPage/getOrderList`,
        method: 'get',
        params: data
    })
}

//销售订单文件上传
export function uploadSaleOrder(obj) {
    return axios({
        url: import.meta.env.VITE_APP_BASE_API + `/product/order/addDynamicHeaderExcelFile`,
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + obj.token,
        },
        data: obj.data,
        onUploadProgress: obj.cllBackFunction,
        timeout: 50000,
    })


}

//获取最近一次上传文件的状态
export function recentlyFileInfo() {
    return request({
        url: `/product/productOrderImport/getRecent`,
        method: 'get',
    })
}

//根据用户id获取人名
export function getUserNameByUserId(id) {
    return request({
        url: `/wecom/corpinfo/user/getUserInfoById`,
        method: 'get',
        params:{
            userId:id
        }
    })
}