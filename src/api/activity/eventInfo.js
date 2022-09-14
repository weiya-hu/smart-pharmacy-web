import request from '@/utils/request'

//新增任务
export function createEventInfo(data) {
    return request({
        url: `/sop/event/info`,
        method: 'post',
        data: data
    })
}

//修改任务
export function updateEventInfo(data) {
    return request({
        url: `/sop/event/info`,
        method: 'put',
        data: data
    })
}

//根据ID查询
export function getEventInfoByid(eventId) {
    return request({
        url: `/sop/event/info/${eventId}`,
        method: 'get'
    })
}

//根据ID删除
export function delEventInfoByid(eventId) {
    return request({
        url: `/sop/event/info/${eventId}`,
        method: 'delete'
    })
}

//查询列表
export function queryEventInfoList(data) {
    return request({
        url: `/sop/event/info/list`,
        method: 'get',
        params: data
    })
}

//发布活动
export function publish(eventId) {
    return request({
        url: `/sop/event/info/publish/${eventId}`,
        method: 'get',
    })
}

//新增规则
export function addEventRule(data) {
    return request({
        url: `/sop/event/rule`,
        method: 'POST',
        data: data
    })
}

//查询活动任务的规则列表
export function queryEventRule(data) {
    return request({
        url: `/sop/event/rule/list`,
        method: 'get',
        params: data
    })
}

//查询活动任务规则
export function queryEventRuleInfo(data) {
    return request({
        url: `/sop/event/rule/${data}`,
        method: 'get',
    })
}

//发布活动任务
export function publishActivityTask(data) {
    return request({
        url: `/sop/event/info/publish/${data}`,
        method: 'get',
    })
}

//修改规则
export function changeEventRule(data) {
    return request({
        url: `/sop/event/rule`,
        method: 'PUT',
        data: data
    })
}

//删除规则
export function deleteEventRule(data) {
    return request({
        url: `/sop/event/rule/${data}`,
        method: 'DELETE',
    })
}

//门店产品品牌/品类/规格控制

export function filterGoods(data) {
    return request({
        url: `/product/chain/product/filter`,
        method: 'get',
        params: data
    })
}

//审核任务
export function approvalActivityTask(data) {
    return request({
        url: `/sop/event/info/approval/${data}`,
        method: 'get',
    })
}

//任务启用
export function startActivityTask(data) {
    return request({
        url: `/sop/event/info/start/${data}`,
        method: 'get',
    })
}

//任务停用
export function stopActivityTask(data) {
    return request({
        url: `/sop/event/info/stop/${data}`,
        method: 'get',
    })
}