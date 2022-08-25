//角色表格展示配置
const contentTableRole = {
    storeName: "RolePermission",
    requestMethodName: 'getRoleTableList',
    showDataListName: 'roleList',
    countName: 'roleCount',
}
//人员表格展示配置
const contentTablePeople = {
    storeName: "RolePermission",
    requestMethodName: 'getPeopleTableList',
    showDataListName: 'peopleList',
    countName: 'peopleCount',
}
//报表
const marketingReportTable = {
    storeName: "RolePermission",
    requestMethodName: 'getMarketingReportTableList',
    showDataListName: 'marketingReportList',
    countName: 'marketingReportCount',
}
export {
    contentTableRole,
    contentTablePeople,
    marketingReportTable
}