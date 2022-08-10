<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="企业ID" prop="corpId">
        <el-input
            v-model="queryParams.corpId"
            placeholder="请输入企业ID"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户ID" prop="userId">
        <el-input
            v-model="queryParams.userId"
            placeholder="请输入用户ID"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型:1和平,2鑫斛,3健之佳,等" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型:1和平,2鑫斛,3健之佳,等" clearable>
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门ID" prop="storeContrastId">
        <el-input
            v-model="queryParams.storeContrastId"
            placeholder="请输入部门ID"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="门店ID" prop="storeId">
        <el-input
            v-model="queryParams.storeId"
            placeholder="请输入门店ID"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="门店名称" prop="storeName">
        <el-input
            v-model="queryParams.storeName"
            placeholder="请输入门店名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单时间" prop="orderTime">
        <el-date-picker clearable
                        v-model="queryParams.orderTime"
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择订单时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="门店的货品ID" prop="storeProductId">
        <el-input
            v-model="queryParams.storeProductId"
            placeholder="请输入门店的货品ID"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品名" prop="productName">
        <el-input
            v-model="queryParams.productName"
            placeholder="请输入商品名"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数据库对应的产品ID" prop="productId">
        <el-input
            v-model="queryParams.productId"
            placeholder="请输入数据库对应的产品ID"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="销售数量" prop="saleAmount">
        <el-input
            v-model="queryParams.saleAmount"
            placeholder="请输入销售数量"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="药店药品单价(DDI返回数据)" prop="storeProductPrice">
        <el-input
            v-model="queryParams.storeProductPrice"
            placeholder="请输入药店药品单价(DDI返回数据)"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实收金额" prop="paidinAmount">
        <el-input
            v-model="queryParams.paidinAmount"
            placeholder="请输入实收金额"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否有退款订单,0否,1是,退款订单不计算业绩等" prop="isCancelOrder">
        <el-input
            v-model="queryParams.isCancelOrder"
            placeholder="请输入是否有退款订单,0否,1是,退款订单不计算业绩等"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否核销,0否,1是;" prop="isWriteoff">
        <el-input
            v-model="queryParams.isWriteoff"
            placeholder="请输入是否核销,0否,1是;"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最后更新版本" prop="lastVer">
        <el-input
            v-model="queryParams.lastVer"
            placeholder="请输入最后更新版本"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="门店订单ID" prop="storeOrderId">
        <el-input
            v-model="queryParams.storeOrderId"
            placeholder="请输入门店订单ID"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批次号" prop="batchNo">
        <el-input
            v-model="queryParams.batchNo"
            placeholder="请输入批次号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规格" prop="productSpecifications">
        <el-input
            v-model="queryParams.productSpecifications"
            placeholder="请输入规格"
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
            v-hasPermi="['wecom:order:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['wecom:order:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['wecom:order:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['wecom:order:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="企业ID" align="center" prop="corpId" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="类型:1和平,2鑫斛,3健之佳,等" align="center" prop="type" />
      <el-table-column label="部门ID" align="center" prop="storeContrastId" />
      <el-table-column label="门店ID" align="center" prop="storeId" />
      <el-table-column label="门店名称" align="center" prop="storeName" />
      <el-table-column label="订单时间" align="center" prop="orderTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.orderTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="门店的货品ID" align="center" prop="storeProductId" />
      <el-table-column label="商品名" align="center" prop="productName" />
      <el-table-column label="数据库对应的产品ID" align="center" prop="productId" />
      <el-table-column label="销售数量" align="center" prop="saleAmount" />
      <el-table-column label="药店药品单价(DDI返回数据)" align="center" prop="storeProductPrice" />
      <el-table-column label="实收金额" align="center" prop="paidinAmount" />
      <el-table-column label="是否有退款订单,0否,1是,退款订单不计算业绩等" align="center" prop="isCancelOrder" />
      <el-table-column label="是否核销,0否,1是;" align="center" prop="isWriteoff" />
      <el-table-column label="最后更新版本" align="center" prop="lastVer" />
      <el-table-column label="门店订单ID" align="center" prop="storeOrderId" />
      <el-table-column label="批次号" align="center" prop="batchNo" />
      <el-table-column label="规格" align="center" prop="productSpecifications" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['wecom:order:edit']"
          >修改</el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['wecom:order:remove']"
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

    <!-- 添加或修改DDI订单对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="orderRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="企业ID" prop="corpId">
          <el-input v-model="form.corpId" placeholder="请输入企业ID" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="类型:1和平,2鑫斛,3健之佳,等" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型:1和平,2鑫斛,3健之佳,等">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门ID" prop="storeContrastId">
          <el-input v-model="form.storeContrastId" placeholder="请输入部门ID" />
        </el-form-item>
        <el-form-item label="门店ID" prop="storeId">
          <el-input v-model="form.storeId" placeholder="请输入门店ID" />
        </el-form-item>
        <el-form-item label="门店名称" prop="storeName">
          <el-input v-model="form.storeName" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="订单时间" prop="orderTime">
          <el-date-picker clearable
                          v-model="form.orderTime"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择订单时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="门店的货品ID" prop="storeProductId">
          <el-input v-model="form.storeProductId" placeholder="请输入门店的货品ID" />
        </el-form-item>
        <el-form-item label="商品名" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入商品名" />
        </el-form-item>
        <el-form-item label="数据库对应的产品ID" prop="productId">
          <el-input v-model="form.productId" placeholder="请输入数据库对应的产品ID" />
        </el-form-item>
        <el-form-item label="销售数量" prop="saleAmount">
          <el-input v-model="form.saleAmount" placeholder="请输入销售数量" />
        </el-form-item>
        <el-form-item label="药店药品单价(DDI返回数据)" prop="storeProductPrice">
          <el-input v-model="form.storeProductPrice" placeholder="请输入药店药品单价(DDI返回数据)" />
        </el-form-item>
        <el-form-item label="实收金额" prop="paidinAmount">
          <el-input v-model="form.paidinAmount" placeholder="请输入实收金额" />
        </el-form-item>
        <el-form-item label="是否有退款订单,0否,1是,退款订单不计算业绩等" prop="isCancelOrder">
          <el-input v-model="form.isCancelOrder" placeholder="请输入是否有退款订单,0否,1是,退款订单不计算业绩等" />
        </el-form-item>
        <el-form-item label="是否核销,0否,1是;" prop="isWriteoff">
          <el-input v-model="form.isWriteoff" placeholder="请输入是否核销,0否,1是;" />
        </el-form-item>
        <el-form-item label="最后更新版本" prop="lastVer">
          <el-input v-model="form.lastVer" placeholder="请输入最后更新版本" />
        </el-form-item>
        <el-form-item label="门店订单ID" prop="storeOrderId">
          <el-input v-model="form.storeOrderId" placeholder="请输入门店订单ID" />
        </el-form-item>
        <el-form-item label="批次号" prop="batchNo">
          <el-input v-model="form.batchNo" placeholder="请输入批次号" />
        </el-form-item>
        <el-form-item label="规格" prop="productSpecifications">
          <el-input v-model="form.productSpecifications" placeholder="请输入规格" />
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

