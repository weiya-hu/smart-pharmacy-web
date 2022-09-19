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
  },
  size: {
    type: Object,
    default: {
      width: '48vw',
      height: '33vh'
    }
  },
  registeredLegendEvent: {
    type: Object,
    required: false,
    default: {
      isRegistered: false,
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
  if (props.registeredLegendEvent.isRegistered) {
    myEcharts.on('legendselectchanged', props.registeredLegendEvent.callBackFunction)
  }

  //5.传入数据
  myEcharts.setOption(props.dataOption);

  window.addEventListener("resize", function () {
    myEcharts.resize();
  });

}
const setOption = function (option) {
  myEcharts.setOption(option);
}
defineExpose({
  setOption
})
</script>

<style scoped lang="scss">


</style>


