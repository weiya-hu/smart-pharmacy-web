<!--        v-model:page="pageInfo"-->
<template>
  <div class="page-content">
    <LTable
        v-bind="contentTableConfig"
        :listData="dataList"
        :listCount="dataCount"
    >
      <template #slotEmpty>
        <slot name="slotEmpty">

        </slot>
      </template>
      <template #handler="scope">
        <!-- 根据审批状态确定操作框内的操作权限 -->
        <div class="handle-btns">
          <el-button
              icon="el-icon-edit"
              size="mini"
              type="text"
          >
            查看
          </el-button>
          <el-button
              icon="el-icon-edit"
              size="mini"
              type="text"
          >
            编辑
          </el-button>
          <el-button
              icon="el-icon-delete"
              size="mini"
              type="text"
          >停用
          </el-button
          >
        </div>
      </template>

      <!-- 在page-vxeContent中动态插入剩余的插槽 -->
      <template
          v-for="item in otherPropSlots"
          :key="item.prop"
          #[item.slotName]="scope"
      >
        <template v-if="item.slotName">
          <slot :name="item.slotName" :row="scope.row"></slot>
        </template>
      </template>
    </LTable>
  </div>
</template>

<script>
import {defineComponent, computed, ref, watch} from 'vue'
import LTable from '@/baseui/vxeTable'
import {tableStore} from "@/utils/mapTableStore";
import {cloneFunction} from '@/utils/globalFunction.js'
//导入所有表格数据的pinia
export default defineComponent({
  components: {
    LTable
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
  // emits: ['newBtnClick', 'editBtnClick'],
  setup(props, {emit}) {
    let store = null
    store = tableStore.get(props.storeConfig.storeName)() || null
    // 2.发送网络请求
    const getPageData = (queryInfo) => {
      if (props.storeConfig.requestMethodName !== null) {
        if (store[props.storeConfig.requestMethodName instanceof Function]) {
          store[props.storeConfig.requestMethodName]()
        }
      }

    }
    // getPageData()
    // 1.双向绑定pageInfo
    const pageInfo = ref({currentPage: 1, pageSize: 10})
    watch(pageInfo, () => getPageData())
    const dataList = computed(() => {
          return store[props.storeConfig.showDataListName]
        }
    )
    const dataCount = computed(() =>
        store[props.storeConfig.countName]
    )

    // 4.获取其他的动态插槽名称
    const otherPropSlots = props.contentTableConfig?.propList.filter(
        (item) => {
          if (item.slotName === 'handler') return false
          return true
        }
    )
    // 5.删除/编辑/新建操作
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

    return {
      dataList,
      dataCount,
      pageInfo,
      otherPropSlots,
      handleEditClick
    }
  }
})
</script>

<style scoped>
.page-content {
  width: 100%;
  height: 100%;
  /*padding: 20px;*/
  /*border-top: 20px solid #f5f5f5;*/
}
</style>
