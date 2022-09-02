import request from '@/utils/request'

//获取公司详细信息
export function getCorpInfo(corpId) {
    return request({
        url: `/corpinfo/info/${corpId}`,
        method: 'get'
    })
}
