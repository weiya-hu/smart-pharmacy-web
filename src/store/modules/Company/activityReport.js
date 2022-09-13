import {getBrandTop, getProductTop, getRegionSaleInfo} from '@/api/activityReport.js'

const useActivityReportStore = defineStore(
    'activityReport',
    {
        state: () => ({
            activityReportList: [],
            activityReportBrandList: [],
            activityReportProductList: [],
            activityReportAreaList: [],
            activityReportCount: 0
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
                            this.activityReportProductList = res.data
                            resolve(true)
                        }
                    })
                })
            },
            //    获取区域销售情况
            getActivityReportAreaList(data) {
                return new Promise((resolve, reject) => {
                    //    发送请求获取数据
                    getRegionSaleInfo(data).then(res => {
                        if (res.code == 200) {
                            this.activityReportAreaList = res.data
                            resolve(true)
                        }
                    })
                })
            },
        }
    })

export default useActivityReportStore
