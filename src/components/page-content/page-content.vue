<template>
  <div class="page-content">
    <LLTable
        v-bind="contentTableConfig"
        v-model:page="pageInfo"
        :listData="dataList"
        :listCount="dataCount"
        @selectionChange=selectionCallback
    >
      <template #handler="scope">
        <!-- 根据审批状态确定操作框内的操作权限 -->
        <div class="handle-btns">
          <el-button
              size="mini"
              type="text"
          >
            查看
          </el-button>
          <el-button
              size="mini"
              type="text"
              @click="handleEditClick(scope.row)"
          >
            编辑
          </el-button>
          <el-button
              size="mini"
              type="text"
          >停用
          </el-button
          >
        </div>
      </template>

      <!-- 在page-content中动态插入剩余的插槽 -->
      <template
          v-for="item in otherPropSlots"
          :key="item.prop"
          #[item.slotName]="scope"
      >
        <template v-if="item.slotName">
          <slot :name="item.slotName" :row="scope.row"></slot>
        </template>
      </template>
    </LLTable>
  </div>
</template>

<script>
import {defineComponent, computed, ref, watch, defineExpose} from 'vue'
import LLTable from '@/baseui/table'
import {tableStore} from "@/utils/mapTableStore";
import {cloneFunction} from '@/utils/globalFunction.js'
//导入所有表格数据的pinia
/*
* 传入一个配置对象
* storeConfig：
* {
* storeName：string // 用于获取对应的store
* requestMethodName:string //通过store和请求方法名称获取对应的数据
* showDataListName:string  //用于得到store当中的数据
* countName：string //如果是存在分页的情况要获取数据列表的总长度
* }
*
*
* */
export default defineComponent({
  components: {
    LLTable
  },
  props: {
    contentTableConfig: {
      type: Object,
      require: true
    },
    storeConfig: {
      type: Object,
      required: true
    }
  },
  emits: ['editBtnClick', 'selectChoose'],
  setup(props, {emit, expose}) {
    let store = null
    store = tableStore.get(props.storeConfig.storeName)() || null
    // 2.发送网络请求
    // 1.双向绑定pageInfo
    const pageInfo = ref({currentPage: 1, pageSize: 10})
    const getPageData = (queryInfo = {}) => {
      let pramObject = {
        pageSize: pageInfo.value.pageSize,
        pageNum: pageInfo.value.currentPage,
        ...queryInfo
      }
      store[props.storeConfig.requestMethodName](pramObject)
    }
    getPageData(pageInfo)


    watch(pageInfo, () => {
      getPageData()
    })
    //搜索条件
    const searchTableList = function (query) {
      getPageData(query)
    }

    let dataList = computed(() =>
        store[props.storeConfig.showDataListName]
    )
    let dataCount = computed(() =>
        store[props.storeConfig.countName]
    )

    // 4.获取其他的动态插槽名称
    const otherPropSlots = props.contentTableConfig?.propList.filter(
        (item) => {
          if (item.slotName === 'handler') return false
          return true
        }
    )
    // // 5.删除/编辑/新建操作
    // const handleDeleteClick = (item) => {
    //   store.dispatch('system/deletePageDataAction', {
    //     pageName: props.pageName,
    //     id: item.id
    //   })
    // }

    let selectedData = ref(null)
    //复选框选中值
    const selectionCallback = function (param) {
      selectedData.value = param
      emit('selectChoose', param)
    }
    //定义函数供引用获取选中值
    const getSelectedValue = function () {
      let cloneData = cloneFunction(selectedData.value)
      selectedData.value = null
      return cloneData
    }
    const handleEditClick = (item) => {
      emit('editBtnClick', item)
    }

    expose({
      getSelectedValue,
      searchTableList
    })
    return {
      dataList,
      dataCount,
      pageInfo,
      otherPropSlots,
      // handleDeleteClick,
      handleEditClick,
      selectionCallback
    }
  }
})
</script>

<style scoped>
.page-content {
  /*padding: 20px;*/
  /*border-top: 20px solid #f5f5f5;*/
}
</style>
