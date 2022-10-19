<template>
  <div class="">
    <el-form v-model="queryParam" ref="queryForm" :inline="true">
      <el-form-item label="名称">
        <el-input v-model="queryParam.name" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="品类">
        <el-input v-model="queryParam.productType" placeholder="请输入商品品类"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-input v-model="queryParam.brand" placeholder="请输入商品品牌"></el-input>
      </el-form-item>
      <el-form-item label="规格">
        <el-input v-model="queryParam.specification" placeholder="请输入商品规格"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="productList" height="270">
      <el-table-column label="编码" prop="code" show-overflow-tooltip/>
      <el-table-column label="名称" prop="name" show-overflow-tooltip min-width="135px"/>
      <el-table-column label="品类" prop="productType" show-overflow-tooltip/>
      <el-table-column label="品牌" prop="brand" show-overflow-tooltip/>
      <el-table-column label="规格" prop="specification" show-overflow-tooltip min-width="135px"/>
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
    <el-divider content-position="left">已选择产品</el-divider>
    <div class="handler">
      <el-button @click="clearSelected" link type="primary" v-if="props.handleType !== 'query'">清空已选</el-button>
    </div>
    <el-table v-loading="loading" :data="productResultList" height="150">
      <el-table-column label="编码" prop="code" show-overflow-tooltip/>
      <el-table-column label="名称" prop="name" show-overflow-tooltip min-width="100px"/>
      <el-table-column label="品类" prop="productType" show-overflow-tooltip/>
      <el-table-column label="品牌" prop="brand" show-overflow-tooltip/>
      <el-table-column label="规格" prop="specification" show-overflow-tooltip min-width="120px"/>
      <el-table-column label="数量" align="center">
        <template #default="scope">
          <el-input type="number" size="small" v-model.number="scope.row.account" min="1"></el-input>
        </template>
      </el-table-column>
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
import {queryProductList} from '@/api/activity/activityProduct'
import {
  queryEventRuleInfo
} from '@/api/activity/eventInfo'
import {cloneFunction} from "../../utils/globalFunction";

let currentPageData = ref([])
let selectProductId = ref([])
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
const productList = ref(props.productIds)
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
  productResultList.value.forEach(item => {
    productList.value.push(item)
  })
  productResultList.value = []
  selectProductId.value = []
}
//搜索产品
const getList = () => {
  if (props.eventId) {
    queryParam.value.eventId = props.eventId
    currentPageData.value = []
    queryProductList(queryParam.value).then(res => {
      if (res.code === 200) {
        currentPageData.value = cloneFunction(res.data.list)
        productList.value = res.data.list
        total.value = Number(res.data.total)
        if (selectProductId.value.length > 0) {
          selectProductId.value.forEach(item => {
            let exists = productList.value.filter(f => item === f.productId)
            exists.forEach(e => {
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
  let selectedInfo = null
  productList.value.splice(productList.value.indexOf(row), 1)
  let isExists = productResultList.value.some(r => r.productId === row.productId)
  if (productResultList.value.length !== 0) {
    selectedInfo = productResultList.value.find(R => {
      return R.productId == row.productId
    })
  }
  if (!isExists) {
    if (selectedInfo) {
      row.account = selectedInfo.account
    } else {
      row.account = 1
    }
    productResultList.value.push(row)
  }

}
//删除商品
const handleDelete = (row) => {
  let index = productResultList.value.indexOf(row);
  if (index !== -1) {
    productResultList.value.splice(index, 1)
  }
  if (currentPageData.value.findIndex(item => {
    return item.productId == row.productId
  }) !== -1) {
    productList.value.push(row)
  }
  //删除对应选中id
  let deleteIndex = selectProductId.value.findIndex(item =>
      item == row.productId
  )
  if (deleteIndex !== -1) {
    selectProductId.value.splice(deleteIndex, 1)
  }
  if (productResultList.value.length == 0) {
    clearSelected()
  }
}
//获取已选择商品
const getProductPackageResultList = () => {
  return productResultList.value.map(item => ({
    ...cloneFunction(item)
  }))
}
const getProductResultList = () => {
  return productResultList.value.map(item => ({account: 1, ...cloneFunction(item)}))
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
  productIds: {
    type: Array,
    default: []
  },
  handleType: {
    type: String,
    default: undefined
  },
  selectedGoodsAccount: {
    type: Array,
    default: []
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

const getSelect = () => {
  productResultList.value = props.selectedGoodsAccount
  selectProductId.value = props.productIds
}
defineExpose({
  getProductResultList,
  getProductPackageResultList

})
// getSelectedGoods()
getList()
getSelect()
</script>

<style scoped lang="scss">
.handler {
  margin: 10px 0;
  display: flex;
  justify-content: flex-end;
}
</style>
