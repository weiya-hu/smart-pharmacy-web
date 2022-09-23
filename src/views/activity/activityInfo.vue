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
    <ActivityStepSecond v-loading="secondLoading" ref="activityStepSecondRef"
                        v-show="eventId && step === 2" :handleType="handleType"
                        :eventId="eventId"></ActivityStepSecond>
    <div v-if="step===3" element-loading-text="审批中..." class="auditLoadiang" v-loading="auditLoadiang">
    </div>
    <div v-show="step==3" class="stepThreeHandler">
      <el-button @click="previousStep">上一步</el-button>
    </div>
    <div class="finish" v-if="step===4">
      <div class="imageIcon">
        <el-image :src="getImageUrl()"></el-image>
      </div>
      <div style="fontSize:25px">
        审批成功
      </div>
      <div class="successHandle">
        <el-button class="finishBack" @click="previousStep" v-show="step===4">上一步</el-button>
        <el-button class="finishBack" @click="handleBack" v-show="step===4">返回</el-button>
      </div>
    </div>
    <div style="text-align: center;margin-top: 5%">
      <el-button @click="previousStep" v-show="step > 1&&step<3">上一步</el-button>
      <el-button @click="handleBack" v-show="step===1">返回</el-button>
      <el-button type="primary" @click="handleNext" v-show="step<3">下一步</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "ActivityInfo"
};
</script>
<script setup>
import ActivityStepFirst from './components/ActivityStepFirst'
import ActivityStepSecond from './components/ActivityStepSecond'
import {queryEventRule, getEventInfoByid, publish} from '@/api/activity/eventInfo'

const route = useRoute();
const {proxy} = getCurrentInstance();
const step = ref(1)
const activityStepFirstRef = ref()
const activityStepSecondRef = ref()
const eventId = ref('')
const handleType = ref('')
let secondLoading = ref(false)
let auditLoadiang = ref(false)
const taskStatus = ref(null)
let time = ref(null)
const getImageUrl = () => {
  return new URL(`../../assets/images/complete.png`, import.meta.url).href
}
const previousStep = async () => {
  if (step.value == 4 || step.value == 10) {
    step.value = 2
    activityStepSecondRef.value.loadEventRule()
  } else if (step.value == 3) {
    if (time.value) {
      clearInterval(time.value)
    }
    step.value--
    activityStepSecondRef.value.loadEventRule()
    time.value = null
  } else {
    step.value--
  }

}

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
          activityStepFirstRef.value.closeLoading()
          proxy.$modal.msgSuccess("保存成功");
          if (handleType.value === 'query' || handleType.value === 'edit') {
            activityStepSecondRef.value.loadEventRule()
          }
        }
      })
    }
    activityStepSecondRef.value.getJobList()
  } else if (step.value === 2) {
    if (handleType.value === 'query') {
      await queryActivityEventId(eventId.value)
    } else {
      queryEventRule({eventId: eventId.value})
          .then(res => {
            if (res.code !== 200 || res.data.list.length === 0) {
              proxy.$modal.msgError('请先保存规则')
            } else {
              //判断当前任务是否已经提交过审批
              if (taskStatus.value == 3 || taskStatus.value == 5 || taskStatus.value == 10) {
                queryActivityEventId(eventId.value)
              } else {
                step.value++
                auditLoadiang.value = true
                //发布任务
                activityStepSecondRef.value.publishActivity()
                    .then(res => {
                      if (res.code === 200) {
                        proxy.$modal.msgSuccess("已提交审核");
                        // auditLoadiang.value = false
                        // step.value++
                        //  重新获取任务状态
                        time.value = setInterval(queryActivityEventId, 5000)
                      }
                    }, rej => {
                      step.value--
                      auditLoadiang.value = false
                    })
              }
            }
          })
    }

  }
}
//判断规则当中是否存在商品/品牌/门店
const isPresenceGoodsOrBrandOrStore = (dataList) => {
  let result = dataList.every(item => {
    let {brands, storeIds} = item.filter
    return brands.length !== 0 || storeIds !== null || item.products.length !== 0
  })
  return result
  // return true
}
//判断所有规则当中是否存在奖励阈值和奖励金额当中为零的选项
const verifyZero = (data) => {
  let totalJobs = data.map((item) => {
    return item.jobs
  })
  const isZero = totalJobs.flat().some(item => {
    return item.price === 0 || item.targetRange === 0
  })
  return isZero
}

//返回
const handleBack = () => {
  proxy.$tab.closeOpenPage('/markteCenter/activity')
}
//查询任务数据
const queryActivityEventId = async () => {
  let {code, data: resultData} = await getEventInfoByid(eventId.value)
  if (code === 200) {
    taskStatus.value = resultData.state
    advanceStep()
  }
}
//判断当前任务进行到那一步
const advanceStep = () => {
  switch (taskStatus.value) {
    case 0:
      // step.value = 1
      break;
    case 2:
      step.value = 3
      auditLoadiang.value = true
      if (time.value) {
        return
      } else {
        time.value = setInterval(queryActivityEventId, 5000)
      }
      break;
    case 3:
      step.value = 4
      break;
    case 5:
      step.value = 4
      break;
    case 10:
      step.value = 4
      break;
  }
  if (taskStatus.value == 3) {
    if (time.value) {
      clearInterval(time.value)
    }
  }

}

const loadInfo = async () => {
  eventId.value = route.query.eventId
  handleType.value = route.query.handleType
  if (eventId.value) {
    await queryActivityEventId(eventId.value)
  }
}
loadInfo()

</script>

<style scoped lang="scss">
.auditLoadiang::v-deep(.el-loading-spinner) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 50vh;
  align-items: center;

  .el-loading-text {
    font-size: 20px;
  }
}

.app-container {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .auditLoadiang {
    flex: 1;
  }

  .stepThreeHandler {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 30vh;
  }

  .finish {
    margin-top: 20vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .successHandle {
      display: flex;
      flex-direction: row;
      padding: 20px;

      .finishBack {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
      }
    }

  }
}

</style>
