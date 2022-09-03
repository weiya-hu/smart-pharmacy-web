import request from '@/utils/request'

// 获取公司详细信息
export function getCorpInfo(corpId) {
    return request({
        url: `/wecom/corpinfo/info/` + corpId,
        method: 'get'
    })
}
// 修改公司
export function getCorpEdit(data) {
    return request({
        url: `/wecom/corpinfo/info`,
        method: 'PUT',
        data
    })
}
