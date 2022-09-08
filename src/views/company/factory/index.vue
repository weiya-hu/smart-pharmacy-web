<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="简称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入简称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="全称" prop="fullname">
        <el-input
            v-model="queryParams.fullname"
            placeholder="请输入全称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择状态" clearable>
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['wecom:maker:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['wecom:maker:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['wecom:maker:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['wecom:maker:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="makerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="生产厂家ID" align="center" prop="makerId" width="100" />
      <el-table-column label="简称" align="center" prop="name" />
      <el-table-column label="类型" align="center" prop="type" />
      <el-table-column label="省份" align="center" prop="province" />
      <el-table-column label="城市" align="center" prop="city" />
      <el-table-column label="区县" align="center" prop="county" />
      <el-table-column label="商务" align="center" prop="business" />
      <el-table-column label="编码" align="center" prop="code" />
      <el-table-column label="状态" align="center" prop="state">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              size="small"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['wecom:maker:edit']"
          >修改</el-button>
          <el-button
              type="text"
              icon="Delete"
              size="small"
              @click="handleDelete(scope.row)"
              v-hasPermi="['wecom:maker:remove']"
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

    <!-- 添加或修改生产厂家对话框 -->
    <el-dialog :title="title" v-model="open" width="64%" append-to-body>
      <el-scrollbar height="640px">
        <el-form ref="makerRef" :model="form" :rules="rules" label-width="100px" class="dialog-form">
        <el-form-item label="简称" prop="name">
          <el-input v-model="form.name" placeholder="请输入简称" />
        </el-form-item>
        <el-form-item label="全称" prop="fullname">
          <el-input v-model="form.fullname" placeholder="请输入全称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="经营范围" prop="businessScope">
          <el-input v-model="form.businessScope" placeholder="请输入经营范围" />
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-input v-model="form.province" placeholder="请输入省份" />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="form.city" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="区县" prop="county">
          <el-input v-model="form.county" placeholder="请输入区县" />
        </el-form-item>
        <el-form-item label="商务" prop="business">
          <el-input v-model="form.business" placeholder="请输入商务" />
        </el-form-item>
        <el-form-item label="商务ID" prop="businessId">
          <el-input v-model="form.businessId" placeholder="请输入商务ID" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.state">
            <el-radio
                v-for="dict in sys_normal_disable"
                :key="dict.value"
                :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="序号" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入序号" />
        </el-form-item>
        <el-form-item label="省份编码" prop="provinceCode">
          <el-input v-model="form.provinceCode" placeholder="请输入省份编码" />
        </el-form-item>
        <el-form-item label="城市编码" prop="cityCode">
          <el-input v-model="form.cityCode" placeholder="请输入城市编码" />
        </el-form-item>
        <el-form-item label="区县编码" prop="countyCode">
          <el-input v-model="form.countyCode" placeholder="请输入区县编码" />
        </el-form-item>
        <el-form-item label="乡镇街道" prop="town">
          <el-input v-model="form.town" placeholder="请输入乡镇街道" />
        </el-form-item>
        <el-form-item label="村社区" prop="community">
          <el-input v-model="form.community" placeholder="请输入村社区" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="纬度" prop="let">
          <el-input v-model="form.let" placeholder="请输入纬度" />
        </el-form-item>
        <el-form-item label="乡镇街道编码" prop="townCode">
          <el-input v-model="form.townCode" placeholder="请输入乡镇街道编码" />
        </el-form-item>
        <el-form-item label="村社区编码" prop="communityCode">
          <el-input v-model="form.communityCode" placeholder="请输入村社区编码" />
        </el-form-item>
      </el-form>
      </el-scrollbar>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Maker">
import { listMaker, getMaker, delMaker, addMaker, updateMaker } from "@/api/factory/corpMaker";

const { proxy } = getCurrentInstance();
const { sys_normal_disable} = proxy.useDict('sys_normal_disable');

const makerList = ref([]);
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
    name: null,                                                                    fullname: null,                                                                    type: null,                                                                    address: null,                                                                    businessScope: null,                                                                    province: null,                                                                    city: null,                                                                    county: null,                                                                    business: null,                                                                    businessId: null,                                                                    code: null,                                                                    state: null,                                                                    sort: null,                                                                    provinceCode: null,                                                                    cityCode: null,                                                                    countyCode: null,                                                                    town: null,                                                                    community: null,                                                                    phone: null,                                                                    longitude: null,                                                                    let: null,                                                                                                                                                                                                            },
  rules: {
    state: [
      { required: true, message: "状态不能为空", trigger: "blur" }
    ],                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询生产厂家列表 */
function getList() {
  loading.value = true;
  listMaker(queryParams.value).then(response => {
    makerList.value = response.data.list;
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
    makerId: null,                                                                    corpId: null,                                                                    name: null,                                                                    fullname: null,                                                                    type: null,                                                                    address: null,                                                                    businessScope: null,                                                                    province: null,                                                                    city: null,                                                                    county: null,                                                                    business: null,                                                                    businessId: null,                                                                    code: null,                                                                state: "0",                                                                    sort: null,                                                                    provinceCode: null,                                                                    cityCode: null,                                                                    countyCode: null,                                                                    town: null,                                                                    community: null,                                                                    phone: null,                                                                    longitude: null,                                                                    let: null,                                                                    townCode: null,                                                                    communityCode: null,                                                                    createBy: null,                                                                    createTime: null,                                                                    updateBy: null,                                                                    updateTime: null                                    };
  proxy.resetForm("makerRef");
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
  ids.value = selection.map(item => item.makerId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加生产厂家";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _makerId = row.makerId || ids.value
  getMaker(_makerId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改生产厂家";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["makerRef"].validate(valid => {
    if (valid) {
      if (form.value.makerId != null) {
        updateMaker(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addMaker(form.value).then(response => {
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
  const _makerIds = row.makerId || ids.value;
  proxy.$modal.confirm('是否确认删除生产厂家编号为"' + _makerIds + '"的数据项？').then(function() {
    return delMaker(_makerIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('wecom/maker/export', {
    ...queryParams.value
  }, `maker_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style lang="scss" scoped>
.dialog-form {
  padding-right: 18px;
}
</style>