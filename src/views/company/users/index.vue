<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24" style="background: #f9f9f9;">
          <div class="head-container">
            <el-input
                v-model="deptName"
                placeholder="请输入机构名称"
                clearable
                prefix-icon="Search"
                style="margin-bottom: 15px"
            />
            <el-scrollbar height="800px">
              <el-tree
                  :data="deptOptions"
                  :props="{ label: 'label', children: 'children' }"
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  ref="deptTreeRef"
                  highlight-current
                  default-expand-all
                  @node-click="handleNodeClick"
              >
                <template #default="{ node, data }">
                  <el-tooltip placement="top" :content="node.label" :disabled="showTitle">
                    <span class="text-nowrap" @mouseover="onShowTips">{{ node.label }}</span>
                  </el-tooltip>
                </template>
              </el-tree>
            </el-scrollbar>
          </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="成员名称" prop="userName">
            <el-input
                v-model="queryParams.userName"
                placeholder="请输入成员名称"
                clearable
                style="width: 220px"
                @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input
                v-model="queryParams.mobile"
                placeholder="请输入手机号码"
                clearable
                style="width: 220px"
                @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="isActivate">
            <el-select
                v-model="queryParams.isActivate"
                placeholder="请选择成员状态"
                clearable
                style="width: 220px"
            >
              <!--                     <el-option-->
              <!--                        v-for="dict in sys_normal_disable"-->
              <!--                        :key="dict.value"-->
              <!--                        :label="dict.label"-->
              <!--                        :value="dict.value"-->
              <!--                     />-->
              <el-option :value="1" label="正常"/>
              <el-option :value="0" label="停用"/>
            </el-select>
          </el-form-item>
<!--          <el-form-item label="创建时间" style="width: 308px;">-->
<!--            <el-date-picker-->
<!--                v-model="dateRange"-->
<!--                value-format="YYYY-MM-DD"-->
<!--                type="daterange"-->
<!--                range-separator="-"-->
<!--                start-placeholder="开始日期"-->
<!--                end-placeholder="结束日期"-->
<!--            ></el-date-picker>-->
<!--          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <div class="btn-back">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5" v-show="isWecomAccount === 0">
              <el-button
                  type="primary"
                  plain
                  icon="Plus"
                  @click="handleAdd"
                  v-hasPermi="['system:user:add']"
              >新增
              </el-button>
            </el-col>
            <el-col :span="1.5" v-show="isWecomAccount === 1">
              <el-tooltip effect="dark" content="同步仅适用开通了企业微信的企业" placement="top">
                <el-button
                    plain
                    type="warning"
                    icon="Sort"
                    @click="handleSynchro"
                >同步
                </el-button>
              </el-tooltip>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
          </el-row>
        </div>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange" height="588px">
          <el-table-column label="成员编号" align="center" key="userId" prop="userId" v-if="columns[0].visible"
                           :show-overflow-tooltip="true"/>
          <el-table-column label="成员名称" align="center" key="userName" prop="userName" v-if="columns[1].visible"
                           :show-overflow-tooltip="true"/>
          <el-table-column label="部门" align="center" key="deptname" prop="deptname" v-if="columns[2].visible"
                           :show-overflow-tooltip="true"/>
          <el-table-column label="手机号码" align="center" key="mobile" prop="mobile" v-if="columns[3].visible"
                           width="120"/>
          <el-table-column label="微信OpenId" align="center" v-if="isWecomAccount===0" width="200">
            <template #default="scope">
              <span v-if="scope.row.wechatOpenid">{{scope.row.wechatOpenid}}</span>
              <el-button v-else  type="primary" link @click="showQrCode=true">请使用微信扫码激活</el-button>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" key="isActivate" prop="isActivate" v-if="columns[4].visible">
            <template #default="scope">
              <span v-if="scope.row.isActivate == 1" class="state-item1">正常</span>
              <span v-if="scope.row.isActivate == 0" class="state-item2">停用</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[5].visible" width="160">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
            <template #default="scope">
              <div class="btn-col">
                <el-button
                    type="text"
                    icon="Edit"
                    size="small"
                    v-if="isWecomAccount !== 1"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['system:user:edit']"
                >修改
                </el-button>
                <el-button
                    type="text"
                    icon="Delete"
                    size="small"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['system:user:remove']"
                >删除
                </el-button>
                <el-button
                    type="text"
                    icon="CircleCheck"
                    size="small"
                    @click="handleAuthRole(scope.row)"
                    v-hasPermi="['system:user:edit']"
                >分配角色
                </el-button>
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
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" v-model="open" width="58%" append-to-body :close-on-click-modal="false" draggable>
      <el-form :model="form" :rules="rules" ref="userRef" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="成员名称" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入成员名称" maxlength="30"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleIds">
              <el-select v-model="form.roleIds" multiple placeholder="请选择角色" style="width: 100%">
                <el-option
                    v-for="item in roleOptions"
                    :key="item.roleId"
                    :label="item.name"
                    :value="item.roleId"
                    :disabled="item.status == 0"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="归属部门" prop="deptIds">
              <el-tree-select
                  v-model="form.deptIds"
                  :data="deptOptions"
                  check-strictly=true
                  :props="{ value: 'id', label: 'label', children: 'children' }"
                  value-key="id"
                  multiple
                  default-expand-all
                  placeholder="请选择归属部门"
                  style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入手机号码" maxlength="11"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="成员性别">
              <el-select v-model="form.gender" placeholder="请选择" style="width: 100%">
                <el-option
                    v-for="dict in sys_user_sex"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.isActivate">
                <el-radio
                    v-for="dict in sys_normal_disable"
                    :key="dict.value"
                    :label="dict.value"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="50%" append-to-body :close-on-click-modal="false" draggable>
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
              是否更新已经存在的成员数据
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
    <div class="code-dialog">
      <el-dialog v-model="showQrCode" title="扫码加入" width="400px" :close-on-click-modal="false" draggable>
        <div class="wecom-url">
          <span>企业成员扫以下二维码加入企业</span>
          <img :src="qrCodeUrl" alt="" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup name="User">
