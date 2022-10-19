import request from '@/utils/request'

//任务范围中的产品列表
export function queryProductList(data) {
    return request({
        url: `/sop/event/product/list`,
        method: 'get',
        params: data
    })
}

//任务范围中的品牌列表
export function queryBrandList(eventId) {
    return request({
        url: `/sop/event/info/beSelectedFilter/${eventId}`,
        method: 'get',
    })
}

//任务范围中的门店列表
export function queryStoreList(eventId, data) {
    return request({
        url: `/sop/event/info/beSelectedStore/${eventId}`,
        method: 'get',
        params: data
    })
}

//任务范围中的职务列表
export function queryJobList(eventId, data = []) {
    return request({
        url: `/sop/event/info/job/${eventId}`,
        method: 'get',
        params: data
    })
}