<script setup >
import { listOrder, getOrder, delOrder, addOrder, updateOrder } from "@/api/index12";

const { proxy } = getCurrentInstance();
const { ${dictsNoSymbol} } = proxy.useDict(${dicts});

const orderList = ref([]);
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
    corpId: null,                                                                    userId: null,                                                                    type: null,                                                                    storeContrastId: null,                                                                    storeId: null,                                                                    storeName: null,                                                                    orderTime: null,                                                                    storeProductId: null,                                                                    productName: null,                                                                    productId: null,                                                                    saleAmount: null,                                                                    storeProductPrice: null,                                                                    paidinAmount: null,                                                                    isCancelOrder: null,                                                                    isWriteoff: null,                                                                    lastVer: null,                                                                                                                                                                                    storeOrderId: null,                                                                    batchNo: null,                                                                    productSpecifications: null                                    },
  rules: {
    corpId: [
      { required: true, message: "企业ID不能为空", trigger: "blur" }
    ],                                                                                                                                        type: [
      { required: true, message: "类型:1和平,2鑫斛,3健之佳,等不能为空", trigger: "change" }
    ],                                                                                                                                        storeId: [
      { required: true, message: "门店ID不能为空", trigger: "blur" }
    ],                                                                                                            storeName: [
      { required: true, message: "门店名称不能为空", trigger: "blur" }
    ],                                                                                                            orderTime: [
      { required: true, message: "订单时间不能为空", trigger: "blur" }
    ],                                                                                                            storeProductId: [
      { required: true, message: "门店的货品ID不能为空", trigger: "blur" }
    ],                                                                                                                                        productId: [
      { required: true, message: "数据库对应的产品ID不能为空", trigger: "blur" }
    ],                                                                                                            saleAmount: [
      { required: true, message: "销售数量不能为空", trigger: "blur" }
    ],                                                                                                                                        paidinAmount: [
      { required: true, message: "实收金额不能为空", trigger: "blur" }
    ],                                                                                                            isCancelOrder: [
      { required: true, message: "是否有退款订单,0否,1是,退款订单不计算业绩等不能为空", trigger: "blur" }
    ],                                                                                                            isWriteoff: [
      { required: true, message: "是否核销,0否,1是;不能为空", trigger: "blur" }
    ],                                                                                                            lastVer: [
      { required: true, message: "最后更新版本不能为空", trigger: "blur" }
    ],                                                                                                                                                                                                                                        }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询DDI订单列表 */
function getList() {
  loading.value = true;
  listOrder(queryParams.value).then(response => {
    orderList.value = response.rows;
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
    id: null,                                                                    corpId: null,                                                                    userId: null,                                                                    type: null,                                                                    storeContrastId: null,                                                                    storeId: null,                                                                    storeName: null,                                                                    orderTime: null,                                                                    storeProductId: null,                                                                    productName: null,                                                                    productId: null,                                                                    saleAmount: null,                                                                    storeProductPrice: null,                                                                    paidinAmount: null,                                                                    isCancelOrder: null,                                                                    isWriteoff: null,                                                                    lastVer: null,                                                                    createTime: null,                                                                    updateTime: null,                                                                    updateBy: null,                                                                    createBy: null,                                                                    storeOrderId: null,                                                                    batchNo: null,                                                                    productSpecifications: null                                    };
  proxy.resetForm("orderRef");
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
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加DDI订单";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getOrder(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改DDI订单";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["orderRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateOrder(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addOrder(form.value).then(response => {
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
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除DDI订单编号为"' + _ids + '"的数据项？').then(function() {
    return delOrder(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('wecom/order/export', {
    ...queryParams.value
  }, `order_${new Date().getTime()}.xlsx`)
}

getList();
</script>
