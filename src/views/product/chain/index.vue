<template>
  <div class="app-container">
    <div class="desc">
      <span>所有商品 —— 用户管理自己归属的所有商品</span>
    </div>
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="产品编号" prop="code">
        <el-input style="width: 300px" v-model="queryParams.code" placeholder="请输入产品编号" clearable
                  @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="产品简称" prop="name">
        <el-input style="width: 300px" v-model="queryParams.name" placeholder="请输入产品简称" clearable
                  @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="产品类别" prop="productType">
        <el-input style="width: 300px" v-model="queryParams.productType" placeholder="请输入产品类别" clearable
                  @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="品牌" prop="brands">
        <el-input style="width: 300px" v-model="queryParams.brands" placeholder="请输入产品品牌" clearable
                  @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item class="label">
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="btn-back">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="Plus" @click="handleAdd" plain>新增产品</el-button>
          <el-button
              type="info"
              plain
              icon="Upload"
              @click="handleImport"
          >导入
          </el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
    </div>

    <!--    <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">-->
    <el-table v-loading="loading" :data="productList">
      <!--      <el-table-column type="selection" width="55" align="center"/>-->
      <el-table-column label="69码" prop="barCode" show-tooltip-when-overflow/>
      <el-table-column label="产品ID" prop="productId" show-tooltip-when-overflow width="200"/>
      <el-table-column label="产品编号" prop="code" show-tooltip-when-overflow/>
      <el-table-column label="产品简称" prop="name" show-tooltip-when-overflow/>
      <el-table-column label="产品全称" prop="fullname" show-tooltip-when-overflow/>
      <el-table-column label="产品类别" prop="productType" show-tooltip-when-overflow/>
      <el-table-column label="产品等级" prop="level" show-tooltip-when-overflow/>
      <el-table-column label="品牌" prop="brand" show-tooltip-when-overflow/>
      <el-table-column label="规格" prop="specification" show-tooltip-when-overflow/>
      <el-table-column label="最小计量单位" prop="unit" min-width="110px"/>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="150px">
        <template #default="scope">
          <div class="btn-col">
            <el-button
                type="text"
                icon="Edit"
                size="small"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['wecom:product:edit']"
            >修改
            </el-button>
            <el-button
                type="text"
                icon="Delete"
                size="small"
                @click="handleDelete(scope.row)"
                v-hasPermi="['wecom:product:remove']"
            >删除
            </el-button>
          </div>
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

    <!-- 添加或修改连锁门店销售的所有产品的数据对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body :close-on-click-modal="false" draggable>
      <el-form ref="productRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item class="label" label="商家产品ID" prop="productChainId">
          <el-input v-model="form.productChainId" placeholder="请输入商家产品ID"/>
        </el-form-item>
        <el-form-item class="label" label="产品ID" prop="productId">
          <el-input v-model="form.productId" placeholder="请输入产品ID"/>
        </el-form-item>
        <el-form-item class="label" label="公司ID">
          <el-input v-model="form.corpId" placeholder="请输入公司ID"/>
        </el-form-item>
        <el-form-item class="label" label="自定义标签" prop="tag">
          <el-input v-model="form.tag" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item class="label" label="序号" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入序号"/>
        </el-form-item>
        <el-form-item class="label" label="创建人" prop="createUserId">
          <el-input v-model="form.createUserId" placeholder="请输入创建人"/>
        </el-form-item>
        <el-form-item class="label" label="修改人" prop="updateUserId">
          <el-input v-model="form.updateUserId" placeholder="请输入修改人"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 产品导入和模板下载   -->
    <el-dialog title="产品导入" v-model="upload.open" width="50%" append-to-body :close-on-click-modal="false"
               draggable>
      <el-upload
          ref="uploadRef"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport"/>
              是否更新已经存在的产品数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                     @click="importTemplate">下载模板
            </el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Chain">
import {listProduct, getProduct, delProduct, addProduct, updateProduct} from "@/api/product/chainProduct";
import {getToken} from "@/utils/auth";

const {proxy} = getCurrentInstance();
// const { ${dictsNoSymbol} } = proxy.useDict(${dicts});

const productList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
// const ids = ref([]);
// const single = ref(true);
// const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    code: null,
    productType: null,
    brands: null
  },
  rules: {
    productChainId: [
      {required: true, message: "商家产品ID不能为空", trigger: "blur"}
    ], companyId: [
      {required: true, message: "公司ID不能为空", trigger: "blur"}
    ],
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询连锁门店销售的所有产品的数据列表 */
function getList() {
  loading.value = true;
  listProduct(queryParams.value).then(response => {
    productList.value = response.data.list;
    total.value = Number(response.data.total);
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
    productChainId: null,
    productId: null,
    companyId: null,
    tag: null,
    sort: null,
    createUserId: null,
    createTime: null,
    updateUserId: null,
    updateTime: null
  };
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

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};

/** 下载模板操作 */
function importTemplate() {
  proxy.downloadToGet("/product/product/exportTemplate", `product_template_${new Date().getTime()}.xlsx`);
};
/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（订单导入）
  open: false,
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/product/product/importData"
});

/** 导入按钮操作 */
function handleImport() {
  upload.title = "用户导入";
  upload.open = true;
};

/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  upload.open = false
  upload.isUploading = false;
  getList();
};
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};

// 多选框选中数据
// function handleSelectionChange(selection) {
//   ids.value = selection.map(item => item.productChainid);
//   // single.value = selection.length != 1;
//   // multiple.value = !selection.length;
// }

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加连锁门店销售的所有产品的数据";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  // let _productChainid = row.productChainId || ids.value
  let _productChainid = row.productChainId;
  getProduct(_productChainid).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改连锁门店销售的所有产品的数据";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["productRef"].validate(valid => {
    if (valid) {
      if (form.value.productChainId != null) {
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
  // const _productChainids = row.productChainId || ids.value;
  const _productChainids = row.productChainId;
  proxy.$modal.confirm('是否确认删除连锁门店销售的所有产品的数据编号为"' + _productChainids + '"的数据项？').then(function () {
    return delProduct(_productChainids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('wecom/product/export', {
    ...queryParams.value
  }, `product_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style lang="scss" scoped>
.label::v-deep( .el-form-item__label) {
  color: #606266;
  width: 70px;
  justify-content: flex-start !important;
}


.app-container {
  .desc {
    color: #999;
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    margin-bottom: 30px;
  }
}


</style>
