<template>
  <div style="width: 100%;height: 100%" class="container" ref="containerBox">
  </div>

</template>

<script setup>
import * as echarts from 'echarts'
import {onMounted, reactive} from "vue";

let props = defineProps({
  dataOption: {
    type: Object,
    required: true
  }
})
onMounted(() => {
  console.log("???")
  init();
})
const containerBox = ref('')
let myEcharts = reactive({});
//初始化echarts实例方法
const init = () => {
  //3.初始化container容器
  myEcharts = echarts.init(containerBox.value);
  console.log(props.dataOption)
  //5.传入数据
  myEcharts.setOption(props.dataOption);
  //additional：图表大小自适应窗口大小变化
  window.onresize = () => {
    myEcharts.resize();
  }
}
</script>

<style scoped lang="scss">


</style>


