const useRolePermission = defineStore(
    'rolePermission',
    {
        state: () => ({
            //角色
            roleList: [
                {
                    name: "系统管理员",
                    roleDesc: "系统的全权限管理员",
                    status: true
                },
                {
                    name: "负责人",
                    roleDesc: "拥有系统管理员相同的权限",
                    status: false
                },
                {
                    name: "店长",
                    roleDesc: "负责店铺角色管理，数据管理",
                    status: true
                },
            ],
            //人员
            peopleList: [
                {
                    name: "石太平",
                    branch: "山海平 - 销售一部",
                    role: '店长',
                    roleStatus: 1
                },
                {
                    name: "梁以",
                    branch: "山海平 - 销售一部",
                    role: '储备店长',
                    roleStatus: 0
                },
                {
                    name: "唐安位",
                    branch: "山海平 - 销售一部",
                    role: '店员',
                    roleStatus: 1
                },
            ],
            //角色数据总数
            roleCount: 0,
            //    人员数据总数
            peopleCount: 0,
            //营销报表
            marketingReportList: [
                {
                    rulesName: "个人",
                    desc: "只能操作自己的数据"
                },
                {
                    rulesName: "所属机构",
                    desc: "能操作自己、下属人员、和操作人所属机构的数据"
                },
                {
                    rulesName: "所属机构及下属机构",
                    desc: "能操作自己、下属人员、和操作人所属机构及其子机构的数据"
                },
                {
                    rulesName: "全局",
                    desc: "能操作全局数据"
                },
            ],
            marketingReportCount: 4
        }),
        actions: {
            // 获取角色列表
            getRoleTableList() {
                return new Promise((resolve, reject) => {
                    //    发送请求获取数据
                    console.log("请求数据")
                })
            },
            // 获取人员列表
            getPeopleTableList() {
                return new Promise((resolve, reject) => {
                    //    发送请求获取数据
                    console.log("请求数据")
                })
            },
            // 获取人员列表
            getMarketingReportTableList() {
                return new Promise((resolve, reject) => {
                    //    发送请求获取数据
                    console.log("请求数据")
                })
            },

        }
    })

export default useRolePermission