import {getToken} from "@/utils/auth";
import {treeselect} from "@/api/system/dept";
import {listRole} from "@/api/system/role";
import {listPost} from "@/api/system/post";
import {listUser, delUser, getUser, updateUser, addUser, synchWeUser} from "@/api/system/user";
import {getCurrUserBaseInfo, getInviteQrcode} from '@/api/company/info';
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";

const router = useRouter();
const {proxy} = getCurrentInstance();
const {sys_normal_disable, sys_user_sex} = proxy.useDict("sys_normal_disable", "sys_user_sex");

const userList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
// const dateRange = ref([]);
const deptName = ref("");
const deptOptions = ref(undefined);
const postOptions = ref([]);
const roleOptions = ref([]);
const showQrCode = ref(false)
const isWecomAccount = ref(undefined)
const qrCodeUrl = ref('')
const showTitle = ref(true)

/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/system/user/importData"
});
// 列显隐信息
const columns = ref([
  {key: 0, label: `成员编号`, visible: true},
  {key: 1, label: `成员名称`, visible: true},
  {key: 2, label: `部门`, visible: true},
  {key: 3, label: `手机号码`, visible: true},
  {key: 4, label: `状态`, visible: true},
  {key: 5, label: `创建时间`, visible: true}
]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userName: undefined,
    mobile: undefined,
    isActivate: undefined,
    deptIds: []
  },
  rules: {
    userName: [{required: true, message: "成员名称不能为空", trigger: "blur"}, {
      min: 2,
      max: 20,
      message: "成员名称长度必须介于 2 和 20 之间",
      trigger: "blur"
    }],
    roleIds: [{required: true, message: "角色不能为空", trigger: "change"}],
    deptIds: [{required: true, message: "归属部门不能为空", trigger: "change"}],
    mobile: [{required: true, message: "手机号码不能为空", trigger: "blur"},{pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur"}],
  }
});

const {queryParams, form, rules} = toRefs(data);
//加载角色、职务
const loadRolePost = () => {
  listRole().then(res => {
    roleOptions.value = res.data.list
  })
  listPost().then(res => {
    postOptions.value = res.data.list
  })
}

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watch(deptName, val => {
  proxy.$refs["deptTreeRef"].filter(val);
});

