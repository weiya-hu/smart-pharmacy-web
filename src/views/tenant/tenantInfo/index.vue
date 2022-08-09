<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="租户名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入租户名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
            @clear="handleSearch"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable @clear="handleSearch">
          <el-option
              v-for="dict in wecom_tenant_staus"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
        >新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tenantList">
      <el-table-column label="租户名称" prop="name" :show-overflow-tooltip="true" width="150" fixed />
      <el-table-column label="租户版权" prop="copyright" :show-overflow-tooltip="true" />
      <el-table-column label="主页" prop="url" :show-overflow-tooltip="true" />
      <el-table-column label="登录背景" prop="loginBackground" :show-overflow-tooltip="true" />
      <el-table-column label="IP" prop="serverIps" :show-overflow-tooltip="true" />
      <el-table-column label="logo地址" prop="logo" :show-overflow-tooltip="true" />
      <el-table-column label="状态" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-switch
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="165">
        <template #default="scope">
          <el-button
              type="text"
              icon="View"
              @click="handleView(scope.row)"
          ></el-button>
          <el-button
              type="text"
              icon="Edit"
              @click="handleEdit(scope.row)"
          ></el-button>
          <el-tooltip content="分配权限" placement="right">
            <el-button
                type="text"
                icon="User"
                @click="handleUpdate(scope.row)"
            ></el-button>
          </el-tooltip>
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
    <!-- 新增 -->
    <el-dialog title="新增租户" v-model="openData" width="750px" append-to-body draggable>
      <el-form :model="form" label-width="80px" ref="tenantData" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="租户名称" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业ID" prop="plainCorpId">
              <el-input v-model="form.plainCorpId" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主页" prop="url">
              <el-input v-model="form.url" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录背景" prop="loginBackground">
              <el-input v-model="form.loginBackground" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="IP" prop="serverIps">
              <el-input v-model="form.serverIps" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="logo地址" prop="logo">
              <el-input v-model="form.logo" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="0">启用</el-radio>
                <el-radio :label="1">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配 -->
    <el-dialog title="配置权限" v-model="open" width="750px" append-to-body draggable>
      <el-form :model="menuForm" label-width="80px">
<!--        <el-form-item label="菜单状态">-->
<!--          <el-radio-group v-model="menuForm.status">-->
<!--            <el-radio-->
<!--                v-for="dict in wecom_tenant_staus"-->
<!--                :key="dict.value"-->
<!--                :label="dict.value"-->
<!--            >{{ dict.label }}</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
        <el-form-item label="菜单权限">
          <el-checkbox v-model="tenantExpand" @change="handleCheckedTreeExpand">展开/折叠</el-checkbox>
          <el-checkbox v-model="tenantNodeAll" @change="handleCheckedTreeNodeAll">全选/全不选</el-checkbox>
          <el-checkbox v-model="menuForm.tenantCheckStrictly" @change="handleCheckedTreeConnect">父子联动</el-checkbox>
          <el-tree
              style='height:400px;overflow: auto'
              class="tree-border"
              :data="tenantOptions"
              show-checkbox
              ref="tenantRef"
              node-key="id"
              :default-checked-keys="checkedKeys"
              :check-strictly="!menuForm.tenantCheckStrictly"
              empty-text="加载中，请稍候"
              @check="changeTree"
              :props="{ label: 'name', children: 'children'}"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <span>{{ data.name }}</span>
                <span>
                  <el-date-picker
                      v-model="data.expirationTime"
                      type="datetime"
                      format="YYYY-MM-DD hh:mm:ss"
                      value-format="YYYY-MM-DD hh:mm:ss"
                      placeholder="请选择时间"
                      size="small"
                      :editable="false"
                  />
                </span>
              </span>
            </template>
          </el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
<!--          <el-button type="primary" @click="submitDataScope">确 定</el-button>-->
          <el-button @click="cancelDataScope">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看 -->
    <el-dialog title="查看参数" v-model="openInfo" width="68%" append-to-body draggable>
      <el-table :data="tenantInfoList" v-loading="loadingConfig" style="width: 100%">
        <el-table-column prop="corpId" label="企业ID" />
        <el-table-column prop="agentName" label="应用名" />
        <el-table-column prop="agentSecret" label="应用密钥" />
        <el-table-column prop="token" label="回调token" />
        <el-table-column prop="aesKey" label="回调aesKey" />
        <el-table-column prop="backOffUrl" label="回调URL" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup name="Tenant">
import { listTenant, disableTenant, enableTenant, saveTenant, treeselectTenant, updateTenant, getTenantInfo, infoTenant } from "@/api/tenant/tenant";
const { proxy } = getCurrentInstance();
const { wecom_tenant_staus } = proxy.useDict("wecom_tenant_staus");

const tenantList = ref([]);
const tenantInfoList = ref([])
const loading = ref(true);
const loadingConfig = ref(true);
const showSearch = ref(true);
const total = ref(0);
const dateRange = ref([]);
const checkedKeys = reactive([])
const data = reactive({
  form:{},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    status: undefined
  },
  rules: {
    name: [{ required: true, message: "租户名称不能为空", trigger: "blur" }],
    plainCorpId: [{ required: true, message: "企业信息ID不能为空", trigger: "blur" }],
  },
  menuForm:{}
});
const openData = ref(false);
const open = ref(false);
const openInfo = ref(false);

