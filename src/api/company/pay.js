import request from '@/utils/request'

// 获取公司详细信息
export function getCorpInfo(corpId) {
    return request({
        url: `/wecom/corp/extdata/` + corpId,
        method: 'get'
    })
}
// 修改企业扩展信息
export function corpEdit(data) {
    return request({
        url: `/wecom/corp/extdata`,
        method: 'PUT',
        data
    })
}