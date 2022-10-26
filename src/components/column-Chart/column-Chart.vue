<template>
  <div :style="{width:size.width,height:size.height}">
    <div :style="{width:size.width,height:size.height,paddingRight:size.paddingRight}" class="container"
         ref="containerBox">
    </div>
  </div>


</template>

<script setup>
import * as echarts from 'echarts'
import {onMounted, reactive} from "vue";

let props = defineProps({
  dataOption: {
    type: Object,
    required: true
  },
  size: {
    type: Object,
    default: {
      width: '50vw',
      height: '40vh',
      paddingRight: 0,
    }
  }
})
onMounted(() => {
  init();
})
const containerBox = ref('')
let myEcharts = reactive({});
//初始化echarts实例方法
const init = () => {
  //3.初始化container容器
  myEcharts = echarts.init(containerBox.value);
  //5.传入数据
  myEcharts.setOption(props.dataOption);
  //additional：图表大小自适应窗口大小变化
  window.addEventListener("resize", function () {
    myEcharts.resize();
  });
}
const setOption = function (option) {
  myEcharts.setOption(option);
}
defineExpose({
  setOption,
})
</script>

<style scoped lang="scss">


</style>


