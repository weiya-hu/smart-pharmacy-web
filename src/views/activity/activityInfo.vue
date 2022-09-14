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
    <div v-if="step===3" element-loading-text="审核提交中..." class="auditLoadiang" v-loading="auditLoadiang"></div>
    <div class="finish" v-if="step===4">
      <div class="imageIcon">
        <el-image :src="getImageUrl()"></el-image>
      </div>
      <div style="fontSize:25px">
        审核提交成功
      </div>
      <div>
        <el-button class="finishBack" @click="handleBack" v-show="step===4">返回</el-button>
      </div>
    </div>
    <div style="text-align: center;margin-top: 5%">
      <el-button @click="step--" v-show="step > 1&&step<3">上一步</el-button>
      <el-button @click="handleBack" v-show="step===1">返回</el-button>
      <el-button type="primary" @click="handleNext" v-show="step<3">下一步</el-button>
    </div>
  </div>
</template>

<script setup>
import ActivityStepFirst from './components/ActivityStepFirst'
import ActivityStepSecond from './components/ActivityStepSecond'
import {queryEventRule, publish} from '@/api/activity/eventInfo'

const route = useRoute();
const {proxy} = getCurrentInstance();
const step = ref(1)
const activityStepFirstRef = ref()
const activityStepSecondRef = ref()
const eventId = ref('')
const handleType = ref('')
let secondLoading = ref(false)
let auditLoadiang = ref(false)
const getImageUrl = () => {
  return new URL(`../../assets/images/complete.png`, import.meta.url).href
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
  } else if (step.value === 2) {
    if (handleType.value === 'query') {
      return
    }
    //判断当前任务是否已经提交过审批
    queryEventRule({eventId: eventId.value})
        .then(res => {
          if (res.code !== 200 || res.data.list.length === 0) {
            proxy.$modal.msgError('请先保存规则')
          } else if (isPresenceGoodsOrBrandOrStore(res.data.list)) {
            //判断规则当中是否有与规则类型匹配的商品/品牌/门店
            step.value++
            auditLoadiang.value = true
            //发布任务
            activityStepSecondRef.value.publishActivity()
                .then(res => {
                  if (res.code === 200) {
                    proxy.$modal.msgSuccess("已提交审核");
                    auditLoadiang.value = false
                    step.value++
                  } else {
                    proxy.$modal.msgError(res.msg)
                    step.value--
                  }
                })
          } else {
            proxy.$modal.msgError('请检查规则内容是否完整')
          }
        })
  }
  activityStepSecondRef.value.getJobList()
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

  .finish {
    margin-top: 20vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .finishBack {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
    }
  }
}

</style>