const tenantOptions = ref([]);
const tenantExpand = ref(false);
const tenantNodeAll = ref(false);
const tenantRef = ref(null);
const visible = ref(false)

const { queryParams, form, rules, menuForm } = toRefs(data);
/** 查询参数列表 */
function getList() {
  loading.value = true;
  listTenant(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
    if (response.code === 200){
      tenantList.value = response.data.list;
      total.value = Number(response.data.total);
      loading.value = false;
    }
  }).catch(err =>{
    loading.value = false;
  })
}
/** 搜索按钮操作 */
function handleQuery() {
  dateRange.value = [];
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 清空事件 */
function handleSearch(){
  handleQuery()
}
/** 新增 */
function handleAdd() {
  reset()
  openData.value = true
}

/** 租户状态修改 */
function handleStatusChange(row) {
  let text = row.status === 0 ? "启用" : "禁用";
  proxy.$modal.confirm('确认要"' + text + '""' + row.name + '"角色吗?').then(function () {
    if (row.status === 0){
      disableTenant(row.id).then(res =>{
        proxy.$modal.msgSuccess(text + "成功");
        getList()
      }).catch(err =>{

      })
    } else if(row.status = 1) {
      enableTenant(row.id).then(res =>{
        proxy.$modal.msgSuccess(text + "成功");
        getList()
      }).catch(err =>{

      })
    }
  })
}

// 弹窗
/** 重置新增的表单以及其他数据  */
function reset() {
  tenantExpand.value = false;
  tenantNodeAll.value = false;
  form.value = {
    name: undefined,
    plainCorpId: undefined,
    url: undefined,
    loginBackground: undefined,
    serverIps: undefined,
    logo: undefined,
    status: 0,
  };
  menuForm.value = {
    menuId: undefined,
    status: '0',
    expirationTime: '',
    tenantCheckStrictly: true,
  }
  // 新增
  proxy.resetForm("tenantData");
}

/** 确定按钮 */
function submitForm(){
  proxy.$refs["tenantData"].validate(valid => {
    if (valid) {
      saveTenant(form.value).then(response => {
        proxy.$modal.msgSuccess("新增成功");
        openData.value = false;
        getList();
      });
    }
  })
}
/** 取消按钮 */
function cancel() {
  openData.value = false;
  reset();
}

/** 编辑 */
function handleEdit(row){
  infoTenant({tenantId:row.id}).then(res =>{
    if (res.code === 200){
      openData.value = true
      form.value = res.data
    }
  })
}
/** 分配权限 */
function handleUpdate(row){
  if(row.id){
    reset()
    open.value = true;
    getTenantTreeselect({tenantId:row.id})
  }
}
/** 展示参数 */
function handleView(row){
  loadingConfig.value = true;
  getTenantInfo({tenantId: row.id}).then(res =>{
    if (res.code === 200){
      openInfo.value = true
      loadingConfig.value = false
      tenantInfoList.value = [res.data]
    }
  })
}
/** 查询菜单树结构 */
function getTenantTreeselect(obj) {
  treeselectTenant(obj).then(response => {
    if(response.code === 200){
      tenantOptions.value = response.data;
      recursionTree(response.data)
    }
  });
}
const recursionTree = (childnodes) => {
  childnodes.forEach(node=>{
    if(node.children){
      recursionTree(node.children)
    }else{
      if(node.status === '0'){
        checkedKeys.push(node.id)
      }
    }
  })
}

function changeTree(node){
  handleEditDate(node)
}
/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value) {
  let treeList = tenantOptions.value;
  for (let i = 0; i < treeList.length; i++) {
    tenantRef.value.store.nodesMap[treeList[i].id].expanded = value;
  }
}
/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value) {
  tenantRef.value.setCheckedNodes(value ? tenantOptions.value : []);
}
/** 树权限（父子联动） */
function handleCheckedTreeConnect(value) {
  menuForm.value.tenantCheckStrictly = value ? true : false;
}
/** 修改租户菜单 */
function handleEditDate(node){
  //只是获取选中状态
  // let param = tenantRef.value.getCheckedNodes().map(node=>{
  //   return {...node, status: '0', menuId: node.id,children: []}
  // })
  let status = tenantRef.value.getNode(node.id).checked?'0':'1'
  let param = [{...node, status: status, menuId: node.id,children: []}]
  updateTenant(param).then(res =>{
    if (res.code === 200){
      proxy.$modal.msgSuccess( res.msg );
    }
  })
}
/** 确定 */
function submitDataScope(){
  open.value = false;
  getList()
  handleEditDate()
  reset()
}
/** 取消 */
function cancelDataScope(){
  open.value = false;
  reset()
}

getList();
</script>

<style lang='scss' scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.custom-tree-node ::v-deep .el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 140px;
}
.custom-tree-node ::v-deep .el-input__inner{
  box-shadow:0 0 0 0;
  background: 0;
  padding: 0;
}
.custom-tree-node ::v-deep .el-input__prefix{
  display: none;
}
</style>
