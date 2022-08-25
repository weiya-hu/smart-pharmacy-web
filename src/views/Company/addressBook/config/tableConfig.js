//列表配置格式
export const contentTableConfig = {
    title: '用户列表',
    propList: [
        {prop: 'name', label: '姓名', minWidth: '100'},
        {prop: 'job', label: '职务', minWidth: '100'},
        {
            prop: 'branch',
            label: '部门',
            minWidth: '250',
        },
        {
            prop: 'phone',
            label: '手机',
            minWidth: '250',
        },
        {
            prop: 'mailbox',
            label: '企业邮箱',
            minWidth: '250',
        },
        // {label: '操作', minWidth: '120', slotName: 'handler'}
    ],
    showIndexColumn: false,
    showSelectColumn: true,
    showSelectCheckBox:false,
    isShowBorder:false,
}
