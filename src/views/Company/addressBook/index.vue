<template>
  <div class="outBox">
    <div class="dialogTotal">
      <addOrganization ref="addOrganizationInstance"></addOrganization>
      <addMember ref="addMemberInstance"></addMember>
    </div>
    <div class="left_tree">
      <div class="seach">
        <el-input
            style="width: 300px"
            placeholder="搜索部门/成员/标签"
            clearable
        >
          <template #append>
            <el-button :icon="Search"/>
          </template>
        </el-input>
        <el-icon @click="addOrganizationFunction">
          <Plus/>
        </el-icon>
      </div>
      <div class="tabs_tree">
        <el-tabs
            v-model="organization"
            class="demo-tabs"
        >
          <el-tab-pane label="组织机构" name="first">
            <el-tree
                :data="data"
                show-checkbox
                node-key="id"
                :default-expanded-keys="[2, 3]"
                :default-checked-keys="[5]"
                :props="defaultProps"
            />


          </el-tab-pane>
          <el-tab-pane label="业务机构" name="second">
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
        <div class="total">
          <h4>共 128人</h4>
        </div>
        <div class="select">
          <el-button @click="addMemberFunction">添加成员</el-button>
          <el-button>导入</el-button>
          <el-button>导出</el-button>
          <el-button>模板下载</el-button>
          <el-button>删除</el-button>
        </div>
      </div>
      <div class="tableList">
        <pageContent
            :contentTableConfig="contentTableConfig"
            :storeConfig="addressBook"
            @editBtnClick="handleEditData"
        ></pageContent>
      </div>
    </div>
  </div>

</template>

<script setup>
import {ref} from 'vue'
import {CloseBold, Search} from '@element-plus/icons-vue'
import pageContent from "@/components/page-content/page-content";
import {contentTableConfig} from './config/tableConfig'
import addOrganization from "./component/addOrganization.vue"
import addMember from './component/addMember.vue'
import {addressBook} from './config/storeConfig.js'

const organization = ref('first')

const defaultProps = {
  children: 'children',
  label: 'label',
}
console.log("执行")
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

let addOrganizationInstance = ref('')
//添加机构
const addOrganizationFunction = function () {
  addOrganizationInstance.value.showDialog()
}

let addMemberInstance = ref('')
//添加成员
const addMemberFunction = function () {
  addMemberInstance.value.showDialog()
}
</script>

<style lang="scss" scoped>

.outBox {
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


  padding: 10px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;

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
      margin-bottom: 20px;
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


</style>


