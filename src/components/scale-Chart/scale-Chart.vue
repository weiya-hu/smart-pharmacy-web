<template>
  <div style="width: 100%;height: 100%">
    <div style="width: 100%;height: 100%;" class="container"
         ref="containerBox">
    </div>
  </div>
</template>
<script setup>
import * as echarts from 'echarts'
import {onMounted, reactive} from "vue";

let scaleLoading = ref(true)
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
const init = () => {
  myEcharts = echarts.init(containerBox.value);
  if (props.registeredLegendEvent.isRegistered) {
    myEcharts.on('legendselectchanged', props.registeredLegendEvent.callBackFunction)
  }
  myEcharts.setOption(props.dataOption);
  window.addEventListener("resize", function () {
    myEcharts.resize();
  });
}
const turnUpLoading = () => {
  scaleLoading.value = true
}
const turnDownLoading = () => {
  scaleLoading.value = false
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


