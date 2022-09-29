<template>
  <div class="app-container">
    <div class="desc">
      <span>激励活动 —— 连锁商户自己发起的营销激励活动</span>
    </div>
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item class="label" label="关键字" prop="name">
        <el-input v-model="queryParams.keyword" placeholder="名称｜描述" clearable @keyup.enter="handleQuery" style="width: 220px" />
      </el-form-item>
      <el-form-item class="label" label="任务时间" prop="name">
        <el-date-picker format="YYYY-MM-DD" value-format="YYYY-MM-DD" v-model="betweenDates"
                        type="daterange" clearable
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        @keyup.enter="handleQuery"
                        style="width: 220px" />
      </el-form-item>
      <el-form-item class="label" label="状态" prop="state">
        <el-select v-model="queryParams.state" clearable @change="handleQuery" @keyup.enter="handleQuery"  style="width: 220px">
          <el-option v-for="item in activity_type" :value="item.value" :key="item.value"
                     :label="item.label">{{ item.label }}
          </el-option>
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
          <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['wecom:order:add']">新增</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
    </div>

    <el-table v-loading="loading" :data="activityList">
      <el-table-column prop="eventId" label="活动ID" min-width="120px" show-overflow-tooltip />
      <el-table-column prop="name" label="活动名称" min-width="120px" show-overflow-tooltip />
      <el-table-column prop="stateName" label="状态" />
      <el-table-column prop="beginTime" label="开始时间" min-width="100px" show-overflow-tooltip />
      <el-table-column prop="endTime" label="结束时间" min-width="100px" show-overflow-tooltip />

      <el-table-column label="操作" class-name="small-padding fixed-width" :width="270">
        <template #default="scope">
          <div class="btn-col">
            <el-button type="text" size="small" icon="Search" @click="handleQueryInfo(scope.row)"
                       v-hasPermi="['wecom:order:remove']">查看
            </el-button>
            <el-button v-if="scope.row.canEdit" type="text" size="small" icon="Edit" @click="handleUpdate(scope.row)"
                       v-hasPermi="['wecom:order:edit']">修改
            </el-button>
            <el-button v-if="scope.row.canDelete" type="text" size="small" icon="Delete" @click="handleDelete(scope.row)"
                       v-hasPermi="['wecom:order:remove']">删除
            </el-button>
            <el-button v-if="scope.row.canStop" type="text" size="small" icon="Warning" @click="handleTaskStop(scope.row)"
                       v-hasPermi="['wecom:order:remove']">停用
            </el-button>
            <el-button v-if="scope.row.canStart" type="text" size="small" icon="CircleCheck" @click="handleTaskBegin(scope.row)"
                       v-hasPermi="['wecom:order:remove']">启用
            </el-button>
            <el-button type="text" size="small">电子签约</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"/>

  </div>
</template>

<script setup>
import {
  delEventInfoByid,
  queryEventInfoList,
  startActivityTask,
  stopActivityTask
} from "@/api/activity/eventInfo";
import router from "@/router";

const {proxy} = getCurrentInstance();
const {activity_type} = proxy.useDict("activity_type");
const activityList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
let betweenDates = ref([])

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    keyword: '',
  }
});

const {queryParams} = toRefs(data);

/** 查询DDI订单列表 */
function getList() {
  loading.value = true;
  if (betweenDates.value.length !== 0) {
    queryParams.value.beginTime = betweenDates.value[0]
    queryParams.value.endTime = betweenDates.value[1]
  }
  queryEventInfoList(queryParams.value).then(response => {
    activityList.value = response.data.list;
    total.value = Number(response.data.total);
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  betweenDates.value = []
  queryParams.value.beginTime = undefined
  queryParams.value.endTime = undefined
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 任务停用 */
const handleTaskStop = (row) => {
  stopActivityTask(row.eventId).then(res => {
    if (res.code == 200) {
      proxy.$modal.msgSuccess("停用成功")
      getList();
    }
  }, rej => {
    proxy.$modal.msgError("停用失败")
  })
}

/** 任务启用 */
const handleTaskBegin = (row) => {
  startActivityTask(row.eventId).then(res => {
    if (res.code == 200) {
      proxy.$modal.msgSuccess("启用成功")
      getList();
    }
  }, rej => {
    proxy.$modal.msgError("启用失败")
  })
}

/** 修改按钮操作 */
function handleUpdate(row) {
  router.push({path: '/markteCenter/activityInfo', query: {handleType: 'edit', eventId: row.eventId}})
}

/** 新增按钮操作 */
function handleAdd() {
  router.push({path: '/markteCenter/activityInfo', query: {handleType: 'add'}})
}

/** 查看按钮操作 */
function handleQueryInfo(row) {
  router.push({path: '/markteCenter/activityInfo', query: {handleType: 'query', eventId: row.eventId}})
}

/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除任务编号为"' + row.eventId + '"？').then(function () {
    return delEventInfoByid(row.eventId);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

getList();
</script>
<style lang="scss" scoped>
.label::v-deep( .el-form-item__label) {
  color: #606266;
  font-weight: 600;
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