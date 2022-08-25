
const useActivityReportStore = defineStore(
    'activityReport',
    {
        state: () => ({
            activityReportList: [
                {
                    productName: '酒精',
                    sales: '2000000',
                    salesRatio: "40%",
                    yearOnYear: '10%',
                    chainRatio: '5%',
                    isUp: false
                },
                {
                    productName: '酒精',
                    sales: '2000000',
                    salesRatio: "40%",
                    yearOnYear: '10%',
                    chainRatio: '5%',
                    isUp: true
                },
                {
                    productName: '酒精',
                    sales: '2000000',
                    salesRatio: "40%",
                    yearOnYear: '10%',
                    chainRatio: '5%',
                    isUp: true
                }, {
                    productName: '酒精',
                    sales: '2000000',
                    salesRatio: "40%",
                    yearOnYear: '10%',
                    isUp: true,
                    chainRatio: '5%'
                },


                {
                    isUp: true,
                    productName: '酒精',
                    sales: '2000000',
                    salesRatio: "40%",
                    yearOnYear: '10%',
                    chainRatio: '5%'

                },
                {
                    isUp: true,
                    productName: '酒精',
                    sales: '2000000',
                    salesRatio: "40%",
                    yearOnYear: '10%',
                    chainRatio: '5%'
                },
                {
                    isUp: true,
                    productName: '酒精',
                    sales: '2000000',
                    salesRatio: "40%",
                    yearOnYear: '10%',
                    chainRatio: '5%'
                },
                {
                    isUp: true,
                    productName: '酒精',
                    sales: '2000000',
                    salesRatio: "40%",
                    yearOnYear: '10%',
                    chainRatio: '5%'
                },
                {
                    isUp: false,
                    productName: '酒精',
                    sales: '2000000',
                    salesRatio: "40%",
                    yearOnYear: '10%',
                    chainRatio: '5%'
                },
                {
                    isUp: false,
                    productName: '酒精',
                    sales: '2000000',
                    salesRatio: "40%",
                    yearOnYear: '10%',
                    chainRatio: '5%'
                }, {
                    isUp: false,
                    productName: '酒精',
                    sales: '2000000',
                    salesRatio: "40%",
                    yearOnYear: '10%',
                    chainRatio: '5%'
                },

            ],
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

        }
    })

export default useActivityReportStore
