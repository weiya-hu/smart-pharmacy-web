import {getBrandTop, getProductTop, getRegionSaleInfo} from '@/api/activityReport.js'
import {getCurrentInstance} from "vue";
import {cloneFunction} from "../../../utils/globalFunction";

const useActivityReportStore = defineStore(
    'activityReport',
    {
        state: () => ({
            activityReportList: [],
            activityReportBrandList: [],
            activityReportProductList: [],
            activityReportAreaList: [],
            activityReportAreaListToTree: [],
            //存储所有数据
            allData: [],
            //存在展示第一层的选项数据
            firstSelectOption: [],
            activityReportCount: 0,
            checkedArray: [],
            allSort: []
        }),
        actions: {
            // 获取自营任务列表
            getActivityReportTableList() {
                return new Promise((resolve, reject) => {
                    //    发送请求获取数据
                    console.log("请求数据")
                })
            },
            // 获取品牌销售列表
            getActivityReportBrandList(data) {
                return new Promise((resolve, reject) => {
                    //    发送请求获取数据
                    getBrandTop(data).then(res => {
                        if (res.code == 200) {
                            this.activityReportBrandList = res.data
                            resolve(true)
                        }
                    })
                })
            },
            // 获取单品销售列表
            getActivityReportProductList(data) {
                return new Promise((resolve, reject) => {
                    //    发送请求获取数据
                    getProductTop(data).then(res => {
                        if (res.code == 200) {

                            this.activityReportProductList =res.data
                            resolve(true)
                        }
                    })
                })
            },
            //    获取区域销售情况
            getActivityReportAreaList(data, proxy) {
                return new Promise((resolve, reject) => {
                    //    发送请求获取数据
                    getRegionSaleInfo(data).then(res => {
                        res.data.forEach(item => {
                            if (item.sort == 2) {
                                this.firstSelectOption = item.saleList.map(nextItem => {
                                    let newItem = cloneFunction(nextItem)
                                    newItem.label = newItem.name
                                    newItem.value = newItem.nodeId
                                    return newItem
                                })
                            }
                        })
                        if (res.code == 200) {
                            this.allSort = res.data.map(item => {
                                return item.sort
                            })
                            res.data.forEach(item => {
                                item.saleList.forEach(nextItem => {
                                    nextItem.sort = item.sort
                                })
                            })
                            this.activityReportAreaList = res.data.filter(item => {
                                return item.sort > 1
                            })
                            this.allData = this.activityReportAreaList.map(item => {
                                return item.saleList
                            }).flat()
                            this.activityReportAreaListToTree = proxy.handleTree(this.allData, "nodeId", "parentNodeId");
                            // this.allData = res.data.map(item => {
                            //     return item.saleList
                            // }).flat()
                            // this.activityReportAreaListToTree = proxy.handleTree(this.allData, "nodeId", "parentNodeId");
                            resolve(true)
                        }
                    })
                })
            },
            //    过滤要展示的区域数据
            filterShowData(node, proxy) {
                this.checkedArray = []
                const checked = this.allData.find(item => {
                    return item.nodeId == node.value
                })
                this.getItemChildren(this.checkedArray, this.allData, checked)
                this.checkedArray.push(checked)
                this.proShowArray(this.checkedArray)

            },
            getItemChildren(res, source, item) {
                // 递归出口
                if (item.children === null) {
                    return res
                }
                const childNode = source.filter((childItem) => {
                    if (childItem.parentNodeId === item.nodeId) {
                        return childItem
                    }
                })
                if (childNode.length === 0) {
                    return res
                } else {
                    childNode.forEach((node) => res.push(node))
                    childNode.forEach((node) => {
                        this.getItemChildren(res, this.allData, node)
                    })
                }
            },
            proShowArray(dataArray) {
                let lastArray = []
                this.allSort.forEach((num, index) => {
                    if (num > 1) {
                        let obj = {
                            sort: num,
                            saleList: []
                        }
                        obj.saleList = dataArray.filter(item => {
                            return item.sort == num
                        })
                        lastArray[index - 1] = obj
                    }
                })
                this.activityReportAreaList = lastArray
            }


        }
    })

export default useActivityReportStore
