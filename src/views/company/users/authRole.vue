<template>
  <div class="app-container">
    <h4 class="form-header h4">基本信息</h4>
    <el-form :model="form" label-width="80px">
      <el-row>
        <el-form-item label="用户名称" prop="nickName">
          <el-input v-model="form.userName" disabled />
        </el-form-item>
        <!--            <el-col :span="8" :offset="2">-->
        <!--               <el-form-item label="登录账号" prop="userName">-->
        <!--                  <el-input v-model="form.userName" disabled />-->
        <!--               </el-form-item>-->
        <!--            </el-col>-->
      </el-row>
    </el-form>

    <h4 class="form-header h4">角色信息</h4>
    <!--      <el-table v-loading="loading" :row-key="getRowKey" @row-click="clickRow" ref="roleRef" @selection-change="handleSelectionChange" :data="roles.slice((pageNum - 1) * pageSize, pageNum * pageSize)">-->
    <el-table v-loading="loading" :row-key="getRowKey" @row-click="clickRow" ref="roleRef"
              @selection-change="handleSelectionChange" :data="userInfoData">
      <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
      <el-table-column label="角色编号" prop="roleId"/>
      <el-table-column label="角色名称" prop="name"></el-table-column>
      <el-table-column label="是否是管理员" prop="admin">
        <template #default="scope">
          <span v-if="scope.row.admin == 1">是</span>
          <span v-if="scope.row.admin == 0">否</span>
        </template>
      </el-table-column>
      <!--         <el-table-column label="权限字符" prop="roleKey" />-->
      <el-table-column label="创建时间" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-form label-width="100px">
      <div style="text-align: center;margin-left:-120px;margin-top:30px;">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="close()">返回</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup name="AuthRole">
import {getAuthRole, updateAuthRole} from "@/api/system/user";
import {listRole} from "@/api/system/role";
import {nextTick} from "vue";

const route = useRoute();
const {proxy} = getCurrentInstance();

const loading = ref(true);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(10);
const roleIds = ref([]);
const roles = ref([]);
const form = ref({
  // nickName: undefined,
  // userName: undefined,
  userId: undefined
});

const userInfoData = ref([])

/** 单击选中行数据 */
function clickRow(row) {
  proxy.$refs["roleRef"].toggleRowSelection(row);
};

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  roleIds.value = selection.map(item => item.roleId);
};

/** 保存选中的数据编号 */
function getRowKey(row) {
  return row.roleId;
};

/** 关闭按钮 */
function close() {
  const obj = {path: "/enterpriseCenter/company/users"};
  proxy.$tab.closeOpenPage(obj);
};

/** 提交按钮 */
function submitForm() {
  // const userId = form.value.userId;
  // const rIds = roleIds.value.join(",");
  const userId = [route.query.userId]
  if (roleIds.value.length == 0) {
    proxy.$modal.msgError('请选择要分配的用户角色')
    return;
  }
  updateAuthRole({userIds: userId, roleId: roleIds.value}).then(response => {
    proxy.$modal.msgSuccess("授权成功");
    close();
  });
};

function getList() {
  getAuthRole({userId: route.query.userId}).then(res => {
    if (res.code === 200 && res.data.length > 0) {
      nextTick(()=>{
        res.data.forEach((row) => {
          let exists = userInfoData.value.filter(item=>row.roleId === item.roleId)
          if(exists.length >0)
          proxy.$refs["roleRef"].toggleRowSelection(exists[0], undefined);
        })
      })
    }
  })
}

function getRoleList() {
  listRole().then(res => {
    if (res.code === 200) {
      userInfoData.value = res.data.list
      getList()
    }
  })
}

function loadPage() {
  form.value.userName = route.query.userName
  getRoleList()
  loading.value = false
}

loadPage()
// (() => {
//   const userId = route.query.userId;
//   // console.log('userId',userId)
//   // route.currentRoute.value.params.userId
//   if (userId) {
//     loading.value = true;
//     getAuthRole(userId).then(response => {
//       form.value = response.user;
//       roles.value = response.roles;
//       total.value = roles.value.length;
//       nextTick(() => {
//         roles.value.forEach(row => {
//           if (row.flag) {
//             proxy.$refs["roleRef"].toggleRowSelection(row);
//           }
//         });
//       });
//       loading.value = false;
//     });
//   }
// })();
</script>
