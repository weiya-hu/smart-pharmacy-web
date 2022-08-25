//全部大区列表配置格式
export const allAreaTableConfig = {
    title: '用户列表',
    propList: [
        {field: 'productName', title: '品牌名',  minWidth: '20',},
        {field: 'sales', title: '销售额',  minWidth: '20',},
        {
            field: 'salesRatio',
            title: '销售占比',
            minWidth: '40',
        },
        {
            field: 'yearOnYear',
            title: '同比',
            minWidth: '10'
        },
        {
            field: 'chainRatio',
            title: '环比',
            slotName:'chainRatioSlot',
            minWidth: '10'
        },
        // {title: '操作', minWidth: '120', slotName: 'handler'}
    ],
    // showIndexColumn: false,
    // showSelectColumn: false
    tableHeight:550

}
