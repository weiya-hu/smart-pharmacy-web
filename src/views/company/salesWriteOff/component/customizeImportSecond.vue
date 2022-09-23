<template>
  <div class="outBox" v-loading="isLoading">
    <div class="header">
      <customizeImportFirst @uploadSuccess="uploadSuccess" ref="uploadRef"/>
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
      <el-form :model="allHeader" label-width="15vw" ref="formRef">
        <template v-for="(itemHeader,index) in allHeader.data">
          <el-form-item class="label" :label="itemHeader.name" :prop="'data.'+index+'.excelTitle'" :rules="itemHeader.required=='y'?{
            required: true,
             message: '该选项为必选',
              trigger: 'change',
            }:null">
            <div class="labelInfo">
              <el-select clearable style="width: 300px" v-model="itemHeader.excelTitle">
                <el-option v-for="(nextItem,nextIndex) in selectOption" :value="nextItem" :label="nextItem"
                           :key="nextIndex"></el-option>
              </el-select>
              <div class="desc">
                {{ itemHeader.desc }}
              </div>
            </div>
          </el-form-item>
        </template>
      </el-form>

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
import customizeImportFirst from './customizeImportFirst'

let isLoading = ref(false)
let dataList = ref([])
let selectOption = ref([])
let matchHeaderInfo = ref([])
let allHeader = ref({data: []})
let uploadRef = ref()
const formRef = ref()
onMounted(() => {
  innitBaseInfo()
})
//数据初始化
const innitBaseInfo = () => {
  isLoading.value = true
  queryProductOrderDynamicHeaderData().then(res => {
    if (res.code == 200) {
      isLoading.value = false
      let cacheHeaderOption = JSON.parse(localStorage.getItem("headerTitle"))
      if (cacheHeaderOption) {
        selectOption.value = cacheHeaderOption
      }
      if (!cacheHeaderOption && res.data[1].length !== 0) {
        selectOption.value = res.data[1]
      }
      matchHeaderInfo.value = res.data[2]
      allHeader.value.data = res.data[0]
      console.log(res.data[1].length, cacheHeaderOption)
      if (res.data[1].length == 0 && !cacheHeaderOption) {
        // router.push({path: '/enterpriseCenter/order/customizeImportFirst'})
        uploadRef.value.showDialog()
      } else {
        formatBaseInfo()
      }
    }
  }, rej => {
    ElMessage.error(rej.message)
  })
}

//如果上传的header长度不为零格式化基础信息
const formatBaseInfo = () => {
//在allheader当中新增字段名称objField 值为field 初始化一个excelTitle值为空
  allHeader.value.data.forEach(item => {
    item.objField = item.field
    item.excelTitle = ''
  })
//将映射过的表头信息格式化到allheader当中
  matchHeaderInfo.value.forEach((item, index) => {
    allHeader.value.data.forEach(dataItem => {
      if (dataItem.objField == item.objField) {
        dataItem.excelTitle = item.excelTitle
      }
    })
  })

}
const uploadSuccess = () => {
  innitBaseInfo()
}

//提交表头映射
const saveMatchHeader = async () => {
  let isSend = await formRef.value.validate()
  if (isSend) {
    setConvertMapping(allHeader.value.data).then(res => {
      if (res.code == 200) {
        ElMessage({type: 'success', message: res.msg})
      }
    }, rej => {
      ElMessage({type: 'warning', message: res.msg})
    })
  }
}
//返回
const comeBack = () => {
  router.push({path: '/enterpriseCenter/order'})
}
//修改表头
const changeHeader = () => {
  uploadRef.value.showDialog()
  // router.push({path: '/enterpriseCenter/order/customizeImportFirst'})
}
// onLoad()

</script>

<style scoped lang="scss">
.label::v-deep( .el-form-item__label) {
  color: #606266;
  font-weight: 600;
  justify-content: flex-start !important;
}

.label::v-deep(.el-form-item__error) {
  margin-left: 10vw;
}

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

    .labelInfo {
      padding: 0 10vw;
      flex: 1;
      display: flex;

      .desc {
        width: 40vw;
        margin-left: 10vw;
      }
    }

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