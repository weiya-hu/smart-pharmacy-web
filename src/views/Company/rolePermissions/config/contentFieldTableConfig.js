//列表配置格式
const contentTableConfig = {
    title: '用户列表',
    propList: [
        {prop: 'rulesName', label: '规则名称', minWidth: '100'},
        {
            prop: 'desc',
            label: '规则说明',
            minWidth: '250',
        },

    ],
    showIndexColumn: false,
    showSelectColumn: false,
    showSelectCheckBox:true,
    isShowBorder:false,
}
export default  contentTableConfig