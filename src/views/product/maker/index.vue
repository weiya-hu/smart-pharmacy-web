<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商家产品ID" prop="productMakerid">
        <el-input
            v-model="queryParams.productMakerid"
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
      <el-form-item label="生产许可证" prop="licenseProduction">
        <el-input
            v-model="queryParams.licenseProduction"
            placeholder="请输入生产许可证"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="注册证" prop="licenseRegister">
        <el-input
            v-model="queryParams.licenseRegister"
            placeholder="请输入注册证"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="外包装尺寸" prop="packageSize">
        <el-input
            v-model="queryParams.packageSize"
            placeholder="请输入外包装尺寸"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="税率" prop="taxRate">
        <el-input
            v-model="queryParams.taxRate"
            placeholder="请输入税率"
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
            v-hasPermi="['wecom:product:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['wecom:product:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['wecom:product:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['wecom:product:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商家产品ID" align="center" prop="productMakerid" />
      <el-table-column label="产品ID" align="center" prop="productid" />
      <el-table-column label="公司ID" align="center" prop="companyid" />
      <el-table-column label="连锁门店ID" align="center" prop="storeid" />
      <el-table-column label="自定义标签" align="center" prop="tag" />
      <el-table-column label="生产许可证" align="center" prop="licenseProduction" />
      <el-table-column label="注册证" align="center" prop="licenseRegister" />
      <el-table-column label="外包装尺寸" align="center" prop="packageSize" />
      <el-table-column label="税率" align="center" prop="taxRate" />
      <el-table-column label="序号" align="center" prop="sort" />
      <el-table-column label="创建人" align="center" prop="createUserid" />
      <el-table-column label="修改人" align="center" prop="updateUserid" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['wecom:product:edit']"
          >修改</el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['wecom:product:remove']"
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

    <!-- 添加或修改厂家的产品信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="productRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商家产品ID" prop="productMakerid">
          <el-input v-model="form.productMakerid" placeholder="请输入商家产品ID" />
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
        <el-form-item label="生产许可证" prop="licenseProduction">
          <el-input v-model="form.licenseProduction" placeholder="请输入生产许可证" />
        </el-form-item>
        <el-form-item label="注册证" prop="licenseRegister">
          <el-input v-model="form.licenseRegister" placeholder="请输入注册证" />
        </el-form-item>
        <el-form-item label="外包装尺寸" prop="packageSize">
          <el-input v-model="form.packageSize" placeholder="请输入外包装尺寸" />
        </el-form-item>
        <el-form-item label="税率" prop="taxRate">
          <el-input v-model="form.taxRate" placeholder="请输入税率" />
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

<script setup name="Marker">
import { listProduct, getProduct, delProduct, addProduct, updateProduct } from "@/api/product/makerProduct";

const { proxy } = getCurrentInstance();
// const { ${dictsNoSymbol} } = proxy.useDict(${dicts});

const productList = ref([]);
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
    productMakerid: null,                                                                    productid: null,                                                                    companyid: null,                                                                    storeid: null,                                                                    tag: null,                                                                    licenseProduction: null,                                                                    licenseRegister: null,                                                                    packageSize: null,                                                                    taxRate: null,                                                                    sort: null,                                                                    createUserid: null,                                                                                                updateUserid: null,                                                                },
  rules: {
    productMakerid: [
      { required: true, message: "商家产品ID不能为空", trigger: "blur" }
    ],                                                                                                                                        companyid: [
      { required: true, message: "公司ID不能为空", trigger: "blur" }
    ],                                                                                                                                                                                                                                                                                                                                                        }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询厂家的产品信息列表 */
function getList() {
  loading.value = true;
  listProduct(queryParams.value).then(response => {
    productList.value = response.rows;
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
    productMakerid: null,                                                                    productid: null,                                                                    companyid: null,                                                                    storeid: null,                                                                    tag: null,                                                                    licenseProduction: null,                                                                    licenseRegister: null,                                                                    packageSize: null,                                                                    taxRate: null,                                                                    sort: null,                                                                    createUserid: null,                                                                    createTime: null,                                                                    updateUserid: null,                                                                    updateTime: null                                    };
  proxy.resetForm("productRef");
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
  ids.value = selection.map(item => item.productMakerid);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加厂家的产品信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _productMakerid = row.productMakerid || ids.value
  getProduct(_productMakerid).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改厂家的产品信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["productRef"].validate(valid => {
    if (valid) {
      if (form.value.productMakerid != null) {
        updateProduct(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addProduct(form.value).then(response => {
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
  const _productMakerids = row.productMakerid || ids.value;
  proxy.$modal.confirm('是否确认删除厂家的产品信息编号为"' + _productMakerids + '"的数据项？').then(function() {
    return delProduct(_productMakerids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('wecom/product/export', {
    ...queryParams.value
  }, `product_${new Date().getTime()}.xlsx`)
}

getList();
</script>
