import {
    getAutotrophicTaskActiveList,
    getRelationShipTreeNode,
    getRelationShipTreeList,
    getRelationShipTreeNodeDetail,
    getActiveTaskDetail
} from '@/api/autotrophicTask.js'

const useAutotrophicTaskStore = defineStore(
    'autotrophicTask',
    {
        state: () => ({
            'AutotrophicTaskList': [],
            'AutotrophicTaskCount': 0,
            'ActiveTaskDetail': {},
            //    关系树节点
            "relationTreeNode": []
        }),
        actions: {
            // 获取自营任务列表
            getAutotrophicTaskTableList() {
                return new Promise((resolve, reject) => {
                    getAutotrophicTaskActiveList().then((res) => {
                        if (res.code == 200) {
                            let {data} = res
                            //数据条数
                            this.AutotrophicTaskCount = data.total
                            //当前页数据的详细信息
                            this.AutotrophicTaskList = data.list
                        }
                    })
                })
            },
            //获取任务详情
            getAutotrophicTaskDetail(data) {
                return new Promise((resolve, reject) => {
                    getActiveTaskDetail(data).then((res) => {
                        if (res.code == 200) {
                            let {data} = res
                            this.ActiveTaskDetail = data
                            resolve(true)
                        }
                    })
                })
            },

            //获取激励负责人treeNode和激励参与人的treeNode

            //   获取激励范围的treeNode
            getTreeNode(data) {
                return new Promise((resolve, reject) => {
                    getRelationShipTreeNode(data).then((res) => {
                        if (res.code == 200) {
                            let {data} = res
                            this.relationTreeNode = data
                            resolve(true)
                        }
                    })
                })
            },

        }
    })

export default useAutotrophicTaskStore
