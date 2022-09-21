<template>
  <div class="outBox" v-loading="isLoading">
    <div class="header">
      <div class="desc">
        <span>请把您需要导入的表的表头与系统的标准表头名关联起来，系统用以判定对应的数据代表的意义。</span>
        <span
            style="color:#ff5a40">“门店销售单号”，“商户内部的订单详情ID” 均用于判定导入的数据是否重复，请至少关联其中1个。</span>
      </div>
      <div>
        <el-button type="primary" @click="changeHeader">修改我的表头</el-button>
        <el-button type="primary" @click="saveMatchHeader">保存</el-button>
        <el-button @click="comeBack">返回</el-button>
      </div>
    </div>
    <div class="container">
      <template v-for="(item,index) in dataList" :key="index">
        <div class="itemInfo">
          <div class="title">
            {{ item.excelTitle }}
          </div>
          <div class="select">
            <el-select @change="((item)=>{changeOption(item,index)})" style="width: 300px" :model-value="item.name">
              <el-option v-for="(nextItem,nextIndex) in selectOption" :value="nextItem" :label="nextItem.name"
                         :key="nextIndex"></el-option>
            </el-select>
          </div>
          <div class="desc">
            {{ item.desc }}
          </div>
        </div>
      </template>

    </div>
    <div class="footer">

    </div>
  </div>


</template>
<script setup>
import {getMapping, setConvertMapping, queryProductOrderDynamicHeaderData} from "@/api/system/order";
import {onMounted} from "vue";
import {ElMessage} from "element-plus";
import router from "@/router";

let isLoading = ref(false)
let dataList = ref([])
let selectOption = ref([])
const changeOption = (item, index) => {
  dataList.value[index].desc = item.desc
  dataList.value[index].objField = item.field
  dataList.value[index].name = item.name
}
onMounted(() => {
  innitCacheData()
  getHeaderTitle()
})
//初始化缓存数据
const innitCacheData = () => {
  let cacheData = JSON.parse(localStorage.getItem("headerTitle"))
  if (cacheData && cacheData.length !== 0) {
    dataList.value = cacheData.map(item => {
      return {
        excelTitle: item,
        objField: '',
        desc: '',
        name: '',
      }
    })
  }
}
const getHeaderTitle = () => {
  queryProductOrderDynamicHeaderData().then(res => {
    if (res.code == 200) {
      let cacheData = JSON.parse(localStorage.getItem("headerTitle"))
      if (!cacheData && res.data.length == 0) {
        changeHeader()
      } else {
        innitHeader(res.data)
      }
    }
  })
}
const innitHeader = (data) => {
  innitDataList(data)
}
const innitDataList = (data) => {
  let cacheData = JSON.parse(localStorage.getItem("headerTitle"))
  if (!cacheData && data.length !== 0) {
    dataList.value = data.map(item => {
      return {
        excelTitle: item.excelTitle,
        objField: '',
        desc: '',
        name: '',
      }
    })
  }
  //初始化回显数据
  if (data.length !== 0) {
    data.forEach((item, index) => {
      dataList.value.forEach(dataItem => {
        if (dataItem.excelTitle == item.excelTitle) {
          dataItem.objField = item.objField
          dataItem.name = item.name
          dataItem.desc = item.desc
        }
      })
    })
  }
}
const innitData = (data) => {
  selectOption.value = data.map(item => {
    return {
      name: item.name,
      field: item.field,
      desc: item.desc
    }
  })
}

const onLoad = () => {
//  加载映射数据
  isLoading.value = true
  getMapping().then(res => {
    if (res.code == 200) {
      innitData(res.data)
      isLoading.value = false
    }
  })
}

//提交表头映射
const saveMatchHeader = () => {
  setConvertMapping(dataList.value).then(res => {
    if (res.code == 200) {
      ElMessage({type: 'success', message: res.msg})
      localStorage.removeItem("headerTitle")
    }
  }, rej => {
    ElMessage({type: 'warning', message: res.msg})
  })

}
//返回
const comeBack = () => {
  router.push({path: '/enterpriseCenter/order'})
}
//修改表头
const changeHeader = () => {
  router.push({path: '/enterpriseCenter/order/customizeImportFirst'})
}
onLoad()

</script>

<style scoped lang="scss">
.outBox {
  padding: 40px;

  .desc {
    color: #999;
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: 400;
  }

  .header {
    display: flex;
    justify-content: space-between;
  }

  .container {
    margin-top: 50px;

    .itemInfo {
      margin: 15px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      //border-bottom: 1px solid #d8dce5;
      padding: 5px;

      .title {
        width: 30vw;
      }

      .select {
        width: 30vw;
      }

      .desc {
        width: 40vw;
      }

    }
  }

  //.footer {
  //  margin-top: 100px;
  //  margin-left: 800px;
  //}

}
</style>