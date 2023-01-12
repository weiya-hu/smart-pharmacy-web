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
        <el-button type="primary" @click="changeHeader">上传新表</el-button>
        <el-button type="primary" @click="saveMatchHeader">保存</el-button>
        <el-button type="primary" @click="resetMatchHeader">重置</el-button>
        <el-button type="primary" @click="callBack">返回</el-button>
      </div>
    </div>
    <div class="container">
      <el-form :model="allHeader" label-width="15vw" ref="formRef">
        <el-table :row-class-name="rowStyle" height="90vh" :span-method="merginType" ref="multipleTable"
                  :data="allHeader.data" border style="width: 100%">
          <el-table-column label="分类" prop="type" width="150px">
          </el-table-column>
          <el-table-column label="店绩表头" prop="name">
          </el-table-column>
          <el-table-column label="企业表头">
            <template #default="{ row, $index }">
              <el-form-item :prop="`data.${$index}.excelTitle`" :rules="row.required=='y'?{
            required: true,
             message: '该选项为必选',
              trigger: 'change',
            }:null">
                <el-select @change="changeSelected" @clear="clearSelected" clearable style="width: 249px"
                           v-model="row.excelTitle">
                  <el-option v-for="(nextItem,nextIndex) in selectOption" :value="nextItem.label"
                             :label="nextItem.label"
                             :disabled="nextItem.disable"
                             :key="nextIndex"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="店绩表头定义">
            <template #default="{ row, $index }">
              <div class="desc">
                {{ row.desc }}
                <span style="color:#ff5a40">
                  {{ '(' + row.dataFormat + ')' }}
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
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
let cellList = ref([])
let count = ref(null)
onMounted(() => {
  innitBaseInfo()

})
//格式化选项状态
const formatOptionStatus = (data) => {
  return data.map(item => {
    return {
      label: item,
      disable: false
    }
  })
}
const calculateCell = (tableBody) => {
  // 循环遍历表体数据
  for (let i = 0; i < tableBody.length; i++) {
    if (i == 0) {
      cellList.value.push(1);
      count.value = 0;
    } else {
      if (tableBody[i].type == tableBody[i - 1].type) {
        cellList.value[count.value] += 1;
        cellList.value.push(0);
      } else {
        cellList.value.push(1);
        count.value = i;
      }
    }
  }

}
const rowStyle = ({row, rowIndex}) => {
  if (row.isRough) {
    return 'rough_class';
  } else {
    return ''
  }
}

const merginType = ({row, column, rowIndex, columnIndex}) => {
  if (columnIndex === 0) {
    const rowCell = cellList.value[rowIndex];
    if (rowCell > 0) {
      const colCell = 1;
      return {
        rowspan: rowCell,
        colspan: colCell,
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      };
    }
  }
}

//数据初始化
const innitBaseInfo = () => {
  isLoading.value = true
  queryProductOrderDynamicHeaderData().then(res => {
    if (res.code == 200) {
      isLoading.value = false
      if (res.data[1].length !== 0) {
        selectOption.value = formatOptionStatus(res.data[1])
      }
      matchHeaderInfo.value = res.data[2]
      allHeader.value.data = res.data[0]
      if (res.data[1].length == 0) {
        uploadRef.value.showDialog()
      } else {
        cellList.value = []
        count.value = null
        allHeader.value.data = categoriesHeader()
        calculateCell(allHeader.value.data)
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
  innitDefaultSelectedStatus()
}
//初始化默认选中的状态
const innitDefaultSelectedStatus = () => {
  let selectedArray = []
  allHeader.value.data.forEach(item => {
    if (item.excelTitle !== '') {
      if (selectOption.value.some(selectItem => {
        return selectItem.label == item.excelTitle
      })) {
        selectedArray.push(item.excelTitle)
      } else {
        item.excelTitle = ''
      }
    }
    selectOption.value.forEach(nextItem => {
      if (item.excelTitle == nextItem.label) {
        nextItem.disable = true
      }
    })
  })
  selectOption.value.forEach(item => {
    if (selectedArray.some(nextItem => {
      return nextItem == item.label
    })) {
      item.disable = true
    } else {
      item.disable = false
    }
  })
}
const sortByHeader = (newItem) => {
  return newItem.sort((item, nextItem) => {
    return Number(item.sort) - Number(nextItem.sort)
  })
}
const categoriesHeader = () => {
  let newAllHeader = []
  let newAllCategoriesIndex = new Set()
  allHeader.value.data.forEach(item => {
    newAllCategoriesIndex.add(item.type)
  })
  newAllCategoriesIndex.forEach(itemType => {
    newAllHeader.push(allHeader.value.data.filter(nextItem => {
      return nextItem.type == itemType
    }))
  })
  newAllHeader.forEach(newItem => {
    newItem = sortByHeader(newItem)
    newItem[newItem.length - 1] = {
      ...newItem[newItem.length - 1],
      isRough: true
    }
  })
  return newAllHeader.flat()
}
//清空选中
const clearSelected = () => {
  innitDefaultSelectedStatus()
}
//选中值时的回调
const changeSelected = (value) => {
  innitDefaultSelectedStatus()
}

const uploadSuccess = () => {
  resetMatchHeader()
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
//重置匹配表头
const resetMatchHeader = () => {
//将映射过的表头信息格式化到allheader当中
  matchHeaderInfo.value.forEach((item, index) => {
    allHeader.value.data.forEach(dataItem => {
      if (dataItem.objField == item.objField) {
        dataItem.excelTitle = ''
      }
    })
  })
  innitDefaultSelectedStatus()
}
//返回
const callBack = () => {
  router.push({path: '/enterpriseCenter/order'})
}
//修改表头
const changeHeader = () => {
  uploadRef.value.showDialog()
}
</script>

<style scoped lang="scss">
.container::v-deep(.el-form-item) {
  margin-bottom: 0 !important;
  padding: 15px;
}

.container::v-deep(.el-input__wrapper) {
  box-shadow: none !important;
}

.container::v-deep(.el-form-item__content) {
  margin-left: 0 !important;

}

.container::v-deep(.cell) {
  display: flex;
  justify-content: center;
  align-items: center;
}

.rough_class {
  border-bottom: 2px solid red;
  border-color: red;
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

  }

  //
  //.footer {
  //  margin-top: 100px;
  //  margin-left: 800px;
  //}

}
</style>