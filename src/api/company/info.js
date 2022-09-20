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
// 公司信息
export function getCurrUserBaseInfo() {
    return request({
        url: `/wecom/corpinfo/user/getCurrUserBaseInfo`,
        method: 'GET',
    })
}

//获取邀请成员二维码
export function getInviteQrcode(data){
    return request({
        url: `/wecom/corpinfo/info/getInviteQrcode`,
        method: 'GET',
        params:data
    })
}

