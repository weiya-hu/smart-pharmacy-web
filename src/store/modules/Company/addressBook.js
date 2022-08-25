const useAddressBook = defineStore(
    'addressBook',
    {
        state: () => ({
            //角色
            addressBookList: [
                {
                    name:'石太平',
                    job:'店长',
                    branch:'小十字店',
                    phone:'13322563866',
                    mailbox:'shitaiping@s...'
                },
                {
                    name:'梁毅',
                    job:'店员',
                    branch:'小十字店',
                    phone:'17733264577',
                    mailbox:'liangyi@shan...'
                },
            ],
            addressBookCount: 3,
        }),
        actions: {
            // 获取通讯录人员列表
            getAddressBookTableList() {
                return new Promise((resolve, reject) => {
                    //    发送请求获取数据
                    console.log("请求数据")
                })
            },


        }
    })

export default useAddressBook
