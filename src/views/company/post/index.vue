<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
         <el-form-item label="职务编码" prop="jobId">
            <el-input
               v-model="queryParams.jobId"
               placeholder="请输入职务编码"
               clearable
               style="width: 220px"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="职务名称" prop="name">
            <el-input
               v-model="queryParams.name"
               placeholder="请输入职务名称"
               clearable
               style="width: 220px"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="状态" prop="state">
            <el-select v-model="queryParams.state" placeholder="职务状态" clearable>
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
               v-hasPermi="['system:post:add']"
           >新增</el-button>
         </el-col>
<!--         <el-col :span="1.5">-->
<!--           <el-button-->
<!--               type="success"-->
<!--               plain-->
<!--               icon="Edit"-->
<!--               :disabled="single"-->
<!--               @click="handleUpdate"-->
<!--               v-hasPermi="['system:post:edit']"-->
<!--           >修改</el-button>-->
<!--         </el-col>-->
         <!--         <el-col :span="1.5">-->
         <!--            <el-button-->
         <!--               type="danger"-->
         <!--               plain-->
         <!--               icon="Delete"-->
         <!--               :disabled="multiple"-->
         <!--               @click="handleDelete"-->
         <!--               v-hasPermi="['system:post:remove']"-->
         <!--            >删除</el-button>-->
         <!--         </el-col>-->
         <!--         <el-col :span="1.5">-->
         <!--            <el-button-->
         <!--               type="warning"-->
         <!--               plain-->
         <!--               icon="Download"-->
         <!--               @click="handleExport"-->
         <!--               v-hasPermi="['system:post:export']"-->
         <!--            >导出</el-button>-->
         <!--         </el-col>-->
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
       </el-row>
     </div>

      <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
<!--         <el-table-column type="selection" width="55" />-->
         <el-table-column label="职务编号" prop="jobId" show-tooltip-when-overflow />
         <el-table-column label="职务名称" prop="name" />
         <el-table-column label="职务排序" prop="sort" />
         <el-table-column label="状态" prop="state">
            <template #default="scope">
<!--               <dict-tag :options="sys_normal_disable" :value="scope.row.state" />-->
              <span v-if="scope.row.state == 1" class="state-item1">正常</span>
              <span v-if="scope.row.state == 0" class="state-item2">停用</span>
            </template>
         </el-table-column>
         <el-table-column label="创建时间"  prop="createTime" show-tooltip-when-overflow>
            <template #default="scope">
               <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="操作"  class-name="small-padding fixed-width" width="150">
            <template #default="scope">
              <div class="btn-col">
                <el-button
                    type="text"
                    icon="Edit"
                    size="small"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['system:post:edit']"
                >修改</el-button>
                <el-button
                    type="text"
                    icon="Delete"
                    size="small"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['system:post:remove']"
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

      <!-- 添加或修改职务对话框 -->
      <el-dialog :title="title" v-model="open" width="50%" append-to-body :close-on-click-modal="false" draggable>
         <el-form ref="postRef" :model="form" :rules="rules" label-width="100px">
           <el-row>
             <el-col :span="24">
               <el-form-item label="职务名称" prop="name">
                 <el-input v-model="form.name" placeholder="请输入职务名称" />
               </el-form-item>
             </el-col>
             <el-col :span="24">
               <el-form-item label="职务性质" prop="code">
                 <el-radio-group v-model.number="form.code">
                   <el-radio :label="item.value" v-for="item in post_type" :key="item.value">{{item.label}}</el-radio>
                 </el-radio-group>
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="职务顺序" prop="sort">
                 <el-input-number v-model.number="form.sort" controls-position="right" :min="0" style="width: 100%" />
               </el-form-item>
             </el-col>

             <el-col :span="12">
               <el-form-item label="职务状态" prop="state">
                 <el-radio-group v-model.number="form.state">
<!--                   <el-radio-->
<!--                       v-for="dict in sys_normal_disable"-->
<!--                       :key="dict.value"-->
<!--                       :label="dict.value"-->
<!--                   >{{ dict.label }}</el-radio>-->
                   <el-radio :label="1">启用</el-radio>
                   <el-radio :label="0">停用</el-radio>
                 </el-radio-group>
               </el-form-item>
             </el-col>
             <el-col :span="24">
               <el-form-item label="备注" prop="remark">
                 <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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

<script setup name="Post">
import { listPost, addPost, delPost, getPost, updatePost } from "@/api/system/post";

const { proxy } = getCurrentInstance();
const { sys_normal_disable,post_type } = proxy.useDict("sys_normal_disable",'post_type');
const postList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const jobId = ref(null)

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    state: undefined,
    jobId:'',
  },
  rules: {
    name: [{ required: true, message: "职务名称不能为空", trigger: "blur" }],
    sort: [{ required: true, message: "职务顺序不能为空", trigger: "blur" }],
    code: [{ required: true, message: "请选择职务性质", trigger: "change" }],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询职务列表 */
function getList() {
  loading.value = true;
  listPost(queryParams.value).then(response => {
    postList.value = response.data.list;
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
    code:NaN,
    jobId: undefined,
    name: undefined,
    sort: 0,
    state: 1,
    remark: undefined
  };
  proxy.resetForm("postRef");
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
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.jobId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
  selection.map(items => {
    jobId.value = items.jobId
  })
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加职务";
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  // const jobId = row.jobId || ids.value;
  const jobIds = row.jobId || jobId.value
  getPost({id: jobIds}).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改职务";
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["postRef"].validate(valid => {
    if (valid) {
      if (form.value.jobId != undefined) {
        updatePost(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPost(form.value).then(response => {
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
  // const jobIds = row.jobId || ids.value;
  const jobIds = row.jobId;
  proxy.$modal.confirm('是否确认删除职务编号为"' + jobIds + '"的数据项？').then(function() {
    return delPost(jobIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/post/export", {
    ...queryParams.value
  }, `post_${new Date().getTime()}.xlsx`);
}
getList();
</script>
