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
      <el-table-column label="创建时间" prop="createTime" show-tooltip-when-overflow>
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="180">
        <template #default="scope">
          <!--          <el-button-->
          <!--              type="text"-->
          <!--              icon="Plus"-->
          <!--              size="small"-->
          <!--              @click="handleAdd(scope.row)"-->
          <!--              v-hasPermi="['system:dept:add']"-->
          <!--          >新增-->
          <!--          </el-button>-->
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

    <!--    <pagination-->
    <!--        v-show="total > 0"-->
    <!--        :total="total"-->
    <!--        v-model:page="queryParams.pageNum"-->
    <!--        v-model:limit="queryParams.pageSize"-->
    <!--        @pagination="getList"-->
    <!--    />-->

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" v-model="open" width="60%" append-to-body :close-on-click-modal="false" draggable>
      <el-form ref="deptRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24" v-if="form.parentNodeId !== 0">
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
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="类型" prop="type">
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
            <el-form-item label="名称" prop="relationId">
              <el-select
                  v-model="form.relationId"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  placeholder="请选择名称 / 如没有需要的供应商，请输入名称"
                  clearable
                  style="width: 100%"
                  v-if="form.type !==5"
              >
                <el-option v-for="item in nameList" :key="item.id" :label="item.name" :value="item.storeId"/>
              </el-select>

              <el-input v-if="form.type === 5" v-model="form.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item prop="code" v-show="form.type !== 5">
              <template #label>
                <span>
                  <el-tooltip content="业务方编码说明" placement="top">
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
              <el-form-item :prop=" 'tableData.' + $index + '.jobId' " :rules="rulesTable.job">
                <el-select v-model="row.jobId" filterable placeholder="请选择职务" style="width: 90%">
                  <el-option v-for="item in selectJobs" :key="item.jobId" :label="item.name" :value="item.jobId"/>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="{ row, column, $index }">
              <el-button link type="primary" icon="Delete" size="small" @click="handleDelUser($index)">删除</el-button>
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
const total = ref(0);
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
      })
}


/** 查询部门列表 */
function getList() {
  loading.value = true;
  listPage(queryParams.value).then(response => {
    deptList.value = proxy.handleTree(response.data.list, "nodeId", "parentNodeId");
    console.log(deptList.value)
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
    // deptOptions.value = proxy.handleTree(response.data, "id");
    deptOptions.value = setDisable(response.data)
    console.log(deptOptions.value)
    // deptOptions.value = response.data
  });
  // if (row != undefined) {
  //   form.value.parentNodeId = row.nodeId;
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
  await getNameData(row)
  // listReltree({nodeId: row.id}).then(response => {
  await listReltree({allChild: true, queryRoot: true}).then(response => {
    // deptOptions.value = proxy.handleTree(response.data, "id");
    deptOptions.value = setDisable(response.data)
    // deptOptions.value = response.data
  });
  await getReltree(row.nodeId).then(response => {
    form.value = response.data;
    form.value.parentNodeId = response.data.parentId
    tableUsers.tableData = response.data.users
    open.value = true;
    title.value = "修改机构";
    changeUser()
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["deptRef"].validate(valid => {
    if (valid) {
      if (form.value.relationId) {
        //判断是否存在于集合中
        let exists = nameList.value.filter(item => item.storeId === form.value.relationId)
        if (exists.length > 0) {
          form.value.name = exists[0].name
        } else {
          form.value.name = form.value.relationId
          form.value.relationId = undefined
        }
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

// function handleChange(val) {
//   if (val === 1) {
//     form.value.name = null
//     makerList().then(res => {
//       if (res.code === 200) {
//         nameList.value = res.data.list
//       }
//     })
//   } else if (val === 3) {
//     form.value.name = null
//     chainList().then(res => {
//       if (res.code === 200) {
//         nameList.value = res.data.list
//       }
//     })
//   } else if (val === 4) {
//     form.value.name = null
//     storeList().then(res => {
//       if (res.code === 200) {
//         nameList.value = res.data.list
//       }
//     })
//   } else {
//     nameList.value = []
//   }
// }

function handleChange(val) {
  form.value.name = null
  form.value.relationId = undefined
  reltreeList().then(res => {
    if (res.code === 200) {
      nameList.value = res.data
    }
  })
}

function getNameData(row) {
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

</style>
