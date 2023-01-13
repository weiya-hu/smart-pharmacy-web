<template>
  <el-dialog :close-on-click-modal="false"
             center width="35vw" style="border-radius: 10px" title="" v-model="isShow">
    <div class="outBox">
      <p class="warning">上传新的表格后，点击确定，会让现有表头配置失效，请谨慎操作！</p>
      <div>
        <el-upload
            ref="uploadHeaderRef"
            :action="uploadData.uploadUrl"
            :headers="{'Authorization':uploadData.token}"
            :auto-upload="false"
            method:="POST"
            accept=".xlsx, .xls"
            :limit="1"
            :file-list="tableHeaderList"
            :show-file-list="true"
            :on-success="handleUploadSuccess">
          <div class="demo-image__placeholder">
            <div class="block">
              <el-image :src="getImageUrl()"
              >
              </el-image>
              <div class="tips">点击上传</div>
            </div>
          </div>
        </el-upload>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="submit" size="large">确定</el-button>
      <el-button @click="cancelUploadNewHeader" size="large">取消</el-button>
    </template>
  </el-dialog>

</template>

<script setup>
import {ElMessage} from "element-plus";
import router from "@/router";
import {getToken} from "@/utils/auth";
import {reactive, getCurrentInstance} from "vue";

const {proxy} = getCurrentInstance()
const uploadHeaderRef = ref(null)
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
const submit = () => {
  proxy.$refs["uploadHeaderRef"].submit();
}
const cancelUploadNewHeader = () => {
  isShow.value = false
  tableHeaderList.value = []
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
  flex-direction: column;

  .warning {
    font-size: 16px;
    font-weight: bold;
    color: #FF5A40;
  }

  .block {
    position: relative;
    //transform: rotate(180deg)
    padding: 10px 0px 0px 0px;

    .tips {
      position: absolute;
      width: 64px;
      height: 22px !important;
      height: 15px;
      font-size: 16px;
      font-weight: 500;
      color: #333333;
      line-height: 22px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, 30%);
    }
  }
}

</style>


