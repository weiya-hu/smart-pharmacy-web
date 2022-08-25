<template>
  <div class="outBox">
    <el-dialog  v-model="dialogFormVisible" >
      <div class="content">
        <div class="header">
          <div class="tip">请选择商品</div>
          <div class="handler">
            <el-link type="primary">统一规则</el-link>
            <el-link style="marginLeft:20px" type="primary">确定</el-link>
            <el-link style="marginLeft:20px" type="primary">返回</el-link>
          </div>
        </div>
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
              <el-tab-pane label="所有商品" name="zero">
                <el-tree
                    :data="data"
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="[1, 4]"
                    :default-checked-keys="[5]"
                    :props="defaultProps"
                />
              </el-tab-pane>
              <el-tab-pane label="按标签选" name="first">
                <el-tree
                    :data="data"
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="[2, 4]"
                    :default-checked-keys="[5]"
                    :props="defaultProps"
                />
              </el-tab-pane>
              <el-tab-pane label="按品牌选" name="second">
                <el-tree
                    :data="data"
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="[2, 4]"
                    :default-checked-keys="[5]"
                    :props="defaultProps"
                />
              </el-tab-pane>
              <el-tab-pane label="常用组合" name="three">
                <el-tree
                    :data="data"
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
      </div>
    </el-dialog>

  </div>
</template>

<script setup>
import {reactive, ref, defineProps} from 'vue'
import {CloseBold, Search} from '@element-plus/icons-vue'

const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const activeTabName = ref('zero')

//控制弹框显示
//传入参数用于数据回显
const showDialog = function () {
  dialogFormVisible.value = true
}
//树
const defaultProps = {
  children: 'children',
  label: 'label',
}
const data = [
  {
    id: 1,
    label: '大区',
    children: [
      {
        id: 4,
        label: '郭冰 大区经理',
        children: [
          {
            id: 9,
            label: '片区',
            children: [
              {
                id: 9,
                label: '许志波 大区经理',

              },
              {
                id: 10,
                label: '门店',
              },
            ],
          },

        ],
      },
    ],
  },

]


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
    flex-direction: column;
    height: 70vh;
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #e4e7ed;
    }
    .leftSelect {
      padding: 10px;
      display: flex;
      flex-direction: column;
      width: 100%;
    }
  }
}


</style>
