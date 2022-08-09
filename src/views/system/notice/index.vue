<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
         <el-form-item label="公告标题" prop="title">
            <el-input
               v-model="queryParams.title"
               placeholder="请输入公告标题"
               clearable
               @clear="handleSearch"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="操作人员" prop="createBy">
            <el-input
               v-model="queryParams.createBy"
               placeholder="请输入操作人员"
               clearable
               @clear="handleSearch"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="名称" prop="btnName">
            <el-select v-model="queryParams.btnName" placeholder="按钮名称" clearable @clear="handleSearch">
               <el-option
                  v-for="dict in sys_notice_type"
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
               v-hasPermi="['system:notice:add']"
            >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="warning"
               plain
               icon="Edit"
               :disabled="single"
               @click="handleUpdate"
               v-hasPermi="['system:notice:edit']"
            >修改</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               icon="Delete"
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['system:notice:remove']"
            >删除</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" />
         <el-table-column label="ID" prop="id" width="90" />
         <el-table-column label="公告标题" prop="title" :show-overflow-tooltip="true"/>
         <el-table-column label="模板名称" prop="name" :show-overflow-tooltip="true" />
         <el-table-column label="按钮名称" prop="btnName">
            <template #default="scope">
               <dict-tag :options="sys_notice_type" :value="scope.row.btnName" />
            </template>
         </el-table-column>
         <el-table-column label="关键词" prop="keywords" />
         <el-table-column label="创建者" prop="createBy" />
         <el-table-column label="创建时间" prop="createTime">
            <template #default="scope">
               <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template>
         </el-table-column>
         <el-table-column label="操作" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button
                  type="text"
                  icon="Edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:notice:edit']"
               ></el-button>
               <el-button
                  type="text"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:notice:remove']"
               ></el-button>
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

      <!-- 添加或修改公告对话框 -->
      <el-dialog :title="title" v-model="open" width="780px" append-to-body draggable>
         <el-form ref="noticeRef" :model="form" :rules="rules" label-width="90px">
            <el-row>
               <el-col :span="12">
                  <el-form-item label="公告标题" prop="title">
                     <el-input v-model="form.title" placeholder="请输入公告标题" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="按钮名称" prop="btnName">
                     <el-select v-model="form.btnName" placeholder="请选择" style="width: 100%;">
                       <el-option
                           v-for="dict in sys_notice_type"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"
                       />
                     </el-select>
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                 <el-form-item label="模板名称" prop="name">
                   <el-input v-model="form.name" placeholder="请输入模板名称" />
                 </el-form-item>
               </el-col>
              <el-col :span="12">
                <el-form-item label="关键词">
                  <el-input v-model="form.keywords" />
                </el-form-item>
              </el-col>
               <el-col :span="24">
                  <el-form-item label="内容">
<!--                     <el-input-->
<!--                        :rows="6"-->
<!--                        type="textarea"-->
<!--                        placeholder="请输入内容"-->
<!--                        v-model="form.content"-->
<!--                     />-->
<!--                    <WangEditor v-model="form.content" />-->
                    <wang-editor ref="editor" v-model="form.content" />
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

<script setup name="Notice">
import { listNotice, getNotice, delNotice, addNotice, updateNotice } from "@/api/system/notice";
import wangEditor from '@/components/WangEditor/index.vue' ;

const { proxy } = getCurrentInstance();
const { sys_notice_type } = proxy.useDict("sys_notice_type");

const noticeList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {
    content: undefined,
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    title: undefined,
    createBy: undefined,
    btnName: undefined
  },
  rules: {
    title: [{ required: true, message: "公告标题不能为空", trigger: "blur" }],
    btnName: [{ required: true, message: "按钮名称不能为空", trigger: "change" }]
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询公告列表 */
function getList() {
  loading.value = true;
  listNotice(queryParams.value).then(response => {
    noticeList.value = response.data.list;
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
    id: undefined,
    title: undefined,
    btnName: undefined,
    noticeContent: undefined,
  };
  proxy.resetForm("noticeRef");
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
/** 清空事件 */
function handleSearch(){
  handleQuery()
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加公告";
}
/**修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value;
  getNotice(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改公告";
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["noticeRef"].validate(valid => {
    if (valid) {
      if (form.value.id != undefined) {
        updateNotice(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addNotice(form.value).then(response => {
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
  const noticeId = row.id || ids.value
  proxy.$modal.confirm('是否确认删除公告编号为"' + noticeId + '"的数据项？').then(function() {
    return delNotice(noticeId);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

getList();
</script>
