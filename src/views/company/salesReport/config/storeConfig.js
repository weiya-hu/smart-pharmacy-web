//激励活动报表配置
const contentTableSalesReport = {
    storeName: "SalesReport",
    requestMethodName: 'getSalesReportTableList',
    showDataListName: 'salesReportList',
    countName: 'salesReportCount',
}
const contentTableSalesReportToStore = {
    storeName: "SalesReport",
    requestMethodName: null,
    showDataListName: 'storeMulti',
    countName: 'salesReportCount',
}
const contentTableSalesReportToBrand = {
    storeName: "SalesReport",
    requestMethodName: null,
    showDataListName: 'brandMulti',
    countName: 'salesReportCount',
}
const contentTableSalesReportToProduct = {
    storeName: "SalesReport",
    requestMethodName: null,
    showDataListName: 'productMulti',
    countName: 'salesReportCount',
}
export {
    contentTableSalesReport,
    contentTableSalesReportToStore,
    contentTableSalesReportToBrand,
    contentTableSalesReportToProduct
}