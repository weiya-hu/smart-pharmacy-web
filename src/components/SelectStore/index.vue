<template>
  <div class="app-container">
    <el-form v-model="queryParam" ref="queryForm" label-width="70px">
      <el-row>
        <el-form-item label="门店名称">
          <el-input v-model="queryParam.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <el-table v-loading="loading" :data="storeList" height="250">
      <el-table-column label="门店编号" prop="storeId"/>
      <el-table-column label="门店名称" prop="name" show-overflow-tooltip/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button type="text" @click="handleAdd(scope.row)">添加</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParam.pageNum"
        v-model:limit="queryParam.pageSize"
        @pagination="getList"
    />
    <el-divider content-position="left">已选择产品</el-divider>
    <el-table v-loading="loading" :data="storeResultList" height="250">
      <el-table-column label="门店编号" prop="storeId"/>
      <el-table-column label="门店名称" prop="name" show-overflow-tooltip/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import {queryStoreList} from '@/api/activity/activityProduct'

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
const storeResultList = ref([])
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
    })
        .then(res => {
          if (res.code === 200) {
            storeList.value = res.data.list
            total.value = Number(res.data.total)
          }
        })
  }
}

//重置搜索
const resetQuery = () => {
  queryForm.value.resetFields()
  getList()
}
//选择门店
const handleAdd = (row) => {
  let isExists = storeResultList.value.some(r => r.storeId === row.storeId)
  if (!isExists) {
    row.account = 1
    storeResultList.value.push(row)
  }
}
//删除门店
const handleDelete = (row) => {
  let index = storeResultList.value.indexOf(row);
  if (index !== -1) {
    storeResultList.value.splice(index, 1)
  }
}
//获取已选择门店
const getStoreResultList = () => {
  return storeResultList.value.map(item => (item.storeId))
}

const props = defineProps({
  eventId: {
    type: String,
    default: undefined
  },
})

defineExpose({
  getStoreResultList,
})

getList()
</script>

<style scoped>

</style>
