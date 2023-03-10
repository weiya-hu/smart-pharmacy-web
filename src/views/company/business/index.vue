<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" @submit.native.prevent>
      <el-form-item label="机构名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入机构名称"
            clearable
            style="width: 220px"
            @keyup.enter="handleQuery"
        />
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
          >新增
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="info"
              plain
              icon="Sort"
              @click="toggleExpandAll"
          >展开/折叠
          </el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
    </div>

    <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="deptList"
        :default-expand-all="isExpandAll"
        row-key="nodeId"
        :tree-props="{ children: 'children' }"
        height="720px"
    >
      <el-table-column prop="name" label="机构名称" width="450" show-tooltip-when-overflow></el-table-column>
      <el-table-column prop="code" label="业务方编码" width="270" show-tooltip-when-overflow></el-table-column>
      <el-table-column prop="type" label="类型">
        <template #default="scope">
          <span v-if="scope.row.type === 4">门店</span>
          <span v-else-if="scope.row.type === 5">片区</span>
          <span v-else>公司</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" show-tooltip-when-overflow>
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="180">
        <template #default="scope">
          <div class="btn-col">
            <el-button
                type="text"
                icon="Edit"
                size="small"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:dept:edit']"
            >修改
            </el-button>
            <el-button
                v-if="scope.row.parentNodeId != 0"
                type="text"
                icon="Delete"
                size="small"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:dept:remove']"
            >删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" v-model="open" width="700px" append-to-body :close-on-click-modal="false" draggable>
      <el-form ref="deptRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24" v-if="form.parentNodeId !== null">
            <el-form-item label="上级机构" prop="parentNodeId">
              <el-tree-select
                  style="width: 100%"
                  v-model="form.parentNodeId"
                  :data="deptOptions"
                  :render-after-expand="false"
                  :props="{ value: 'id', label: 'name', children: 'children',disabled:'disabled'}"
                  value-key="id"
                  placeholder="请选择上级机构"
                  check-strictly
                  clearable
                  default-expand-all
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="类型" prop="type" v-if="form.parentNodeId !== null">
              <el-select v-model="form.type" placeholder="请选择类型" @change="handleChange" style="width: 100%">
                <el-option
                    v-for="dict in wecom_reltree_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="名称" prop="relationId" v-if="form.type === 4">
              <el-select
                  v-model="form.relationId"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  placeholder="请从业务架构中选择，如没有，请输入新的业务节点名称"
                  clearable
                  style="width: 100%"
              >
                <el-option v-for="item in nameList" :key="item.id" :label="item.name" :value="item.storeId"/>
              </el-select>

            </el-form-item>
            <el-form-item label="名称" prop="name" v-if="form.type !== 4">
              <el-input v-model="form.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item prop="code" v-show="form.type === 4">
              <template #label>
                <span>
                  <el-tooltip content="业务部门在商户的组织中的编码，例如：xx药业新华路店，编号 3127，这里3127就是新华路店的编码" placement="top-start">
                    <el-icon><question-filled/></el-icon>
                  </el-tooltip>
                   业务方编码
                </span>
              </template>
              <el-input v-model="form.code" style="width: 100%" placeholder="请输入业务方编码"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider content-position="left">
        <div style="display: flex">人员列表｜
          <el-button type="primary" link @click="handleAddUser">添加</el-button>
        </div>
      </el-divider>
      <el-form ref="formTableRef" :rules="rulesTable" :model="tableUsers">
        <el-table :data="tableUsers.tableData" style="width: 100%" height="350px" class="table-data">
          <el-table-column prop="code" label="编码">
            <template #default="{ row, column, $index }">
              <el-form-item>
                <el-input v-model="row.code" placeholder="请输入编码" style="width: 90%;"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="人员">
            <template #default="{ row, column, $index }">
              <el-form-item :prop=" 'tableData.' + $index + '.userId' " :rules="rulesTable.userName">
                <el-select v-model="row.userId" filterable placeholder="请选择人员" style="width: 90%"
                           @change="changeUser">
                  <el-option v-for="item in selectUsers" :key="item.userId" :label="item.userName"
                             :disabled="item.disabled"
                             :value="item.userId"/>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="job" label="职务">
            <template #default="{ row, column, $index }">
              <el-form-item :prop=" 'tableData.' + $index + '.jobId' " :rules="rulesTable.job" :class="row.isJob == true ? 'job' : ''">
                <el-select v-model="row.jobId" filterable placeholder="请选择职务" style="width: 90%;">
                  <el-option v-for="item in selectJobs" :key="item.jobId" :label="item.name" :value="item.jobId"
                             :disabled="item.disabled" class="name_info">
                    <span style="float: left;">{{ item.name }}</span>
                    <span style="float: right;font-size: 12px;">{{ item.disabled == true ? '已停用' : '' }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="{ row, column, $index }">
              <div class="btn-col">
                <el-button link type="primary" icon="Delete" size="small" @click="handleDelUser($index)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
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
import {
  listReltree,
  listPage,
  getReltree,
  addReltree,
  updateReltree,
  delReltree,
  reltreeList
} from "@/api/company/reltree";
import {listPost} from "@/api/system/post";
import {listUser} from "@/api/system/user";
import {nextTick} from "vue";

const {proxy} = getCurrentInstance();
const {sys_normal_disable, wecom_reltree_type} = proxy.useDict("sys_normal_disable", "wecom_reltree_type");

const deptList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const title = ref("");
const deptOptions = ref([]);
const isExpandAll = ref(true);
const refreshTable = ref(true);
let tableUsers = reactive({
  tableData: []
})
const selectUsers = ref([])
const selectJobs = ref([])
const formTableRef = ref()
const rulesTable = ref({
  userName: [{required: true, message: "请选择用户", trigger: "change"}],
  job: [{required: true, message: "请选择职务", trigger: "change"}]
})
const data = reactive({
  form: {},
  queryParams: {
    name: undefined,
    pageNum: 1,
    pageSize: 1000,
  },
  rules: {
    type: [{required: true, message: "类型不能为空", trigger: "change"}],
    relationId: [{required: true, message: "名称不能为空", trigger: "change"}],
    name: [{required: true, message: "名称不能为空", trigger: "blur"}]
  },
});
const nameList = ref([])

const {queryParams, form, rules} = toRefs(data);
//业务结构当中已存在的门店
let selectedStore = ref([])

// 添加人员
const handleAddUser = () => {
  tableUsers.tableData.push({})
}
//删除人员
const handleDelUser = (index) => {
  tableUsers.tableData.splice(index, 1)
  changeUser()
}
//加载人员
const loadSelectUsers = () => {
  listUser({pageNum: 1, pageSize: 10000})
      .then(res => {
        selectUsers.value = res.data.list.map(m => {
          return {...m, disabled: false}
        })
      })
}
const changeUser = () => {
  selectUsers.value.forEach(item => {
    let exists = tableUsers.tableData.some(s => item.userId === s.userId)
    nextTick(() => {
      if (exists) item.disabled = true
      else item.disabled = false
    })
  })
}

// 加载岗位
const loadSelectJobs = () => {
  listPost({pageNum: 1, pageSize: 10000})
      .then(res => {
        selectJobs.value = res.data.list

        selectJobs.value.forEach(item => {
          if (item.state === 0) {
            item.disabled = true
          } else {
            item.disabled = false
          }
        })
      })
}

/** 查询部门列表 */
function getList() {
  loading.value = true;
  listPage(queryParams.value).then(response => {
    if (response.code === 200) {
      deptList.value = proxy.handleTree(response.data.list, "nodeId", "parentNodeId");
      loading.value = false;
    }
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
    nodeId: undefined,
    code: undefined,
    parentNodeId: undefined,
    relationId: undefined,
    type: undefined,
    name: null,
  };
  tableUsers.tableData = []
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

/** 设置禁用选项 */
function setDisable(data) {
  if (data.length !== 0) {
    data.forEach(item => {
      if (item.type == 4) {
        item.disabled = true
      } else {
        item.disabled = false
      }
      if (item.children && item.children.length !== 0) {
        item.children = setDisable(item.children)
      }
    })

  }

  return data
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  listReltree({allChild: true, queryRoot: true}).then(response => {
    deptOptions.value = setDisable(response.data)
  });
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
  await getNameData(row)
  await listReltree({allChild: true, queryRoot: true}).then(response => {
    deptOptions.value = setDisable(response.data)
  });
  await getReltree(row.nodeId).then(response => {
    form.value = response.data;
    form.value.parentNodeId = response.data.parentId
    tableUsers.tableData = response.data.users.map(item => {
      return {...item, isJob: false}
    })
    tableUsers.tableData = response.data.users.filter(item => selectUsers.value.some(items => items.userId == item.userId))
    open.value = true;
    title.value = "修改机构";
    changeUser()
  });
  tableUsers.tableData.filter(item => selectJobs.value.filter(items => items.state == 0).some(i => i.jobId === item.jobId)).forEach(j => {
    j.isJob = true
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["deptRef"].validate(valid => {
    if (valid) {
      if (form.value.relationId) {
        //判断是否存在于集合中
        let exists = nameList.value.filter(item => item.storeId === form.value.relationId)
        // if (exists.length > 0) {
        //   // form.value.name = exists[0].name
        // } else {
          if (form.value.nodeId != undefined) {
            form.value.name = exists[0].name
            // form.value.relationId = undefined
          } else {
            form.value.name = form.value.relationId
            form.value.relationId = undefined
          }
        // }
      }
      formTableRef.value.validate((v) => {
        if (v) {
          form.value.users = tableUsers.tableData
          if (form.value.nodeId != undefined) {
            updateReltree(form.value).then(response => {
              proxy.$modal.msgSuccess("修改成功");
              open.value = false;
              getList();
            });
          } else {
            addReltree(form.value).then(response => {
              proxy.$modal.msgSuccess("新增成功");
              open.value = false;
              getList();
            });
          }
        }
      })
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除名称为"' + row.name + '"的数据项?').then(function () {
    return delReltree(row.nodeId);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

function handleChange() {
  form.value.name = null
  form.value.relationId = undefined
  reltreeList().then(res => {
    if (res.code === 200) {
      nameList.value = res.data
    }
  })
}

function getNameData() {
  reltreeList().then(res => {
    if (res.code === 200) {
      nameList.value = res.data
    }
  })
}

loadSelectJobs()
loadSelectUsers()
getList();
</script>
<style lang="scss" scoped>
.table-data {
  .el-form-item {
    margin-bottom: 0 !important;
  }
}
.job {
  :deep(.el-input__inner) {
    color: red;
  }
}

</style>
