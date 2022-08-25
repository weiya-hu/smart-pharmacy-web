const useSalesWriteOff = defineStore(
    'salesWriteOff',
    {
        state: () => ({
            //角色
            SalesWriteOffList: [
                {
                    time: "2022-7-30",
                    orderCode: '15665',
                    goodsCode: 'sasd-aas566',
                    size: '300',
                    sales: 200,
                    price: 32,
                    actualPrice: 25,
                    writeOff: '是',
                    reimburse: '否'
                },
                {
                    time: "2022-7-30",
                    orderCode: '15665',
                    goodsCode: 'sasd-aas566',
                    size: '300',
                    sales: 200,
                    price: 32,
                    actualPrice: 25,
                    writeOff: '是',
                    reimburse: '否'
                },
            ],
            SalesWriteOffCount: 2,
        }),
        actions: {
            // 获取通讯录人员列表
            getSalesWriteOffTableList() {
                return new Promise((resolve, reject) => {
                    //    发送请求获取数据
                    console.log("请求数据")
                })
            },


        }
    })

export default useSalesWriteOff
