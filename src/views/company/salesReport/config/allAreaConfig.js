export const allAreaTableConfig = {
    propList: [
        {field: 'group', title: '名称', minWidth: '20',},
        {field: 'maxMoney', title: '峰值(元)', minWidth: '20',},
        {field: 'avgMoney', title: '均值(元)', minWidth: '20',},
        {field: 'maxTime', title: '峰值日期', minWidth: '20',},
        {field: 'proportion', title: '总额占比', minWidth: '20',},
        {field: 'yearOnYear', title: '同比', minWidth: '20', slotName: 'yearOnYearSlot'},
        {field: 'monthOnMonth', title: '环比', minWidth: '20', slotName: 'monthOnMonthSlot'},
        {field: 'shelfSalesRatio', title: '动销率', minWidth: '20',},
        {field: 'sumMoney', title: '销售额(元)', minWidth: '20', sortable: true},
        {field: 'count', title: '品/单数', minWidth: '20', sortable: true},
    ],
    tableHeight: 550,
    isSort: {trigger: 'cell', defaultSort: {field: 'sumMoney', order: 'desc'}, orders: ['desc', 'asc', null]}

}
