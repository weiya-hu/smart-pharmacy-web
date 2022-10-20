<template>
  <div class="app-container">
    <el-steps :active="step" align-center simple process-status="finish" finish-status="process">
      <el-step title="基本信息">
        <template #icon>
          <img src="../../assets/images/step-hide-1.png" v-show="step == 0" />
          <img src="../../assets/images/step-success.png" v-show="step !== 0" />
        </template>
      </el-step>
      <el-step title="规则配置">
        <template #icon>
          <img src="../../assets/images/step-hide-2.png" v-show="step == 1" />
          <img src="../../assets/images/step-show-2.png" v-show="step !== 1 && step < 1" />
          <img src="../../assets/images/step-success.png" v-show="step > 1" />
        </template>
      </el-step>
      <el-step title="提交审核">
        <template #icon>
          <img src="../../assets/images/step-hide-3.png" v-show="step == 2" />
          <img src="../../assets/images/step-show-3.png" v-show="step !== 2 && step < 2" />
          <img src="../../assets/images/step-success.png" v-show="step > 2" />
        </template>
      </el-step>
      <el-step title="完成发布" :icon="Promotion">
      </el-step>
    </el-steps>

    <ActivityStepFirst ref="activityStepFirstRef" :handleType="handleType" :eventId="eventId" :canEdit='canEdit'
                       v-show="step === 0"></ActivityStepFirst>
    <ActivityStepSecond v-loading="secondLoading" ref="activityStepSecondRef"
                        v-show="eventId && step === 1" :handleType="handleType"
                        :eventId="eventId"></ActivityStepSecond>
    <div v-if="step===2" element-loading-text="审核提交中..." class="auditLoadiang" v-loading="auditLoadiang"></div>
    <div class="finish" v-if="step===3">
      <div class="imageIcon">
        <el-image :src="getImageUrl()"></el-image>
      </div>
      <div style="fontSize:25px">
        审核提交成功
      </div>
      <div>
        <el-button class="finishBack" @click="handleBack" v-show="step===3">返回</el-button>
      </div>
    </div>
    <div style="text-align: center;margin-top: 5%">
      <el-button @click="decrementStep" v-show="step > 0&&step<2">{{ handleType == 'query' ? '上一页' : '上一步' }}</el-button>
      <el-button @click="handleBack" v-show="step===0">返回</el-button>
      <el-button type="primary" @click="handleNext" v-show="step<2" :loading="loadingBtn">{{ handleType == 'query' ? '下一页' : '下一步' }}</el-button>
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
import {queryEventRule, publish, getEventInfoByid} from '@/api/activity/eventInfo'
import {nextTick} from "vue";
import {List, Ticket, UserFilled, Promotion} from '@element-plus/icons-vue';

const route = useRoute();
const {proxy} = getCurrentInstance();
const step = ref(0)
const activityStepFirstRef = ref()
const activityStepSecondRef = ref()
const eventId = ref('')
const handleType = ref('')
const loadingBtn = ref(false)
let secondLoading = ref(false)
let auditLoadiang = ref(false)
const getImageUrl = () => {
  return new URL(`../../assets/images/complete.png`, import.meta.url).href
}
let canEdit = ref(false)
const decrementStep = () => {
  step.value--
  if (step.value === 1) {
    //  获取任务基本信息
    getEventInfoByid(eventId.value).then(res => {
      if (res.code == 200) {
        canEdit.value = res.data.canEdit
      }
    })
  }
}
const handleNext = async () => {
  if (step.value === 0) {
    if (handleType.value === 'query') {
      step.value++
      activityStepSecondRef.value.loadEventRule()
    } else {
      loadingBtn.value = true
      await activityStepFirstRef.value.submitForm().then(res => {
        if (res.code === 200) {
          loadingBtn.value = false
          if (res.data) {
            eventId.value = res.data
          }
          step.value++
          activityStepFirstRef.value.closeLoading()
          proxy.$modal.msgSuccess("保存成功");
          // if (handleType.value === 'query' || handleType.value === 'edit') {
          if (handleType.value) {
            nextTick(() => {
              activityStepSecondRef.value.loadEventRule()
            })
          }
        } else {
          loadingBtn.value = false
        }
      }).catch(err => {
        loadingBtn.value = false
      })
    }
    if (eventId.value !== undefined) {
      activityStepSecondRef.value.getJobList()
    }
  } else if (step.value === 1) {
    if (handleType.value === 'query') {
      return
    }
    queryEventRule({eventId: eventId.value})
        .then(res => {
          if (res.code !== 200 || res.data.list.length === 0) {
            proxy.$modal.msgError('请先保存规则')
          } else {
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
                  }

                }, rej => {
                  step.value--
                  auditLoadiang.value = false
                  // proxy.$modal.msgError('请检查规则内容是否完整')
                })
          }
          // else {
          //   proxy.$modal.msgError('请检查规则内容是否完整')
          // }
        })
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
