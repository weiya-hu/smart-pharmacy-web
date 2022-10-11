import {getProductMulti, getBrandMulti, getStoreMulti} from "@/api/salesReport/salesBI.js"

const formatDataInfo = (data) => {
    return data.map(item => {
        //格式化小数点位数，计算同比环比增长率
        let {avgMoney, maxMoney, monthOnMonth, sumMoney, yearOnYear, proportion, shelfSalesRatio} = item
        let formatPointData = formatDecimalPoint({avgMoney, maxMoney, sumMoney}, 2)
        return Object.assign(item, formatPointData)
    })

}

const formatDecimalPoint = (data, num) => {
    if (data instanceof Object) {
        Object.keys(data).forEach(item => {
            data[item] = data[item].toFixed(num)
        })
        return data
    }

}
const useSalesReport = defineStore(
    'salesReport',
    {
        state: () => ({
            productMulti: [],
            brandMulti: [],
            storeMulti: [],
            salesReportCount: 0
        }),
        actions: {
            // 获取自营任务列表
            getSalesReportTableList() {
                return new Promise((resolve, reject) => {
                    //    发送请求获取数据
                    console.log("请求数据")
                })
            },
            // 获取大区列表数据
            getSalesAreaTableList() {
                return new Promise((resolve, reject) => {
                    //    发送请求获取数据
                    console.log("请求数据")
                })
            },
            // 获取省级片区列表数据
            getSalesProvinceTableList() {
                return new Promise((resolve, reject) => {
                    //    发送请求获取数据
                    console.log("请求数据")
                })
            },
            // 获取市级列表数据
            getSalesCityTableList(data) {
                return new Promise((resolve, reject) => {
                    //    发送请求获取数据
                    console.log("请求数据")
                })
            },
            // 获取门店列表数据
            getSalesStoreTableList(data) {
                return new Promise((resolve, reject) => {
                    getStoreMulti(data).then(res => {
                        if (res.code == 200) {
                            //数据格式化
                            this.storeMulti = formatDataInfo(res.data)
                            resolve(true)
                        }
                    })
                })
            },
            // 获取品牌列表数据
            getSalesBrandTableList(data) {
                return new Promise((resolve, reject) => {
                    getBrandMulti(data).then(res => {
                        if (res.code == 200) {
                            this.brandMulti = formatDataInfo(res.data)
                            resolve(true)
                        }
                    })
                })
            },
            // 获取单品列表数据
            getSalesProductTableList(data) {
                return new Promise((resolve, reject) => {
                    getProductMulti(data).then(res => {
                        if (res.code == 200) {
                            this.productMulti = formatDataInfo(res.data)
                            resolve(true)
                        }
                    })
                })
            },

        }
    })

export default useSalesReport
