//列表配置格式
export const contentTableConfig = {
    title: '用户列表',
    propList: [
        {prop: 'time', label: '销售日期', minWidth: '100'},
        {prop: 'orderCode', label: '订单编号', minWidth: '100'},
        {
            prop: 'goodsCode',
            label: '商品编号',
        },
        {
            prop: 'goodsName',
            label: '商品名称',
        },
        {
            prop: 'size',
            label: '规格',
        },
        {
            prop: 'sales',
            label: '销量(盒)',
        },
        {
            prop: 'price',
            label: '销售单价',
        },
        {
            prop: 'actualPrice',
            label: '实收金额',
        },
        {
            prop: 'writeOff',
            label: '是否核销',
        },
        {
            prop: 'reimburse',
            label: '是否退款',
        },

    ],
    showIndexColumn: false,
    showSelectColumn: true,
    isShowBorder: true,
    showSelectCheckBox:false

}
