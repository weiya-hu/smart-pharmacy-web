<template>
  <div class="app-container">
    <div class="btn-box">
      <el-button type="primary" @click="handelRead('edit')" v-if="inputType==='readey'">修改</el-button>
      <el-button v-if="inputType!=='readey'" type="primary" @click="handelRead('sure')">确定</el-button>
      <el-button v-if="inputType!=='readey'" @click="handelRead('cancel')">取消</el-button>
    </div>
    <div class="form-box">
      <el-form v-model="form" label-position="top">
        <el-form-item label="企业支付应用ID">
          <el-input v-model="form.payAgentId" :disabled="inputType==='readey'" />
          <p class="form-tips btn-col">获取路径：企业管理 — 应用管理 — 企业支付 — AgentId <el-button size="small" type="primary" link @click="openUrl('https://work.weixin.qq.com/wework_admin/frame#hongbao/guide/hongbaoGuideEntry')">前往复制</el-button></p>
        </el-form-item>
        <el-form-item label="企业支付密钥">
          <el-input v-model="form.payAgentSecret" :disabled="inputType==='readey'" />
          <p class="form-tips btn-col">获取路径：企业管理 — 应用管理 — 企业支付 — Secret <el-button size="small" type="primary" link @click="openUrl('https://work.weixin.qq.com/wework_admin/frame#hongbao/guide/hongbaoGuideEntry')">前往复制</el-button></p>
        </el-form-item>
        <el-divider />
        <p class="form-tips btn-col">获取途径：<el-button size="small" type="primary" link @click="openUrl('https://work.weixin.qq.com/wework_admin/frame#hongbao/guide/hongbaoGuideEntry')">企业微信后台</el-button> — 应用管理 — 支付 — 商号管理（如未户户绑定，清绑定后获取）</p>
<!--        <el-form-item label="商户号">-->
<!--          <el-input v-model="form.payMchId" :disabled="inputType==='readey'" />-->
<!--          <p class="form-tips">获取途径：<el-button size="small" type="primary" link @click="openUrl('https://work.weixin.qq.com/wework_admin/frame#hongbao/guide/hongbaoGuideEntry')">企业微信后台</el-button> — 应用管理 — 支付 — 商号管理（如未户户绑定，清绑定后获取）</p>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="商户密钥">-->
<!--          <el-input v-model="form.payMchKey" :disabled="inputType==='readey'" />-->
<!--          <p class="form-tips">获取路径 ：<el-button size="small" type="primary" link @click="openUrl('https://pay.weixin.qq.com')">微信支付商户平台 </el-button>— 账户中心 — 账户设置 — API安全 — 设置APIv2密钥</p>-->
<!--        </el-form-item>-->
<!--        <p class="form-tips">-->
<!--          密钥如果变更，请及时更新-->
<!--          <span class="form-tips">获取指引：<el-button size="small" type="primary" link @click="openUrl('https://kf.qq.com/faq/161222NneAJf161222U7fARv.html')">立即前往</el-button></span>-->
<!--        </p>-->
<!--        <el-divider />-->
<!--        <el-form-item label="微信支付API证书">-->
<!--          <el-upload-->
<!--              v-model="form.existsPayKeyPath"-->
<!--              v-loading="lodingEvent"-->
<!--              class="upload-demo"-->
<!--              accept=".p12"-->
<!--              :show-file-list="false"-->
<!--              :file-list="fileList"-->
<!--              :action="uploadData.uploadUrl"-->
<!--              :headers="uploadData.token"-->
<!--              :on-success="handleAvatarSuccess"-->
<!--              :on-change="handleChange"-->
<!--              :before-upload="beforeAvatarUpload"-->
<!--              :disabled="inputType==='readey'"-->
<!--          >-->
<!--            <el-button type="primary" class="el-icon-plus" :disabled="inputType==='readey'" v-if="form.existsPayKeyPath == false">本地上传</el-button>-->
<!--            <el-button type="primary" class="el-icon-plus" :disabled="inputType==='readey'" v-if="form.existsPayKeyPath == true">修改上传</el-button>-->
<!--          </el-upload>-->
<!--          <span class="form-tips tips-bon">获取指引：<el-button size="small" type="primary" link @click="openUrl('https://kf.qq.com/faq/161222NneAJf161222U7fARv.html')">立即前往</el-button></span>-->
<!--        </el-form-item>-->
<!--        <p class="form-tips">证书如果变更，请及时更新</p>-->
      </el-form>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive} from "vue";
import { getToken } from '../../utils/auth';
import {getCorpInfo, corpEdit} from "../../api/company/pay";
import useUserStore from "../../store/modules/user";
import { ElMessage } from 'element-plus'

const userStore = useUserStore(), corpId = userStore.userInfo.corpId
let inputType = ref('readey')
// let uploadData = reactive({
//   uploadUrl: import.meta.env.VITE_APP_BASE_API + '/wecom/corp/extdata/uploadPayKeyFile',
//   token: { Authorization: "Bearer " + getToken() },
// })
// const lodingEvent = ref(false) // 上传加载
// const fileList = ref([])
const form = ref({
  corpId: undefined,
  payAgentId: undefined,
  payAgentSecret: undefined,
  // payMchId: undefined,
  // payMchKey: undefined,
  // existsPayKeyPath: undefined
}) // 表单

// 获取详细信息
function getFormData() {
  getCorpInfo(corpId).then(res => {
    if (res.code === 200) {
      form.value = res.data
    }
  })
}
// 点击事件
function handelRead(type) {
  if (type === 'edit'){
    inputType.value='write'
  } else if (type === 'sure') {
    onSubmit()
    inputType.value='readey'
  } else if (type === 'cancel') {
    inputType.value='readey'
    getFormData()
  }
}
function onSubmit() {
  corpEdit(form.value).then(res =>{
    if (res.code === 200) {
      ElMessage.success("修改成功");
      getFormData()
    }
  })
}
// 获取路径
function openUrl(url) {
  window.open(url)
}

// 上传成功
// function handleAvatarSuccess(res) {
//   if (res.code === 200) {
//     ElMessage.success('上传成功')
//   } else {
//     ElMessage.error(res.msg)
//   }
// }
// 校验
// function beforeAvatarUpload(file) {
//   const isPkcs12 = file.type === 'application/x-pkcs12';
//   if (!isPkcs12) {
//     ElMessage.error('请上传以.p12结尾的文件')
//     return false
//   } else {
//     return true
//   }
// }
// 文件个数超出
// function handleChange(fileList) {
//   if (fileList.length > 1) {
//     fileList.splice(0,1)
//   }
// }
getFormData()
</script>
<style lang="scss" scoped>
.app-container {
  .btn-box {
    float: right;
  }
  .form-box {
    .el-input {
      width: 380px;
      margin-right: 20px;
    }
    .form-tips {
      color: #999999;
      font-size:12px;
    }
    .tips-bon {
      margin-left: 20px;
    }
  }
}
</style>