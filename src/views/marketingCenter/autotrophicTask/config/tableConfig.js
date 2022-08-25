//列表配置格式
export const contentTableConfig = {
    title: '用户列表',
    propList: [
        {prop: 'name', label: '任务名称', minWidth: '100'},
        {label: '时段', minWidth: '100', slotName: 'timeSlot'},
        {
            prop: 'createAt',
            label: '奖励',
            minWidth: '250',
        },
        {
            prop: 'updateAt',
            label: '负责人',
            minWidth: '250',
        },
        {
            prop: 'updateAt',
            label: '状态',
            minWidth: '250',
        },
        {label: '操作', minWidth: '120', fixed: "right", slotName: 'handler'}
    ],
    showIndexColumn: false,
    showSelectColumn: true

}
