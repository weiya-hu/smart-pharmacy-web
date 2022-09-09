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
export function publish(data) {
    return request({
        url: `/sop/event/info/publish`,
        method: 'POST',
        data: data
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

//发布活动任务
export function publishActivityTask(data) {
    return request({
        url: `/sop/event/info/publish/${data}`,
        method: 'get',
    })
}