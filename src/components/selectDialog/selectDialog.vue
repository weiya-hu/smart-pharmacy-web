<template>
  <div class="outBox">
    <el-dialog v-model="dialogFormVisible" :close-on-click-modal="false" :show-close="false">
      <div class="content">
        <div class="leftSelect">
          <div class="keyWordsSerach">
            <el-input
                placeholder="输入关键字检索"
                clearable
            >
              <template #append>
                <el-button :icon="Search" @click="initAllData"/>
              </template>
            </el-input>
          </div>
          <div class="treeNode">
            <el-tabs v-model="activeTabName" class="demo-tabs">
              <el-tab-pane label="组织架构" name="zero">
                <el-tree
                    ref="treeInstance"
                    :data="relationTreeNode"
                    show-checkbox
                    node-key="id"
                    :default-expand-all="true"
                    :props="defaultProps"
                    :check-strictly="true"
                    @check-change="nodeClick"
                />
              </el-tab-pane>
              <el-tab-pane label="公司标签" name="first">
                <el-tree
                    :data="[]"
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="[2, 4]"
                    :default-checked-keys="[5]"
                    :props="defaultProps"
                />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="rightShow">
          <div class="header">
            <div class="selected">已选人员</div>
            <div class="handler">
              <el-link @click="dialogFormVisible = false " type="primary">取消</el-link>
              <el-link @click="confirmSelect" style="marginLeft:20px" type="primary">确定</el-link>
            </div>
          </div>
          <div>
            <template v-for="(item,index) in selectedNode" :key="index">
              <div>
                <el-button link type="primary">{{ item.userName }}</el-button>
              </div>
            </template>
          </div>
        </div>
      </div>

    </el-dialog>

  </div>
</template>

<script setup>
import {reactive, ref, defineProps, watch} from 'vue'
import {CloseBold, Search} from '@element-plus/icons-vue'

const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const activeTabName = ref('zero')
import useAutotrophicTaskStore from "@/store/modules/autotrophicTask.js";
//控制弹框显示
//传入参数用于数据回显
let store = useAutotrophicTaskStore()
let relationTreeNode = ref([])
let emits = defineEmits(['responsible', 'participate'])
let props = defineProps({
  responsible: {
    type: Array,
    required: false
  },
  emitName: {
    type: String,
    required: true
  }
})
watch(() => store.relationTreeNode, () => {
  innitTreeNode()
}, {deep: true, immediate: false})
//初始画树形节点
const innitTreeNode = function () {
  // relationTreeNode.value = store.relationTreeNode
  let treeNode = store.relationTreeNode
//    递归调用初始化树形结构
  let result = recursionInnit(treeNode)
  relationTreeNode.value = result
}
//递归函数
const recursionInnit = function (dataArray) {
  dataArray.forEach(item => {
    item.label = item.name
    if (item.children !== null && item.users.length == 0) {
      recursionInnit(item.children)
    } else if (item.children == null && item.users.length !== 0) {
      item.users.forEach(user => {
        user.id = user.userId
        user.label = user.userName + '(' + user.jobName + ")"
      })
      item.children = [...item.users]
    } else {

    }
  })
  return dataArray
}


const showDialog = function () {
  dialogFormVisible.value = true
}
//树
const defaultProps = {
  children: 'children',
  label: 'label',
  disabled: function (data, node) {
    if (data.nodeRelUserId) {
      return false
    } else {
      return true
    }
  }
}
const confirmSelect = function () {
  emits(props.emitName, selectedNode.value)
  selectedNode.value = []
  store.relationTreeNode = []
  dialogFormVisible.value = false
}
const treeInstance = ref()
let selectedNode = ref([])
//选中节点时触发
const nodeClick = function (item) {
  let allSelected = treeInstance.value.getCheckedNodes()
  let filterPeople = allSelected.filter(item => {
    return item.userId
  })
  selectedNode.value = filterPeople
}
//方法导出
defineExpose({
  showDialog
})
</script>

<style scoped lang="scss">
.outBox {
  display: flex;
  flex-direction: column;

  .content {
    display: flex;
    justify-content: space-between;
    height: 50vh;

    .leftSelect {
      padding: 10px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid black;
      width: 50%;
    }

    .rightShow {
      padding: 10px;
      width: 50%;
      display: flex;
      flex-direction: column;

      .header {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}


</style>
