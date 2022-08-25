//列表配置格式
export  const contentTableRoleConfig = {
    title: '用户列表',
    propList: [
        {prop: 'name', label: '角色', minWidth: '100'},
        {
            prop: 'roleDesc',
            label: '角色描述',
            minWidth: '250',
        },
        {
            prop: 'status',
            label: '角色状态',
            minWidth: '250',
            slotName: 'status'
        },

        {label: '操作', minWidth: '120', slotName: 'roleHandler'}
    ],
    showIndexColumn: true,
    showSelectColumn: false,
    isShowBorder:false,
    showSelectCheckBox:false

}
