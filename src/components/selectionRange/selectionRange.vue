//选择范围组件
<template>
  <div class="outBox">
    <el-dialog v-model="dialogFormVisible" :close-on-click-modal="false" :show-close="false">
      <template #header>
        <div class="handler">
          <el-link type="primary" @click="dialogFormVisible=false">取消</el-link>
          <el-link style="marginLeft:20px" type="primary">确定</el-link>
        </div>
      </template>

      <div class="content">
        <div class="leftSelect">
          <h3>门店范围</h3>
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
                    :data="data"
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="[1, 4]"
                    :default-checked-keys="[5]"
                    :props="defaultProps"
                />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="rightShow">
          <h3>品牌范围</h3>
          <div class="header">
            <el-input
                placeholder="输入关键字检索"
                clearable
            >
              <template #append>
                <el-button :icon="Search" @click="initAllData"/>
              </template>
            </el-input>
          </div>

          <div class="brandTreeNode">
            <el-tree
                :data="data"
                show-checkbox
                node-key="id"
                :default-expanded-keys="[1, 4]"
                :default-checked-keys="[5]"
                :props="defaultProps"
            />
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
.outBox::v-deep(.el-dialog__body){
  padding: 0px !important;
}
.outBox {
  display: flex;
  flex-direction: column;

  .handler {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

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
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

      }

      .brandTreeNode {
        margin-top: 10px;
      }
    }
  }
}

</style>

