<template>
  <div v-loading="columnLoading" element-loading-text="加载中..." :style="{width:size.width,height:size.height}">
    <div :style="{width:size.width,height:size.height,paddingRight:size.paddingRight}" class="container"
         ref="containerBox">
    </div>
  </div>


</template>

<script setup>
import * as echarts from 'echarts'
import {onMounted, reactive} from "vue";

let columnLoading = ref(true)
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
  console.log(props.dataOption)
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
const turnUpLoading = () => {
  columnLoading.value = true
}
const turnDownLoading = () => {
  columnLoading.value = false
}
defineExpose({
  setOption,
  turnUpLoading,
  turnDownLoading
})
</script>

<style scoped lang="scss">


</style>


