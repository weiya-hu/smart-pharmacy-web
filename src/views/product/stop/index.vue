<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商家产品ID" prop="productChainid">
        <el-input
            v-model="queryParams.productChainid"
            placeholder="请输入商家产品ID"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品ID" prop="productid">
        <el-input
            v-model="queryParams.productid"
            placeholder="请输入产品ID"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司ID" prop="companyid">
        <el-input
            v-model="queryParams.companyid"
            placeholder="请输入公司ID"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="连锁门店ID" prop="storeid">
        <el-input
            v-model="queryParams.storeid"
            placeholder="请输入连锁门店ID"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="序号" prop="sort">
        <el-input
            v-model="queryParams.sort"
            placeholder="请输入序号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人" prop="createUserid">
        <el-input
            v-model="queryParams.createUserid"
            placeholder="请输入创建人"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修改人" prop="updateUserid">
        <el-input
            v-model="queryParams.updateUserid"
            placeholder="请输入修改人"
            clearable
            @keyup.enter="handleQuery"
        />
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
            v-hasPermi="['wecom:store:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['wecom:store:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['wecom:store:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['wecom:store:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="storeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商家产品ID" align="center" prop="productChainid" />
      <el-table-column label="产品ID" align="center" prop="productid" />
      <el-table-column label="公司ID" align="center" prop="companyid" />
      <el-table-column label="连锁门店ID" align="center" prop="storeid" />
      <el-table-column label="自定义标签" align="center" prop="tag" />
      <el-table-column label="序号" align="center" prop="sort" />
      <el-table-column label="创建人" align="center" prop="createUserid" />
      <el-table-column label="修改人" align="center" prop="updateUserid" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['wecom:store:edit']"
          >修改</el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['wecom:store:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改门店销售的产品数据从连锁产品库中继承对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="storeRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商家产品ID" prop="productChainid">
          <el-input v-model="form.productChainid" placeholder="请输入商家产品ID" />
        </el-form-item>
        <el-form-item label="产品ID" prop="productid">
          <el-input v-model="form.productid" placeholder="请输入产品ID" />
        </el-form-item>
        <el-form-item label="公司ID" prop="companyid">
          <el-input v-model="form.companyid" placeholder="请输入公司ID" />
        </el-form-item>
        <el-form-item label="连锁门店ID" prop="storeid">
          <el-input v-model="form.storeid" placeholder="请输入连锁门店ID" />
        </el-form-item>
        <el-form-item label="自定义标签" prop="tag">
          <el-input v-model="form.tag" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="序号" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入序号" />
        </el-form-item>
        <el-form-item label="创建人" prop="createUserid">
          <el-input v-model="form.createUserid" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="修改人" prop="updateUserid">
          <el-input v-model="form.updateUserid" placeholder="请输入修改人" />
        </el-form-item>
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

<script setup name="Stop">
import { listStore, getStore, delStore, addStore, updateStore } from "@/api/product/storeProduct";

const { proxy } = getCurrentInstance();
// const { ${dictsNoSymbol} } = proxy.useDict(${dicts});

const storeList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    productChainid: null,                                                                    productid: null,                                                                    companyid: null,                                                                    storeid: null,                                                                    tag: null,                                                                    sort: null,                                                                    createUserid: null,                                                                                                updateUserid: null,                                                                },
  rules: {
    productChainid: [
      { required: true, message: "商家产品ID不能为空", trigger: "blur" }
    ],                                                                                                                                        companyid: [
      { required: true, message: "公司ID不能为空", trigger: "blur" }
    ],                                                                                                                                                                                                                                        }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询门店销售的产品数据从连锁产品库中继承列表 */
function getList() {
  loading.value = true;
  listStore(queryParams.value).then(response => {
    storeList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    productChainid: null,                                                                    productid: null,                                                                    companyid: null,                                                                    storeid: null,                                                                    tag: null,                                                                    sort: null,                                                                    createUserid: null,                                                                    createTime: null,                                                                    updateUserid: null,                                                                    updateTime: null                                    };
  proxy.resetForm("storeRef");
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

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.productChainid);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加门店销售的产品数据从连锁产品库中继承";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _productChainid = row.productChainid || ids.value
  getStore(_productChainid).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改门店销售的产品数据从连锁产品库中继承";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["storeRef"].validate(valid => {
    if (valid) {
      if (form.value.productChainid != null) {
        updateStore(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addStore(form.value).then(response => {
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
  const _productChainids = row.productChainid || ids.value;
  proxy.$modal.confirm('是否确认删除门店销售的产品数据从连锁产品库中继承编号为"' + _productChainids + '"的数据项？').then(function() {
    return delStore(_productChainids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('wecom/store/export', {
    ...queryParams.value
  }, `store_${new Date().getTime()}.xlsx`)
}

getList();
</script>
