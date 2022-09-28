<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <el-form-item label="机构名称" prop="name">
            <el-input
               v-model="queryParams.name"
               placeholder="请输入机构名称"
               clearable
               style="width: 240px"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="状态" prop="state">
            <el-select v-model="queryParams.state" placeholder="机构状态" clearable>
               <el-option
                  v-for="dict in sys_normal_disable"
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

     <div class="btn-back">
      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button
               type="primary"
               plain
               icon="Plus"
               @click="handleAdd"
               v-hasPermi="['system:dept:add']"
            >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="info"
               plain
               icon="Sort"
               @click="toggleExpandAll"
            >展开/折叠</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
     </div>

      <el-table
         v-if="refreshTable"
         v-loading="loading"
         :data="deptList"
         row-key="deptId"
         :default-expand-all="isExpandAll"
         :tree-props="{ children: 'children' }"
      >
         <el-table-column prop="name" label="机构名称" min-width="200px" show-tooltip-when-overflow></el-table-column>
         <el-table-column prop="fullname"  min-width="200px" label="机构全称" show-tooltip-when-overflow></el-table-column>
         <el-table-column prop="sort" label="排序" ></el-table-column>
         <el-table-column prop="state" label="状态" >
            <template #default="scope">
<!--               <dict-tag :options="sys_normal_disable" :value="scope.row.state" />-->
              <span v-if="scope.row.state == 1" class="state-item1">正常</span>
              <span v-if="scope.row.state == 0" class="state-item2">停用</span>
            </template>
         </el-table-column>
         <el-table-column label="创建时间" align="center" prop="createTime" show-tooltip-when-overflow>
            <template #default="scope">
               <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
            <template #default="scope">
<!--              <el-button-->
<!--                  type="text"-->
<!--                  icon="Plus"-->
<!--                  size="small"-->
<!--                  @click="handleAdd(scope.row)"-->
<!--                  v-hasPermi="['system:dept:add']"-->
<!--              >新增</el-button>-->
              <div class="btn-col">
                <el-button
                    type="text"
                    icon="Edit"
                    size="small"
                    v-if="scope.row.parentId !== null"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['system:dept:edit']"
                >修改</el-button>
                <el-button
                    type="text"
                    icon="Delete"
                    size="small"
                    v-if="scope.row.parentId !== null"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['system:dept:remove']"
                >删除</el-button>
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

      <!-- 添加或修改部门对话框 -->
      <el-dialog :title="title" v-model="open" width="750px" append-to-body :close-on-click-modal="false" draggable>
         <el-form ref="deptRef" :model="form" :rules="rules" label-width="100px">
            <el-row>
               <el-col :span="24">
                  <el-form-item label="上级机构" >
                     <el-tree-select
                        v-model="form.parentId"
                        :data="deptOptions"
                        :render-after-expand="false"
                        :props="{ value: 'id', label: 'name', children: 'children' }"
                        value-key="id"
                        clearable
                        placeholder="选择上级机构"
                        check-strictly
                        style="width: 100%"
                     />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="机构名称" prop="name">
                     <el-input v-model="form.name" placeholder="请输入机构名称" />
                  </el-form-item>
               </el-col>
              <el-col :span="12">
                <el-form-item label="机构全称" prop="fullname">
                  <el-input v-model="form.fullname" placeholder="请输入机构全称" />
                </el-form-item>
              </el-col>
               <el-col :span="12">
                  <el-form-item label="显示排序" prop="sort">
                     <el-input-number v-model="form.sort" controls-position="right" :min="0" style="width: 100%;" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="机构状态">
                     <el-radio-group v-model="form.state">
                        <el-radio
                           v-for="dict in sys_normal_disable"
                           :key="dict.value"
                           :label="dict.value"
                        >{{ dict.label }}</el-radio>
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
   </div>
</template>

<script setup name="Dept">
import { treeselect, getDept, delDept, addDept, updateDept, listDept } from "@/api/system/dept";

const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict("sys_normal_disable");

const deptList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const title = ref("");
const deptOptions = ref([]);
const isExpandAll = ref(true);
const refreshTable = ref(true);

const data = reactive({
  form: {},
  queryParams: {
    name: undefined,
    state: undefined,
    pageNum: 1,
    pageSize: 10,
  },
  rules: {
    name: [{ required: true, message: "机构名称不能为空", trigger: "blur" }],
    fullname: [{ required: true, message: "机构全称不能为空", trigger: "blur" }],
    sort: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询部门列表 */
function getList() {
  loading.value = true;
  listDept(queryParams.value).then(response => {
    deptList.value = proxy.handleTree(response.data.list, "deptId");
    total.value = Number(response.data.total);
    loading.value = false;
  });
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  form.value = {
    deptId: undefined,
    parentId: undefined,
    fullname:undefined,
    name: undefined,
    sort: 0,
    state: 1
  };
  proxy.resetForm("deptRef");
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 新增按钮操作 */
function handleAdd(row) {
  reset();
  treeselect().then(response => {
    // deptOptions.value = proxy.handleTree(response.data.list, "id");
    deptOptions.value = response.data.list
  });
  // if (row != undefined) {
  //   form.value.parentId = row.deptId;
  // }
  open.value = true;
  title.value = "添加机构";
}
/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}
/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
  // treeselect({nodeId:row.id}).then(response => {
  // deptOptions.value = proxy.handleTree(response.data.list, "id");
  await treeselect().then(response => {
    deptOptions.value = response.data.list
  });
  await getDept(row.deptId).then(response => {
    form.value = response.data;
    form.value.parentId = form.value.parentId.toString()
    open.value = true;
    title.value = "修改机构";
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["deptRef"].validate(valid => {
    if (valid) {
      if (form.value.deptId != undefined) {
        updateDept(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDept(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除名称为"' + row.name + '"的数据项?').then(function() {
    return delDept(row.deptId);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

getList();
</script>
