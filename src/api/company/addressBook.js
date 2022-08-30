import request from '@/utils/request'

// 新增租户公司部门组织机构树
export const createAddressBook = (data) => {
    return request({
        url: '/wecom/corpinfo/dept',
        method: 'POST',
        data
    })
}
// 修改 租户公司部门组织机构树
export const updateAddressBook = (data) => {
    return request({
        url: '/wecom/corpinfo/dept',
        method: 'PUT',
        data
    })
}
// 根据ID 获取详情
export const findDeptById = (deptid) => {
    return request({
        url: `/corpinfo/dept/${deptid}`,
        method: 'GET'
    })
}
// 根据ID 删除
export const delDeptById = (deptid) => {
    return request({
        url: `/corpinfo/dept/${deptid}`,
        method: 'DELETE'
    })
}

// 查询租户公司部门组织机构树列表
export const findDeptByTree = (data) => {
    return request({
        url: '/wecom/corpinfo/dept/tree',
        method: 'GET',
        params:data
    })
}

