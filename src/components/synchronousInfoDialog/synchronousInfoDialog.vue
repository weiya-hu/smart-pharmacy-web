<!--同步信息弹框-->
<template>
  <div class="out-box">
    <el-dialog v-if="visible" v-model="visible" :show-close="false" title="商品同步">
      <div class="content">
        <div class="selectList">
          <div class="goodsList">
            <vxe-table
                ref="xTable1"
                :data="dataList"
                @checkbox-change="checkboxInfo"
                @checkbox-all="checkboxAll"
            >
              <vxe-column type="checkbox" width="60"></vxe-column>
              <vxe-column field="productName" title="名称" :filters="[{ data: '' }]"
                          :filter-method="filterProductNameMethod">
                <template #filter="{ $panel, column }">
                  <input placeholder="请输入商品名称" type="type" v-for="(option, index) in column.filters" :key="index"
                         v-model="option.data"
                         @input="$panel.changeOption($event, !!option.data, option)">
                </template>
              </vxe-column>
              <vxe-column field="brand" title="品牌" :filters="[{ data: '' }]" :filter-method="filterBrandMethod">
                <template #filter="{ $panel, column }">
                  <input placeholder="请输入商品品牌" type="type" v-for="(option, index) in column.filters" :key="index"
                         v-model="option.data"
                         @input="$panel.changeOption($event, !!option.data, option)">
                </template>
              </vxe-column>
              <vxe-column field="category" title="品类" :filters="[{ data: '' }]" :filter-method="filterCategoryMethod">
                <template #filter="{ $panel, column }">
                  <input placeholder="请输入商品品类" type="type" v-for="(option, index) in column.filters" :key="index"
                         v-model="option.data"
                         @input="$panel.changeOption($event, !!option.data, option)">
                </template>
              </vxe-column>
            </vxe-table>
          </div>
        </div>
        <div class="selected">
          <ul>
            <li class="itemInfo" v-for="(record ,index) in selectedRecords" :key="record.id">
              <div class="info">
                <span>{{ record.productName }}</span>
                <sapn @click="deleteItem(record)">X</sapn>
              </div>

            </li>
          </ul>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </template>

    </el-dialog>
  </div>


</template>
<script setup>
import {defineEmits, ref, defineProps, reactive, onMounted} from 'vue'

let emit = defineEmits(['synchronousCallBackInfo', 'cancelSynchronousInfo'])
const xTable1 = ref('')
const props = defineProps({
  dataList: {
    type: Array,
    required: true
  }
})

let selectedRecords = ref([])
//点击取消
const handleCancel = function () {
  const $table = xTable1.value
  emit('cancelSynchronousInfo')
  visible.value = false
  selectedRecords.value = []
  $table.clearCheckboxRow()
}
//点击确认
const handleConfirm = function () {
  const $table = xTable1.value
  const backId = []
//  获取选中的商品id
  selectedRecords.value.forEach(item => {
    backId.push(item.id)
  })
//  自定义事件触发
  emit('synchronousCallBackInfo', backId)
  selectedRecords.value = []
  visible.value = false
  $table.clearCheckboxRow()
}
//选中的数据

//筛选名称
const filterBrandMethod = ({option, row}) => {
  return row.brand === option.data
}
//筛选品牌
const filterProductNameMethod = ({option, row}) => {
  return row.productName === option.data
}
//筛选品类
const filterCategoryMethod = ({option, row}) => {
  return row.category === option.data
}
//选择的方法
const checkboxInfo = function (item) {
  const $table = xTable1.value
  const selectRecords = $table.getCheckboxRecords()
  selectedRecords.value = [...selectRecords]

}
//全选的方法
const checkboxAll = function () {
  const $table = xTable1.value
  const selectRecords = $table.getCheckboxRecords()
  selectedRecords.value = [...selectRecords]
}
//默认选中的id
const selectedId = ref([])
//删除已选中
const deleteItem = function (item) {
//  根据记录的唯一id进行删除
  selectedRecords.value = selectedRecords.value.filter(Record => {
    return item.id !== Record.id
  })
  const $table = xTable1.value
  $table.toggleCheckboxRow(item)

}


let visible = ref(false)
const showDialog = function () {
  visible.value = true
}

defineExpose({
  showDialog
})

</script>

<style scoped lang="scss">
.out-box {

  .content {
    height: 40vh;
    display: flex;
    justify-content: space-between;
    flex-direction: row;

    .selectList {
      width: 70%;
      display: flex;
      flex-direction: column;

      .goodsList {
        margin-top: 20px;

      }
    }

    .selected {
      width: 30%;
      margin-left: 5px;

      ul {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 0;

        .itemInfo {
          .info {
            margin-top: 5px;
            padding: 7px 5px;
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
          }

        }
      }
    }

  }


}

</style>

