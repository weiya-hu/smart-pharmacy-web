<template>
  <div class="outBox">
    <div class="dailog">
        <taskDialog :dataInfo="activeDetail" ref="Dialog" :title="title"></taskDialog>
    </div>

    <div class="desc">
      <span>自营任务 —— 连锁商户自己发起的营销激励任务</span>
    </div>
    <div class="serachParams">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="任务类型">
          <el-select v-model="formInline.region" placeholder="请选择任务类型" clearable>
            <el-option label="激励活动" value="shanghai"/>
          </el-select>
        </el-form-item>
        <el-form-item label="任务时段">
          <el-date-picker
              v-model="formInline.value1"
              type="datetimerange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="defaultTime1"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
          <el-button type="primary" @click="newCreate">新建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="autoTaskList">
      <pageContent
          :contentTableConfig="contentTableConfig"
          :storeConfig="contentTableAutotrophicTask"
          @editBtnClick="handleEditData"
      >
        <template #timeSlot="{row}">
          <div>
            <span>{{ row.beginTime }}--{{ row.endTime }}</span>
          </div>
        </template>
      </pageContent>
    </div>

  </div>
</template>

<script setup>
import taskDialog from './component/taskDialog/taskDialog.vue'
import pageContent from "@/components/page-content/page-content";
import {contentTableConfig} from './config/tableConfig'
import {getCurrentInstance, reactive, ref} from 'vue'
import {contentTableAutotrophicTask} from './config/storeConfig.js'

const {proxy} = getCurrentInstance()
const defaultTime1 = [new Date(2000, 1, 1, 12, 0, 0)]
const formInline = reactive({
  user: '',
  region: '',
  value1: '',
})
const onSubmit = () => {
  console.log('submit!')
}
const Dialog = ref('')
const newCreate = function () {
  Dialog.value.showDialog()

}
const title = ref('新增联合激励活动')
//修改任务活动信息
let activeDetail = ref({})
const handleEditData = function (row) {
  activeDetail.value = row
  Dialog.value.showDialog()
}

</script>

<style scoped lang="scss">
.outBox {
  display: flex;
  flex-direction: column;
  padding: 20px;

  .desc {
    color: #999;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    margin-bottom: 20px;
  }
}


</style>
