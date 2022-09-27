<template>
  <div class="app-container">
    <el-form v-model="queryParam" ref="queryForm" label-width="50px">
      <el-row>
        <el-form-item label="名称">
          <el-input v-model="queryParam.name"></el-input>
        </el-form-item>
        <el-form-item label="品类">
          <el-input v-model="queryParam.productType"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model="queryParam.brand"></el-input>
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="queryParam.specification"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table v-loading="loading" :data="productList" height="200">
      <el-table-column label="名称" prop="name"/>
      <el-table-column label="品类" prop="productType"/>
      <el-table-column label="品牌" prop="brand"/>
      <el-table-column label="规格" prop="specification" show-overflow-tooltip/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button type="text" @click="handleAdd(scope.row)">添加</el-button>
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
    <el-divider content-position="left">已选择产品</el-divider>
    <div class="handler">
      <el-button @click="clearSelected" link type="primary">清空已选</el-button>
    </div>
    <el-table v-loading="loading" :data="productResultList" height="200">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="名称" prop="name"/>
      <el-table-column label="品类" prop="productType"/>
      <el-table-column label="品牌" prop="brand"/>
      <el-table-column label="规格" prop="specification" show-overflow-tooltip/>
      <el-table-column label="数量" align="center">
        <template #default="scope">
          <el-input type="number" v-model.number="scope.row.account"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import {queryProductList} from '@/api/activity/activityProduct'
import {
  queryEventRuleInfo
} from '@/api/activity/eventInfo'

let queryParam = ref({
  name: '',
  productType: '',
  specification: '',
  brand: '',
  pageNum: 1,
  pageSize: 10,
  eventId: '',
})
const loading = ref(false)
const productList = ref([])
const total = ref(0)
const queryForm = ref()
const productResultList = ref([])
//搜索产品
const handleQuery = () => {
  queryParam.pageNum = 1
  getList()
}
//重置搜索参数
const restQueryParam = () => {
  queryParam.value = {
    name: '',
    productType: '',
    specification: '',
    brand: '',
    pageNum: 1,
    pageSize: 10,
    eventId: '',
  }
}
//清空已选择商品
const clearSelected = () => {
  productResultList.value = []
  getList()
}
//搜索产品
const getList = () => {
  if (props.eventId) {
    queryParam.value.eventId = props.eventId
    queryProductList(queryParam.value).then(res => {
      if (res.code === 200) {
        productList.value = res.data.list
        total.value = Number(res.data.total)
        if(props.productIds.length >0){
          props.productIds.forEach(item=>{
           let exists = productList.value.filter(f=> item === f.eventProductId)
            exists.forEach(e=>{
              handleAdd(e)
            })
          })
        }
      }
    })
  }
}

//重置搜索
const resetQuery = () => {
  restQueryParam()
  queryForm.value.resetFields()
  getList()
}
//选择商品
const handleAdd = (row) => {
  productList.value.splice(productList.value.indexOf(row), 1)
  let isExists = productResultList.value.some(r => r.productId === row.productId)
  if (!isExists) {
    row.account = 1
    productResultList.value.push(row)
  }
}
//删除商品
const handleDelete = (row) => {
  let index = productResultList.value.indexOf(row);
  if (index !== -1) {
    productResultList.value.splice(index, 1)
  }
  productList.value.push(row)
}
//获取已选择商品
const getProductPackageResultList = () => {
  return productResultList.value.map(item => ({
    account: item.account,
    eventProductId: item.eventProductId,
    packageId: props.packageId
  }))
}
const getProductResultList = () => {
  return productResultList.value.map(item => ({account: item.account, eventProductId: item.eventProductId}))
}
const props = defineProps({
  eventId: {
    type: String,
    default: undefined
  },
  packageId: {
    type: Number,
    default: NaN
  },
  eventRuleId: {
    type: String,
    default: null
  },
  productIds:{
    type:Array,
    default:[]
  }
})
// const getSelectedGoods = () => {
//   if (props.eventRuleId) {
//     //  获取规则详情
//     queryEventRuleInfo(props.eventRuleId).then(res => {
//       if (res.code == 200) {
//
//       }
//     })
//   }
// }
// watch(props.eventRuleId, () => {
//   getSelectedGoods()
// })


defineExpose({
  getProductResultList,
  getProductPackageResultList

})
// getSelectedGoods()
getList()
// getSelect()
</script>

<style scoped lang="scss">
.app-container {
  .handler {
    margin: 10px 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
