<!--@checkbox-change="handleSelectionChange"-->
<template>
  <div class="ll-table">
    <vxe-table
        :data="listData"
        border="none"
        style="width: 100%;height: 100%"
        v-bind="childrenProps"
        :height="tableHeight"
        align="center"
        :header-cell-style="{background: '#efefef'}"
        class="mytable-scrollbar"
        :sort-config="isSort?isSort:undefined"
    >
      <vxe-column type="seq" title="序号">
      </vxe-column>
      <template v-for="propItem in propList" :key="propItem.prop">
        <vxe-column v-bind="propItem" align="center" show-header-overflow show-overflow show-footer-overflow
                    show-overflow-tooltip>
          <template #default="scope">
            <slot :name="propItem.slotName" :row="scope.row">
              {{ scope.row[propItem.field] }}
            </slot>
          </template>
        </vxe-column>
      </template>

    </vxe-table>

  </div>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  props: {
    title: {
      type: String,
      default: ''
    },
    // isShowBorder: {
    //   type: Boolean,
    //   default: false
    // },
    listData: {
      type: Array,
      required: true
    },
    listCount: {
      type: Number,
      default: 0
    },
    propList: {
      type: Array,
      required: true
    },
    showIndexColumn: {
      type: Boolean,
      default: false
    },
    showSelectColumn: {
      type: Boolean,
      default: false
    },
    page: {
      type: Object,
      default: () => ({currentPage: 0, pageSize: 10})
    },
    childrenProps: {
      type: Object,
      default: () => ({})
    },
    tableHeight: {
      type: Number,
      default: 500
    },
    isSort: {
      type: Object,
      default: undefined
    },
  },
  emits: ['selectionChange', 'update:page'],
  setup(props, {emit}) {
    const handleSelectionChange = (value) => {
      emit('selectionChange', value)
    }


    return {handleSelectionChange}
  }
})
</script>
<style scoped lang="scss">
/*滚动条整体部分*/
.mytable-scrollbar ::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

/*滚动条的轨道*/
.mytable-scrollbar ::-webkit-scrollbar-track {
  background-color: #FFFFFF;
}

/*滚动条里面的小方块，能向上向下移动*/
.mytable-scrollbar ::-webkit-scrollbar-thumb {
  background-color: #bfbfbf;
  border-radius: 5px;
  border: 1px solid #F1F1F1;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
}

.mytable-scrollbar ::-webkit-scrollbar-thumb:hover {
  background-color: #A8A8A8;
}

.mytable-scrollbar ::-webkit-scrollbar-thumb:active {
  background-color: #787878;
}

/*边角，即两个滚动条的交汇处*/
.mytable-scrollbar ::-webkit-scrollbar-corner {
  background-color: #FFFFFF;
}

//.ll-table::v-deep(.vxe-header--column) {
//  background-color: #fff !important;
//}
//
//.ll-table::v-deep(.vxe-header--gutter) {
//  background-color: #fff !important;
//}

.header {
  display: flex;
  height: 45px;
  padding: 0 5px;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 20px;
    font-weight: 700;
  }

  .handler {
    align-items: center;
  }
}

</style>
