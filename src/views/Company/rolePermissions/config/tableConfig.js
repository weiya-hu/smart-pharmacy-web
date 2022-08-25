//列表配置格式
export  const contentTableConfig = {
    title: '用户列表',
    propList: [
        {prop: 'name', label: '姓名', minWidth: '100'},
        {
            prop: 'branch',
            label: '部门',
            minWidth: '250',
        },
        {
            prop: 'role',
            label: '角色',
            minWidth: '250',
        },
        {
            prop: 'updateAt',
            label: '角色状态',
            minWidth: '250',
            slotName: "roleStatus"
        },

        {label: '操作', minWidth: '120', slotName: 'roleHandler'}
    ],
    showIndexColumn: true,
    showSelectColumn: false,
    showSelectCheckBox:false,
    isShowBorder:false,
}
