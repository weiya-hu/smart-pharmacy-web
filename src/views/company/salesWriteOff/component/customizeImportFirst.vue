<template>
  <el-dialog title="上传表头" v-model="isShow">
    <div class="outBox">
      <el-upload
          :action="uploadData.uploadUrl"
          :headers="{'Authorization':uploadData.token}"
          method:="POST"
          accept=".xlsx, .xls"
          :limit="1"
          :file-list="tableHeaderList"
          :show-file-list="false"
          :on-success="handleUploadSuccess">
        <div class="demo-image__placeholder">
          <div class="block">
            <el-image :src="getImageUrl()"
            >
            </el-image>
          </div>
        </div>
      </el-upload>
    </div>
  </el-dialog>

</template>

<script setup>
import {ElMessage} from "element-plus";
import router from "@/router";
import {getToken} from "@/utils/auth";

let isShow = ref(false)
let emits = defineEmits(['uploadSuccess'])
/**上传附件*/
const tableHeaderList = ref([])
let uploadData = reactive({
  uploadUrl: import.meta.env.VITE_APP_BASE_API + '/product/dynamicddi/readExcelHeader',
  token: getToken(),
})

const getImageUrl = () => {
  return new URL(`../../../../assets/images/uploadHeaderTitle.png`, import.meta.url).href
}
/**上传文件成功的回调*/
const handleUploadSuccess = (res) => {
  //成功之后清空上传文件列表
  tableHeaderList.value = []
  if (res.code === 200) {
    localStorage.setItem("headerTitle", JSON.stringify(res.data))
    //进行路由跳转
    // router.push({path: '/enterpriseCenter/order/customizeImportSecond'})
    isShow.value = false
    emits("uploadSuccess")
    ElMessage({type: 'success', message: res.msg})
  } else {
    ElMessage({type: 'warning', message: res.msg})
  }
}
const showDialog = () => {
  isShow.value = true
}
defineExpose({
  showDialog
})


</script>

<style scoped lang="scss">
.outBox {
  display: flex;
  justify-content: center;
  align-items: center;

  .block {
    //transform: rotate(180deg)
    padding: 100px;
  }
}

</style>


