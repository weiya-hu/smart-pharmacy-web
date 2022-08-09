<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
         <el-form-item label="登录地址" prop="ipaddr">
            <el-input
               v-model="queryParams.ipaddr"
               placeholder="请输入登录地址"
               clearable
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="用户名称" prop="userName">
            <el-input
               v-model="queryParams.userName"
               placeholder="请输入用户名称"
               clearable
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>
      <el-table
         v-loading="loading"
         :data="onlineList.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
         style="width: 100%;"
      >
<!--         <el-table-column label="序号" width="50" type="index">-->
<!--            <template #default="scope">-->
<!--               <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>-->
<!--            </template>-->
<!--         </el-table-column>-->
         <el-table-column label="登录名称" prop="userName" :show-overflow-tooltip="true" />
         <el-table-column label="IP地址" prop="ipaddr" :show-overflow-tooltip="true" />
         <el-table-column label="登录地点" prop="loginLocation" :show-overflow-tooltip="true" />
         <el-table-column label="操作系统" prop="os" :show-overflow-tooltip="true" />
         <el-table-column label="浏览器" prop="browser" :show-overflow-tooltip="true" />
         <el-table-column label="登录时间" prop="loginTime" width="180">
            <template #default="scope">
               <span>{{ parseTime(scope.row.loginTime) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="操作" class-name="small-padding fixed-width" width="90">
            <template #default="scope">
              <el-tooltip content="强退" placement="right">
                 <el-link
                    type="danger"
                    :underline="false"
                    icon="CloseBold"
                    @click="handleForceLogout(scope.row)"
                    v-hasPermi="['monitor:online:forceLogout']"
                 ></el-link>
              </el-tooltip>
            </template>
         </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="pageNum" v-model:limit="pageSize" />
   </div>
</template>

<script setup name="Online">
import { forceLogout, list as initData } from "@/api/monitor/online";

const { proxy } = getCurrentInstance();

const onlineList = ref([]);
const loading = ref(true);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(10);

const queryParams = ref({
  ipaddr: undefined,
  userName: undefined
});

/** 查询登录日志列表 */
function getList() {
  loading.value = true;
  initData(queryParams.value).then(response => {
    onlineList.value = response.data.list;
    total.value = Number(response.data.total);
    loading.value = false;
  });
}
/** 搜索按钮操作 */
function handleQuery() {
  pageNum.value = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 强退按钮操作 */
function handleForceLogout(row) {
    proxy.$modal.confirm('是否确认强退名称为"' + row.userName + '"的用户?').then(function () {
  return forceLogout(row.tokenId);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("操作成功");
  }).catch(() => {});
}

getList();
</script>
