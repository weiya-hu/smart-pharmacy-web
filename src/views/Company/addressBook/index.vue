<template>
  <div class="outBox">
    <div class="dialogTotal">
      <addOrganization :selectTreeData="depTreeData" @loadDepTree="loadDepTree" ref="addOrganizationInstance"></addOrganization>
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
                v-model="queryUsersByDeptParams.parentId"
                :data="depTreeData"
                node-key="id"
                check-strictly
                check-on-click-node
                default-expand-all
            />


          </el-tab-pane>
          <el-tab-pane label="业务机构" name="second">
            <el-tree
                :data="depTreeData"
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
import {ref,onMounted,reactive} from 'vue'
import {CloseBold, Search} from '@element-plus/icons-vue'
import pageContent from "@/components/page-content/page-content";
import {contentTableConfig} from './config/tableConfig'
import addOrganization from "./component/addOrganization.vue"
import addMember from './component/addMember.vue'
import {addressBook} from './config/storeConfig.js'
import {findDeptByTree} from "@/api/company/addressBook";

const organization = ref('first')
const depTreeData = ref([])
const handleEditData = ()=>{

}
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
//加载部门树
const loadDepTree=()=>{
  findDeptByTree({}).then(res=>{
    depTreeData.value = res.data.list
  })
}
// 查询部门人员
const  queryUsersByDeptParams=reactive({
  depId:''
})
const queryUsersByDept=()=>{

}




onMounted(()=>{
  loadDepTree({})
})
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


