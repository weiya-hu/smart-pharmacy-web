<template>
  <div class="">
    <el-form v-model="queryParam" ref="queryForm" :inline="true">
      <el-form-item label="门店名称">
        <el-input v-model="queryParam.name" placeholder="请输入门店名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="storeList" height="270">
      <el-table-column label="门店编号" prop="storeId"/>
      <el-table-column label="门店名称" prop="name" show-overflow-tooltip min-width="150px"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width"
                       v-if="props.handleType !== 'query'">
        <template #default="scope">
          <div class="btn-col">
            <el-button type="text" @click="handleAdd(scope.row)">添加</el-button>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <span>暂无可选择数据</span>
      </template>
    </el-table>
    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParam.pageNum"
        v-model:limit="queryParam.pageSize"
        @pagination="getList"
    />
    <el-divider content-position="left">已选择门店</el-divider>
    <div class="handler" v-if="props.handleType !== 'query'">
      <el-button @click="cleanAllStore" link type="primary">清空已选</el-button>
    </div>
    <el-table v-loading="loading" :data="storeResultList" height="200">
      <el-table-column label="门店编号" prop="id"/>
      <el-table-column label="门店名称" prop="name" show-overflow-tooltip min-width="150px"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width"
                       v-if="props.handleType !== 'query'">
        <template #default="scope">
          <div class="btn-col">
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import {queryStoreList} from '@/api/activity/activityProduct'
import {cloneFunction} from "../../utils/globalFunction";

const queryParam = ref({
  name: '',
  productTypes: '',
  specifications: '',
  brands: '',
  pageNum: 1,
  pageSize: 10,
  eventId: '',
})
const loading = ref(false)
const storeList = ref([])
const total = ref(0)
const queryForm = ref()
let storeResultList = ref([])
//搜索产品
const handleQuery = () => {
  queryParam.pageNum = 1
  getList()
}

//搜索产品
const getList = () => {
  if (props.eventId) {
    queryStoreList(props.eventId, {
      pageNum: queryParam.value.pageNum,
      pageSize: queryParam.value.pageSize,
      keyword: queryParam.value.name
    }).then(res => {
      if (res.code === 200) {
        total.value = Number(res.data.total)
        storeList.value = res.data.list
        storeResultList.value = cloneFunction(props.selectedInfo)
        let obj = storeList.value.filter(item => props.filterIds.indexOf(item.storeId) > -1)
        obj.forEach(items => {
          handleAdd(items)
        })
      }
    })
  }
}

//清空全部门店
const cleanAllStore = () => {
  storeResultList.value.forEach(item => {
    storeList.value.push(item)
  })
  storeResultList.value = []

}


//重置搜索
const resetQuery = () => {
  queryForm.value.resetFields()
  getList()
}
//选择门店
const handleAdd = (row) => {
  storeList.value.splice(storeList.value.indexOf(row), 1)
  let isExists = storeResultList.value.some(r => r.id === row.storeId)
  if (!isExists) {
    row.account = 1
    row.id = row.storeId
    storeResultList.value.push(row)
  }
}
//删除门店
const handleDelete = (row) => {
  let index = storeResultList.value.indexOf(row);
  if (index !== -1) {
    storeResultList.value.splice(index, 1)
  }
  storeList.value.push(row)
}
//获取已选择门店id
const getStoreResultList = () => {
  return storeResultList.value.map(item => (item.storeId))
}
//获取已选中的门店
const getStoreResultListInfo = () => {
  return storeResultList.value
}

const props = defineProps({
  eventId: {
    type: String,
    default: undefined
  },
  filterIds: {
    type: Array,
    default: []
  },
  handleType: {
    type: String,
    default: undefined
  },
  selectedInfo: {
    type: Array,
    default: []
  }
})

defineExpose({
  getStoreResultList,
  getStoreResultListInfo,
  getList
})

getList()
</script>

<style scoped lang="scss">
.handler {
  margin: 10px 0;
  display: flex;
  justify-content: flex-end;
}
</style>