/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then(response => {
    deptOptions.value = response.data.list;
  });
};

/** 查询用户列表 */
function getList() {
  loading.value = true;
  // listUser(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {
  listUser(queryParams.value).then(res => {
    loading.value = false;
    userList.value = res.data.list;
    total.value = Number(res.data.total);
  });
};

/** 节点单击事件 */
function handleNodeClick(data) {
  if (data.parentId == null) {
    queryParams.value.deptIds = null
  } else {
    queryParams.value.deptIds = data.id;
  }
  handleQuery();
};

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
function resetQuery() {
  // dateRange.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
};

/** 删除按钮操作 */
function handleDelete(row) {
  const userIds = row.userId
  proxy.$modal.confirm('是否确认删除成员编号为"' + userIds + '"的数据项？').then(function () {
    return delUser(userIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
};

/** 更多操作 */
function handleCommand(command, row) {
  switch (command) {
    case "handleResetPwd":
      handleResetPwd(row);
      break;
    case "handleAuthRole":
      handleAuthRole(row);
      break;
    default:
      break;
  }
};

/** 跳转角色分配 */
function handleAuthRole(row) {
  router.push({
    path: "/enterpriseCenter/company/users/authRole",
    query: {userId: row.userId, userName: row.userName}
  })
};

/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.userId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 下载模板操作 */
function importTemplate() {
  proxy.download("system/user/importTemplate", {}, `user_template_${new Date().getTime()}.xlsx`);
};
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getList();
};

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};

/** 初始化部门数据 */
function initTreeData() {
  // 判断部门的数据是否存在，存在不获取，不存在则获取
  if (deptOptions.value === undefined) {
    treeselect().then(response => {
      deptOptions.value = response.data;
    });
  }
};

/** 重置操作表单 */
function reset() {
  form.value = {
    userId: undefined,
    deptIds: [],
    userName: undefined,
    mobile: undefined,
    email: undefined,
    gender: undefined,
    isActivate: 1,
    remark: undefined,
    roleIds: []
  };
  proxy.resetForm("userRef");
};

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
};

/** 新增按钮操作 */
function handleAdd() {
  reset();
  initTreeData();
  open.value = true;
  title.value = "添加成员";
};

/** 修改按钮操作 */
async function handleUpdate(row) {
  console.log('sys_user_sex',sys_user_sex)
  reset();
  await initTreeData();
  const userId = row.userId || ids.value;
  await getUser(userId).then(response => {
      form.value = response.data;
    //   postOptions.value = response.posts;
    //   roleOptions.value = response.roles;
    //   form.value.roleName = response.data.roleName;
    open.value = true;
    title.value = "修改成员";
  });

};

/** 提交按钮 */
function submitForm() {
  proxy.$refs["userRef"].validate(valid => {
    if (valid) {
      if (form.value.userId != undefined) {
        updateUser(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUser(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
};

/** 同步通讯录 */
function handleSynchro() {
  synchWeUser().then(res => {
    if (res.code === 200) {
      ElMessage.success(res.msg)
    }
  })
}

function getBaseInfo() {
    getCurrUserBaseInfo().then(res => {
      if (res.code === 200) {
        isWecomAccount.value = res.data.isWecomAccount
        getList();
      }
    })
}


const getQrCode = ()=>{
  getInviteQrcode({suiteId: 'wx638b6577cf54981f'})
      .then(res => {
        if (res.code === 200) {
          qrCodeUrl.value = res.data
        }
      })
}

function onShowTips(e){
  let textLength = e.target.clientWidth
  let containerLength = e.target.scrollWidth
  if (textLength < containerLength) {
    showTitle.value = false
  } else {
    showTitle.value = true
  }
}

getTreeselect();
loadRolePost()
getBaseInfo()
getQrCode()

</script>
<style lang="scss" scoped>
.text-nowrap {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  line-height: 30px;
}
.head-container {
  .el-tree {
    background: 0;
  }
}
.code-dialog {
  :deep(.el-dialog__body) {
    padding-top: 7px;
  }
  .wecom-url {
     text-align: center;
     width: 240px;
     margin: 0 auto;
   }
  img {
   width: 100%;
    margin-top: 15px;
  }
}
</style>
