<template>

  <div class="outBox">
    <div class="dialogTotal">
      <roleCreateDialog ref="roleCreateDialogInstance"></roleCreateDialog>
      <peopleConfigDrawer ref="peopleConfigDrawerInstance"></peopleConfigDrawer>
    </div>
    <div class="tabs">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="组织架构" name="first">
          <div class="organization">
            <div class="left_tree">
              <div class="seach">
                <el-input
                    style="width: 400px"
                    placeholder="搜索部门/成员/标签"
                    clearable
                >
                  <template #append>
                    <el-button :icon="Search"/>
                  </template>
                </el-input>

              </div>
              <div class="tabs_tree">
                <el-tabs
                    v-model="organization"
                    class="demo-tabs"
                >
                  <el-tab-pane label="企业" name="first">
                    <el-tree
                        :data="data"
                        show-checkbox
                        node-key="id"
                        :default-expanded-keys="[2, 3]"
                        :default-checked-keys="[5]"
                        :props="defaultProps"
                    />
                  </el-tab-pane>
                </el-tabs>

              </div>
            </div>
            <div class="right_table">
              <div class="handler">
                <div class="select">
                  <el-button @click="addMemberFunction">创建角色</el-button>
                </div>
              </div>
              <div class="tableList">
                <pageContent
                    :storeConfig="contentTablePeople"
                    :contentTableConfig="contentTableConfig"
                    @editBtnClick="handleEditData"
                >
                  <template #roleStatus="{row}">
                    <div>
                      <span style="color: red" v-if="row.roleStatus===0">禁用</span>
                      <span v-else style="color: green">正常</span>
                    </div>
                  </template>
                  <template #roleHandler="{row}">
                    <div>
                      <el-button type='primary' @click="editPropleConfig(row)" link>角色配置</el-button>
                    </div>
                  </template>
                </pageContent>
              </div>
            </div>
          </div>


        </el-tab-pane>
        <el-tab-pane label="角色" name="second">
          <div class="role">
            <div class="seach">
              <el-input
                  style="width: 400px"
                  placeholder="请输入角色名"
                  clearable
              >
                <template #append>
                  <el-button :icon="Search"/>
                </template>
              </el-input>
              <el-button @click="editorOrCreateRole('newCreate')" style="marginLeft:10px" type="primary">新建
              </el-button>
            </div>
            <pageContent
                :contentTableConfig="contentTableRoleConfig"
                :storeConfig="contentTableRole"
                @editBtnClick="handleEditData"
            >
              <template #status="{row}">
                <div>
                  <el-switch
                      v-model="row.status"
                      size="large"
                      inline-prompt
                      active-text="正常"
                      inactive-text="禁用"
                  />
                </div>
              </template>
              <template #roleHandler="{row}">
                <div>
                  <el-button @click="editorOrCreateRole(row)" type='primary' link>角色配置</el-button>
                </div>
              </template>
            </pageContent>
          </div>

        </el-tab-pane>

      </el-tabs>
    </div>

  </div>

</template>

<script setup>
import {ref} from 'vue'
import {CloseBold, Search} from '@element-plus/icons-vue'
import pageContent from "@/components/page-content/page-content";
import {contentTableConfig} from './config/tableConfig'
import {contentTableRoleConfig} from './config/tableConfigRole.js'
import peopleConfigDrawer from './component/peopleConfigDrawer.vue'
import {contentTableRole, contentTablePeople} from "./config/storeConfig.js"
import roleCreateDialog from './component/roleCreateDialog.vue'

const organization = ref('first')
const defaultProps = {
  children: 'children',
  label: 'label',
}
const data = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1',
          },
          {
            id: 10,
            label: 'Level three 1-1-2',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1',
      },
      {
        id: 6,
        label: 'Level two 2-2',
      },
    ],
  },
  {
    id: 3,
    label: 'Level one 3',
    children: [
      {
        id: 7,
        label: 'Level two 3-1',
      },
      {
        id: 8,
        label: 'Level two 3-2',
      },
    ],
  },
]
const activeName = ref('first')


//点击创建角色按钮
const addMemberFunction = function () {
  activeName.value = "second"
}
//prople 人员配置项
const peopleConfigDrawerInstance = ref('')
//选中角色人员的信息
let roleInfomation = ref({})
const editPropleConfig = function (row) {
  roleInfomation.value = row
  peopleConfigDrawerInstance.value.showDrawer()
}
//新建角色弹框
const roleCreateDialogInstance = ref('')
const editorOrCreateRole = function (prama) {
  if (prama == "newCreate") {
    roleCreateDialogInstance.value.showCreateDialog()
  } else {
    roleCreateDialogInstance.value.showCreateDialog()
  }
}

</script>

<style lang="scss" scoped>
.tabs::v-deep(.el-tabs--card > .el-tabs__header) {
  border: none !important;
}

// 再为tabs添加border-bottom
.tabs::v-deep(.el-tabs__nav) {
  border: none !important;
}

.tabs::v-deep(.el-tabs__nav-wrap)::after {
  //position: static !important;
}

.tabs ::v-deep(.el-tabs__active-bar) {
  background-color: transparent !important;
}

.tabs::v-deep(.el-tabs__item ) {
  margin-left: 10px;
  line-height: 60px;
}

.tabs {
  .tabs_tree::v-deep(.el-tabs--card > .el-tabs__header) {
    border: none !important;
  }

  // 再为tabs添加border-bottom
  .tabs_tree::v-deep(.el-tabs__nav) {
    border: none !important;
  }

  .tabs_tree::v-deep(.el-tabs__nav-wrap)::after {
    //position: static !important;
  }

  .tabs_tree ::v-deep(.el-tabs__active-bar) {
    background-color: transparent !important;
  }

  .tabs_tree::v-deep(.el-tabs__item ) {
    margin-left: 10px;
    line-height: 60px;
  }

  .organization {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .left_tree {
      width: 20vw;
      display: flex;
      flex-direction: column;
      border: 1px solid #e4e7ed;
      padding: 10px;
      height: 90vh;

      .seach {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }

    }

    .right_table {
      flex: 1;
      display: flex;
      flex-direction: column;
      border: 1px solid #e4e7ed;
      padding: 10px;
      height: 90vh;

      .handler {
        margin-bottom: 20px;

        .select {
          display: flex;
          flex-direction: row;
        }
      }
    }
  }

  .role {
    display: flex;
    flex-direction: column;
    padding: 10px;

    .seach {
      margin-bottom: 20px;
    }
  }

}

</style>


