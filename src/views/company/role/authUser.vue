<template>
   <div class="app-container">
     <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" @submit.native.prevent>
         <el-form-item label="用户名称" prop="userName">
            <el-input
               v-model="queryParams.userName"
               placeholder="请输入用户名称"
               clearable
               style="width: 220px"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

     <div class="btn-back">
       <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
           <el-button
               type="primary"
               plain
               icon="Plus"
               @click="openSelectUser"
               v-hasPermi="['system:role:add']"
           >添加用户</el-button>
         </el-col>
         <el-col :span="1.5">
           <el-button
               plain
               type="info"
               icon="CircleClose"
               :disabled="multiple"
               @click="cancelAuthUserAll"
               v-hasPermi="['system:role:remove']"
           >批量取消授权</el-button>
         </el-col>
         <el-col :span="1.5">
           <el-button
               plain
               icon="Close"
               @click="handleClose"
           >关闭</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
       </el-row>
     </div>


      <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true" />
         <el-table-column label="创建时间" prop="createTime">
            <template #default="scope">
               <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <div class="btn-col">
                <el-button
                    type="text"
                    icon="CircleClose"
                    size="small"
                    @click="cancelAuthUser(scope.row)"
                    v-hasPermi="['system:role:remove']"
                >取消授权</el-button>
              </div>
            </template>
         </el-table-column>
      </el-table>

      <pagination
         v-show="total > 0"
         :total="total"
         v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize"
         @pagination="getList"
      />
      <select-user ref="selectRef" :roleId="queryParams.roleIds" @ok="handleQuery" />
   </div>
</template>

<script setup name="AuthUser">
import Breadcrumb from '@/components/Breadcrumb'
import SelectUser from "./selectUser";
import { allocatedUserList, authUserCancel, authUserCancelAll } from "@/api/system/role";

const route = useRoute();
const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict("sys_normal_disable");

const userList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const multiple = ref(true);
const total = ref(0);
const userIds = ref([]);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  roleIds: route.query.roleId,
  userName: undefined,
  // mobile: undefined,
});

/** 查询授权用户列表 */
function getList() {
  loading.value = true;
  allocatedUserList(queryParams).then(response => {
    userList.value = response.data.list;
    total.value = Number(response.data.total);
    loading.value = false;
  });
}
// 返回按钮
function handleClose() {
  const obj = { path: "/enterpriseCenter/company/role" };
  proxy.$tab.closeOpenPage(obj);
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
// 多选框选中数据
function handleSelectionChange(selection) {
  userIds.value = selection.map(item => item.userId);
  multiple.value = !selection.length;
}
/** 打开授权用户表弹窗 */
function openSelectUser() {
  proxy.$refs["selectRef"].show();
}
/** 取消授权按钮操作 */
function cancelAuthUser(row) {
  proxy.$modal.confirm('确认要取消该用户"' + row.userName + '"角色吗？').then(function () {
    return authUserCancel({ userId: row.userId, roleId: queryParams.roleIds });
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("取消授权成功");
  }).catch(() => {});
}
/** 批量取消授权按钮操作 */
function cancelAuthUserAll(row) {
  const roleId = queryParams.roleIds;
  const uIds = userIds.value.join(",");
  proxy.$modal.confirm("是否取消选中用户授权数据项?").then(function () {
    return authUserCancelAll({ roleId: roleId, userIds: uIds });
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("取消授权成功");
  }).catch(() => {});
}

getList();
</script>
