<template>
  <div class="app-container">
    <el-steps :active="step" align-center finish-status="success" simple>
      <el-step title="基本信息"  />
      <el-step title="规则配置"  />
      <el-step title="提交审核"  />
      <el-step title="完成发布"  />
    </el-steps>

    <ActivityStepFirst ref="activityStepFirstRef" v-show="step === 1"></ActivityStepFirst>
      <div style="text-align: center;margin-top: 5%">
        <el-button @click="step--">上一步</el-button>
        <el-button type="primary" @click="step++">下一步</el-button>
      </div>
  </div>
</template>

<script setup>
import ActivityStepFirst from './components/ActivityStepFirst'
const step = ref(1)
const activityStepFirstRef = ref()
</script>

<style scoped>

</style>
