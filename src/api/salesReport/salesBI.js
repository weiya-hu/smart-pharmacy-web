import request from '@/utils/request'

//获取活动品类
export function getProductTypeOption() {
    return request({
        url: `/es/queryParams/getProductType`,
        method: 'get',
    })
}

// //获取活动品类
// export function getProductTypeOption() {
//     return request({
//         url: `/es/queryParams/getProductType`,
//         method: 'get',
//     })
// }

//获取单品销售情况
export function getProductMulti(data) {
    return request({
        url: `/es/productOrder/getProductMulti`,
        method: 'get',
        params: data
    })
}

//获取品牌销售情况
export function getBrandMulti(data) {
    return request({
        url: `/es/productOrder/getBrandMulti`,
        method: 'get',
        params: data
    })
}

//获取门店激励销售情况
export function getStoreMulti(data) {
    return request({
        url: `/es/productOrder/getStoreMulti`,
        method: 'get',
        params: data
    })
}

//获取自定义结构统计表当中的数据
export function getRegionMulti(data) {
    return request({
        url: `/es/productOrder/getRegionMulti`,
        method: 'get',
        params: data
    })
}
