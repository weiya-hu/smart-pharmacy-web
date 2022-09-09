<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
              v-model="deptName"
              placeholder="请输入部门名称"
              clearable
              prefix-icon="Search"
              style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
              :data="deptOptions"
              :props="{ label: 'label', children: 'children' }"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="deptTreeRef"
              highlight-current
              default-expand-all
              @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="用户名称" prop="userName">
            <el-input
                v-model="queryParams.userName"
                placeholder="请输入用户名称"
                clearable
                style="width: 240px"
                @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input
                v-model="queryParams.mobile"
                placeholder="请输入手机号码"
                clearable
                style="width: 240px"
                @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="columns[0].visible"/>
          <el-table-column label="用户名称" align="center" key="userName" prop="userName" v-if="columns[1].visible"
                           :show-overflow-tooltip="true"/>
          <el-table-column label="部门" align="center" key="deptname" prop="deptname" v-if="columns[3].visible"
                           :show-overflow-tooltip="true"/>
          <el-table-column label="手机号码" align="center" key="mobile" prop="mobile" v-if="columns[4].visible"
                           width="120"/>
        </el-table>
        <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="User">
import {treeselect} from "@/api/system/dept";
import {listUser } from "@/api/system/user";

const router = useRouter();
const {proxy} = getCurrentInstance();
const {sys_normal_disable, sys_user_sex} = proxy.useDict("sys_normal_disable", "sys_user_sex");

const userList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const deptName = ref("");
const deptOptions = ref(undefined);
const initPassword = ref(undefined);
const postOptions = ref([]);
const roleOptions = ref([]);
// 列显隐信息
const columns = ref([
  {key: 0, label: `用户编号`, visible: true},
  {key: 1, label: `用户名称`, visible: true},
  {key: 2, label: `用户昵称`, visible: true},
  {key: 3, label: `部门`, visible: true},
  {key: 4, label: `手机号码`, visible: true},
  {key: 5, label: `状态`, visible: true},
  {key: 6, label: `创建时间`, visible: true}
]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userName: undefined,
    mobile: undefined,
    enable: undefined,
    department: undefined
  },
});

const {queryParams, form, rules} = toRefs(data);

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watch(deptName, val => {
  proxy.$refs["deptTreeRef"].filter(val);
});

/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then(response => {
    deptOptions.value = response.data.list;
  });
};

/** 查询用户列表 */
function getList() {
  loading.value = true;
  listUser(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {
    loading.value = false;
    userList.value = res.data.list;
    total.value = Number(res.data.total);
  });
};

/** 节点单击事件 */
function handleNodeClick(data) {
  if (data.parentId == null) {
    queryParams.value.department = null
  } else {
    queryParams.value.department = data.id;
  }
  queryParams.value.deptIds = [data.id]
  handleQuery();
};

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  queryParams.value.deptIds = []
  proxy.resetForm("queryRef");
  handleQuery();
};

/** 选择条数  */
function handleSelectionChange(selection) {
  selectUsers.value = selection
  ids.value = selection.map(item => item.userId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 初始化部门数据 */
function initTreeData() {
  // 判断部门的数据是否存在，存在不获取，不存在则获取
  if (deptOptions.value === undefined) {
    treeselect().then(response => {
      deptOptions.value = response.data;
    });
  }
};
//当前选择人员
const selectUsers = ref([])
//获取当前选择人员
const getSelectUsers = ()=>{
  return selectUsers.value
}
defineExpose({
  getSelectUsers
})
getTreeselect();
getList();
</script>