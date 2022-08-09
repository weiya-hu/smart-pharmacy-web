import request from '@/utils/request'

// 查询公告列表
export function listNotice(query) {
    return request({
        url: '/system/notice/template/list',
        method: 'get',
        params: query
    })
}

// 查询公告详细
export function getNotice(noticeId) {
    return request({
        url: '/system/notice/template/' + noticeId,
        method: 'get'
    })
}

// 新增公告
export function addNotice(data) {
    return request({
        url: '/system/notice/template',
        method: 'post',
        data
    })
}

// 修改公告
export function updateNotice(data) {
    return request({
        url: '/system/notice/template',
        method: 'put',
        data
    })
}

// 删除公告
export function delNotice(id) {
    return request({
        url: '/system/notice/template/' + id,
        method: 'delete'
    })
}