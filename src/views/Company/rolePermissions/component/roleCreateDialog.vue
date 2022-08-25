<template>
  <el-dialog v-model="outerVisible" width="50%" title="新建角色">
    <template #default>
      <div class="contentBox">
        <div class="roleName">
          <el-form>
            <el-form-item label="角色名">
              <el-input style="width: 300px;" placeholder="请输入角色名称"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="choosePermissionAndPeople">
          <div class="permission">
            <div>权限</div>
            <div class="content">
              <div class="treeNode">
                <el-tabs
                    v-model="activeName"
                    class="demo-tabs"
                    @tab-click="handleClick"
                >
                  <el-tab-pane label="客户中心" name="first">
                    <el-tree
                        :data="permissionData"
                        show-checkbox
                        node-key="id"
                        :default-expanded-keys="[2, 3]"
                        :default-checked-keys="[5]"
                        :props="defaultPermissionProps"
                    />

                  </el-tab-pane>
                  <el-tab-pane label="营销中心" name="second">
                    <el-tree
                        :data="permissionData"
                        show-checkbox
                        node-key="id"
                        :default-expanded-keys="[2, 3]"
                        :default-checked-keys="[5]"
                        :props="defaultPermissionProps"
                    />
                  </el-tab-pane>
                  <el-tab-pane label="资源中心" name="third">
                    <el-tree
                        :data="permissionData"
                        show-checkbox
                        node-key="id"
                        :default-expanded-keys="[2, 3]"
                        :default-checked-keys="[5]"
                        :props="defaultPermissionProps"
                    />

                  </el-tab-pane>
                  <el-tab-pane label="我的企业" name="fourth">
                    <el-tree
                        :data="permissionData"
                        show-checkbox
                        node-key="id"
                        :default-expanded-keys="[2, 3]"
                        :default-checked-keys="[5]"
                        :props="defaultPermissionProps"
                    />
                  </el-tab-pane>
                </el-tabs>


              </div>

            </div>
          </div>
          <div class="people">
            <div>人员</div>
            <div class="content">
              <div class="search">
                <el-input
                    placeholder="请输入姓名"
                    clearable
                >
                  <template #append>
                    <el-button :icon="Search"/>
                  </template>
                </el-input>
              </div>
              <el-tree :data="peopleTreeData" :props="defaultPeopleProps" @node-click="handlePeopleNodeClick"/>
            </div>
          </div>


        </div>


      </div>

      <el-dialog
          v-model="innerVisible"
          width="40%"
          append-to-body
          :show-close="false"
      >
        <template #header>
          <div style="display: flex;justifyContent:space-between;alignItems:center;marginBottom:20px">
            <span>数据规则配置-营销报表</span>
            <span>
            <el-button>选定</el-button>
          </span>
          </div>
          <pageContent
              :storeConfig="marketingReportTable"
              :contentTableConfig="contentFieldTableConfig"
              @editBtnClick="handleEditData"
          >
          </pageContent>
        </template>


      </el-dialog>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="outerVisible = false">取消</el-button>
        <el-button type="primary" @click="outerVisible = false">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {CloseBold, Search} from '@element-plus/icons-vue'
import {ref} from 'vue'
import pageContent from "@/components/page-content/page-content";
import contentFieldTableConfig from '../config/contentFieldTableConfig.js'
import {marketingReportTable} from '../config/storeConfig.js'

const outerVisible = ref(false)
const innerVisible = ref(true)

const showCreateDialog = function () {
  outerVisible.value = true
}
//权限选择
const activeName = ref('first')

const handleClick = (tab, event) => {
  console.log(tab, event)
}
const defaultPermissionProps = {
  children: 'children',
  label: 'label',
}
const permissionData = [
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

//================


//========peopleTree
const handlePeopleNodeClick = (data) => {
  console.log(data)
}
const peopleTreeData = [
  {
    label: 'Level one 1',
    children: [
      {
        label: 'Level two 1-1',
        children: [
          {
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 2',
    children: [
      {
        label: 'Level two 2-1',
        children: [
          {
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        label: 'Level two 2-2',
        children: [
          {
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 3',
    children: [
      {
        label: 'Level two 3-1',
        children: [
          {
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        label: 'Level two 3-2',
        children: [
          {
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]

const defaultPeopleProps = {
  children: 'children',
  label: 'label',
}
//=========
defineExpose({
  showCreateDialog
})
</script>

<style scoped lang="scss">
.contentBox {
  display: flex;
  flex-direction: column;

  .choosePermissionAndPeople {
    display: flex;
    flex-direction: row;
    align-items: center;

    .permission {
      width: 50%;
      display: flex;
      flex-direction: column;

      .content {
        padding: 10px;
        height: 50vh;
        border: 1px solid #aaaaaa;
        box-shadow: 2px 2px 2px #aaaaaa;
      }
    }

    .people {
      width: 48%;
      display: flex;
      flex-direction: column;
      margin-left: 2%;

      .content {
        padding: 10px;
        height: 50vh;
        border: 1px solid #aaaaaa;
        box-shadow: 2px 2px 2px #aaaaaa;
      }
    }
  }
}

</style>