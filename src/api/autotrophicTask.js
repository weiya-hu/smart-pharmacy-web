import request from '@/utils/request'

//查询活动任务列表
export function getAutotrophicTaskActiveList() {
    let data = {}
    return request({
        url: '/sop/event/info/list',
        method: 'get',
        data: data
    })
}

//获取任务详细信息
export function getActiveTaskDetail(eventid) {
    console.log(eventid)
    return request({
        url: `/sop/event/info/${eventid}`,
        method: 'get',
    })
}


//获取关系树节点
export function getRelationShipTreeNode(data) {
    return request({
        url: 'wecom/corpinfo/reltree/tree',
        method: 'get',
        data: data
    })
}

//获取关系树列表
export function getRelationShipTreeList() {
    let data = {
        // nodeIds:""
    }
    return request({
        url: '/corpinfo/reltree/list',
        method: 'post',
        data: data
    })
}

//获取关系树节点详细信息
export function getRelationShipTreeNodeDetail() {
    let nodeid = 1
    return request({
        url: `/corpinfo/reltree/detail/${nodeid}`,
        method: 'post',
    })
}