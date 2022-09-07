<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关键字" prop="name">
        <el-input v-model="queryParams.keyword" placeholder="简称｜全称｜描述" clearable @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="任务时间" prop="name">
        <el-date-picker v-model="betweenDates" type="daterange" clearable @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" clearable @change="handleQuery" @keyup.enter="handleQuery">
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['wecom:order:add']">新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="activityList" >
      <el-table-column prop="eventId" label="任务ID"></el-table-column>
      <el-table-column prop="name" label="任务简称"></el-table-column>
      <el-table-column prop="state" label="状态">
        <template #default="scope">
          <dict-tag :options="activity_type" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <el-table-column prop="beginTime" label="开始时间"/>
      <el-table-column prop="endTime" label="结束时间"/>

      <el-table-column label="操作"  class-name="small-padding fixed-width" :width="350">
        <template #default="scope">
          <el-button type="text" icon="Search" @click="handleQueryInfo(scope.row)" v-hasPermi="['wecom:order:remove']">
            查看
          </el-button>
          <el-button type="text" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['wecom:order:edit']">修改
          </el-button>
          <el-button type="text" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['wecom:order:remove']">
            删除
          </el-button>
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
const betweenDates = ref([])

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
  proxy.resetForm("queryRef");
  handleQuery();
}


/** 新增按钮操作 */
function handleAdd() {
  router.push({path:'/markteCenter/activityInfo',query:{handleType:'add'}})
}

/** 修改按钮操作 */
function handleUpdate(row) {
  router.push({path:'/markteCenter/activityInfo',query:{handleType:'edit',eventId:row.eventId}})
}
/** 查看按钮操作 */
function handleQueryInfo(row) {
  router.push({path:'/markteCenter/activityInfo',query:{handleType:'query',eventId:row.eventId}})
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
