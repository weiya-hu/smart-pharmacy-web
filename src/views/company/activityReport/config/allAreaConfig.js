//全部大区列表配置格式
export const allAreaTableConfig = {
    title: '用户列表',
    propList: [
        {field: 'productName', title: '全部大区', minWidth: '20',},
        {field: 'sales', title: '均值', minWidth: '20',},
        {
            field: 'salesRatio',
            title: '日峰值(元)',
            minWidth: '40',
        },
    ],
    tableHeight: 550

}
export const provinceAreaTableConfig = {
    title: '用户列表',
    propList: [
        {field: 'productName', title: '省级片区', minWidth: '20',},
        {field: 'sales', title: '均值', minWidth: '20',},
        {
            field: 'salesRatio',
            title: '日峰值(元)',
            minWidth: '40',
        },
    ],

    tableHeight: 550

}
export const cityAreaTableConfig = {
    propList: [
        {field: 'productName', title: '城市片区', minWidth: '20',},
        {field: 'sales', title: '均值', minWidth: '20',},
        {
            field: 'salesRatio',
            title: '峰值(元)',
            minWidth: '40',
        },
    ],
    tableHeight: 550

}
export const storeAreaTableConfig = {
    propList: [
        {field: 'productName', title: '门店', minWidth: '20',},
        {field: 'sales', title: '均值', minWidth: '20',},
        {
            field: 'salesRatio',
            title: '峰值(元)',
            minWidth: '40',
        },
    ],
    tableHeight: 550

}
//品牌列表配置
export const storeBrandTableConfig = {
    propList: [
        {field: 'name', title: '品牌名', minWidth: '20',},
        {field: 'salesAmount', title: '销售额', minWidth: '20', slotName: "salesAmountSlot", sortable: true},
        {
            field: 'salesProportion',
            title: '销售占比',
            minWidth: '40',
        },
        {
            field: 'yearOnYear',
            title: '同比',
            minWidth: '40',
            slotName: 'yearOnYearSlot'
        },
        {
            field: 'monthOnMonth',
            title: '环比',
            minWidth: '40',
            slotName: 'monthOnMonthSlot'
        },
    ],
    tableHeight: 550,
    isSort: {trigger: 'cell', defaultSort: {field: 'salesAmount', order: 'desc'}, orders: ['desc', 'asc', null]}
}
//单品列表配置
export const storeProductTableConfig = {
    propList: [
        {field: 'name', title: '品牌名', minWidth: '20',},
        {field: 'salesAmount', title: '销售额', minWidth: '20', slotName: "salesAmountSlot", sortable: true},
        {
            field: 'salesProportion',
            title: '销售占比',
            minWidth: '40',
        },
        {
            field: 'yearOnYear',
            title: '同比',
            minWidth: '40',
            slotName: 'yearOnYearSlot'
        },
        {
            field: 'monthOnMonth',
            title: '环比',
            minWidth: '40',
            slotName: 'monthOnMonthSlot'
        },
    ],
    tableHeight: 550,
    isSort: {trigger: 'cell', defaultSort: {field: 'salesAmount', order: 'desc'}, orders: ['desc', 'asc', null]}
}
