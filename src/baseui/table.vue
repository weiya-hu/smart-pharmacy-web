<template>
  <div >
    <el-table
        :data="listData"
        :border="isShowBorder"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-bind="childrenProps"
    >
      <el-table-column
          v-if="showSelectCheckBox"
          type="selection"
          align="center"
          width="60"
      ></el-table-column>
      <el-table-column
          v-if="showIndexColumn"
          type="index"
          label="序号"
          align="center"
          width="80"
      ></el-table-column>
      <template v-for="propItem in propList" :key="propItem.prop">
        <el-table-column v-bind="propItem" align="center" show-overflow-tooltip>
          <template #default="scope">
            <slot :name="propItem.slotName" :row="scope.row">
              {{ scope.row[propItem.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="footer" v-if="showFooter">
      <slot name="footer">
        <el-pagination
            v-if="showSelectColumn"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.currentPage"
            :page-size="page.pageSize"
            :page-sizes="[10, 20, 30]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listCount"
        >
        </el-pagination>
      </slot>
    </div>
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
    showSelectCheckBox: {
      type: Boolean,
      default: false
    },
    isShowBorder: {
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
    showFooter: {
      type: Boolean,
      default: true
    }
  },
  emits: ['selectionChange', 'update:page'],
  setup(props, {emit}) {
    const handleSelectionChange = (value) => {
      emit('selectionChange', value)
    }

    const handleCurrentChange = (currentPage) => {
      emit('update:page', {...props.page, currentPage})
    }

    const handleSizeChange = (pageSize) => {
      emit('update:page', {...props.page, pageSize})
    }

    return {
      handleSelectionChange,
      handleCurrentChange,
      handleSizeChange
    }
  }
})
</script>

<style scoped lang="scss">
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

.footer {
  margin-top: 15px;

  .el-pagination {
    text-align: right;
  }
}
</style>
