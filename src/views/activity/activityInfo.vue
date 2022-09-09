<template>
  <div class="app-container">
    <el-steps :active="step" align-center finish-status="success" simple>
      <el-step title="基本信息"/>
      <el-step title="规则配置"/>
      <el-step title="提交审核"/>
      <el-step title="完成发布"/>
    </el-steps>

    <ActivityStepFirst ref="activityStepFirstRef" :handleType="handleType" :eventId="eventId"
                       v-show="step === 1"></ActivityStepFirst>
    <ActivityStepSecond ref="activityStepSecondRef" v-show="eventId && step === 2" :handleType="handleType" :eventId="eventId"></ActivityStepSecond>
    <div style="text-align: center;margin-top: 5%">
      <el-button @click="step--" v-show="step > 1">上一步</el-button>
      <el-button @click="handleBack" v-show="step===1">返回</el-button>
      <el-button type="primary" @click="handleNext">下一步</el-button>
    </div>
  </div>
</template>

<script setup>
import ActivityStepFirst from './components/ActivityStepFirst'
import ActivityStepSecond from './components/ActivityStepSecond'
import {queryEventRule,publish} from '@/api/activity/eventInfo'
const route = useRoute();
const {proxy} = getCurrentInstance();
const step = ref(1)
const activityStepFirstRef = ref()
const activityStepSecondRef = ref()
const eventId = ref('')
const handleType = ref('')


const handleNext = async () => {
  if (step.value === 1) {
    if (handleType.value === 'query') {
      step.value++
      activityStepSecondRef.value.loadEventRule()
    } else {
      await activityStepFirstRef.value.submitForm().then(res => {
        if (res.code === 200) {
          if (res.data) {
            eventId.value = res.data
          }
          step.value++
          proxy.$modal.msgSuccess("保存成功");
          if(handleType.value === 'query' || handleType.value === 'edit'){
            activityStepSecondRef.value.loadEventRule()
          }
        }
      })
    }
  } else if (step.value === 2) {
    queryEventRule({eventId: eventId.value})
        .then(res=>{
          if(res.code !== 200 || res.data.list.length ===0){
            proxy.$modal.msgError('请先保存规则')
          }else{
            //发布任务
            activityStepSecondRef.value.publishActivity()
                .then(res=>{
                  if(res.code === 200){
                    proxy.$modal.msgSuccess("已提交审核");
                    step.value++
                  }
                })
          }
        })
  }
  activityStepSecondRef.value.getJobList()
}
//返回
const handleBack = () => {
  proxy.$tab.closeOpenPage('/markteCenter/activity')
}

const loadInfo = () => {
  eventId.value = route.query.eventId
  handleType.value = route.query.handleType
}
loadInfo()

</script>

<style scoped>

</style>
