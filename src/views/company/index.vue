<template>
  <div class="app-container">
    <div class="btn-box">
      <el-button type="primary"  @click="handelRead('edit')" v-if="inputType === 'readey'">修改</el-button>
      <el-button v-if="inputType!=='readey'" type="primary" @click="handelRead('sure')">确定</el-button>
      <el-button v-if="inputType!=='readey'" @click="handelRead('cancel')">取消</el-button>
    </div>
    <div class="form-box">
      <el-form v-model="form" label-position="left" label-width="85px">
        <el-form-item label="企业logo" prop="logo">
<!--          <div class="logo">-->
<!--            <el-upload-->
<!--               style="width:350px;height:180px;border: 1px dashed #ddd;"-->
<!--               v-if="inputType!=='readey'"-->
<!--               class="avatar-uploader"-->
<!--               accept="image/*"-->
<!--               :file-list="fileList"-->
<!--               :action="uploadData.uploadUrl"-->
<!--               :headers="{ 'Authorization': uploadData.token }"-->
<!--               :show-file-list="true"-->
<!--               :on-success="handleAvatarSuccess"-->
<!--               :before-upload="beforeAvatarUpload"-->
<!--               :on-change="handleChange">-->
<!--            <div style="textAlign: center;width: 350px;height:180px;line-height: 180px">-->
<!--                <el-icon size="32px">-->
<!--                  <Plus/>-->
<!--                </el-icon>-->
<!--              </div>-->
<!--            </el-upload>-->

<!--            <div v-if="inputType==='readey'" class="demo-image__preview">-->
<!--              <el-image style="width:350px;height:180px;" :src="uploadData.url" :initial-index="4" fit="cover"/>-->
<!--            </div>-->
<!--            <div class="item_logoDes">推荐尺寸350*180</div>-->
<!--          </div>-->
          <div>
            <el-upload
                  :disabled="inputType==='readey'"
                  :action="uploadData.uploadUrl"
                  :headers="{'Authorization':uploadData.token}"
                  :data="uploadData.imgBannerParam"
                  method:="POST"
                  accept="image/*"
                  :limit="1"
                  :file-list="fileList"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                <div class="demo-image__placeholder">
                  <div class="block">
                    <el-image :src="form.logo" v-if="form.logo !== null && form.logo !== ''" style="width: 350px;height: 150px;border: 1px solid var(--el-border-color);border-radius: 4px; overflow: hidden">
                      <template #placeholder>
                        <div class="image-slot">Loading<span class="dot">...</span></div>
                      </template>
                    </el-image>
                    <el-image v-if="form.logo == null || form.logo == '' || form.logo == undefined" style="width: 350px;height: 150px;border: 1px solid var(--el-border-color);border-radius: 4px; overflow: hidden">
                      <template #error>
                        <div class="image-slot" style="display: flex;justify-content:center;align-items:center;height: 150px">
                          <el-icon :size="48">
                            <Picture/>
                          </el-icon>
                        </div>
                      </template>
                    </el-image>
                  </div>
                </div>
              </el-upload>
            <div class="form-tips">推荐尺寸350*180</div>
          </div>
        </el-form-item>
        <el-form-item label="企微ID" prop="plainCorpId">
          <el-input v-model="form.plainCorpId" :disabled="inputType==='readey'" />
        </el-form-item>
        <el-form-item label="法定代表人" prop="legalPersonId">
          <el-select v-model="form.legalPersonId" :disabled="inputType==='readey'" placeholder=" " style="width: 350px;">
            <el-option v-for="item in legalPersonList" :key="item.userId" :label="item.userName" :value="item.userId" />
          </el-select>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="form.name" :disabled="inputType==='readey'" />
        </el-form-item>
        <el-form-item label="企业全称" prop="fullname">
          <el-input v-model="form.fullname" :disabled="inputType==='readey'" />
        </el-form-item>
        <el-form-item label="企业类型">
          <el-select v-model="form.corpType" :disabled="inputType==='readey'" placeholder=" " filterable style="width: 350px;">
            <el-option v-for="item in corpTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="门店编号" v-if="form.corpType == 4">
          <el-input v-model="form.code"
                    clearable
                    :disabled="inputType==='readey'"
                    />
        </el-form-item>
        <el-form-item label="发票抬头">
          <el-input v-model="form.invoiceTitle" :disabled="inputType==='readey'" />
        </el-form-item>
        <el-form-item label="企业电话">
          <el-input v-model="form.phone" clearable :disabled="inputType==='readey'" />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="form.address" clearable :disabled="inputType==='readey'"></el-input>
        </el-form-item>
<!--          <el-form-item label="归属连锁" v-if="form.corpType == 4">-->
<!--            <el-select-->
<!--                v-model="form.parentId"-->
<!--                :disabled="inputType==='readey'"-->
<!--                clearable-->
<!--                placeholder="请选择"-->
<!--                style="width: 300px;"-->
<!--                @change="handelParent($event)">-->
<!--              <el-option v-for="(item,index) in form.corpInfoList" :key="index" :label="item.companyName" :value="item.id"/>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--        <el-form-item label="连锁品牌">-->
<!--          <el-select-->
<!--              v-model="form.brandType"-->
<!--              :disabled="inputType==='readey'"-->
<!--              clearable-->
<!--              placeholder="请选择"-->
<!--              style="width: 300px;">-->
<!--            <el-option v-for="item in sourceList" :key="item.value" :label="item.label" :value="item.value"/>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-divider />
        <el-form-item label="成员数量">
          <span>{{ form.userCount }}个成员</span>
        </el-form-item>
        <el-form-item label="部门数量">
          <span>{{ form.deptCount }}个部门</span>
        </el-form-item>
        <el-form-item label="员工规模">
          <span>{{ form.userCount }}/{{ form.corpUserMax }}</span>
        </el-form-item>
        <el-divider />
        <el-form-item label="企业ID">
          <span>{{ corpId }}</span>
        </el-form-item>
        <el-form-item label="注册号">
          <span>{{ form.registrationNumber }}</span>
        </el-form-item>
        <el-form-item label="登记状态">
          <span>{{ form.registrationState }}</span>
        </el-form-item>
        <el-form-item label="成立日期">
          <span>{{ form.registrationTime }}</span>
        </el-form-item>
        <el-form-item label="注册类型">
          <span>{{ form.registrationType }}</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive} from "vue";
import {useStore} from 'vuex';
import {getToken} from '../../utils/auth';
import {getCorpInfo, getCorpEdit} from '../../api/company/info.js'
import { listUser } from "../../api/system/user";
import useUserStore from "../../store/modules/user";
import {ElMessage} from "element-plus";

const userStore = useUserStore(), corpId = userStore.userInfo.corpId
let inputType = ref('readey')
let store = useStore()
let uploadData = reactive({
  uploadUrl: import.meta.env.VITE_APP_BASE_API + '/file/file/upload',
  token: getToken(),
  dialogVisible: false,
  url: '',
  imgBannerParam: {path: 'corpInfo/corpImage/'},
})
const fileList = ref([])
const form = ref({
  logo: '', // 企业logo
  plainCorpId: '', // 企微ID
  legalPersonId: '', // 法定代表人
  name: '', // 企业名称
  fullname: '', // 企业全称
  corpType: '', // 企业类型:1厂家,2代理商,3连锁药房,4药店
  address: '', // 详细地址
  code: '', // 门店编码
  invoiceTitle: '', // 发票抬头
  phone: '', // 企业电话
  // brandType: '', // 连锁品牌：1和平，2鑫斛，3 等等其他的
  userCount: '', // 企业人数
  deptCount: '', // 企业部门数
  corpUserMax: '', // 企业人数上限
  registrationTime: '', // 成立日期
  registrationType: '', // 注册类型
  registrationNumber: '', // 注册号
  registrationState: '', // 登记状态
  // parentId: '' // 归属连锁
})
// 企业类型
const corpTypeList = [
  {value: 1, label: '厂家'},
  {value: 2, label: '代理商'},
  {value: 3, label: '连锁药房'},
  {value: 4, label: '药店'},
  {value: 5, label: '其他'},
]
// 连锁品牌
// const sourceList = [
//   {value: 1, label: '和平'},
//   {value: 2, label: '鑫斛'},
//   {value: 3, label: '等等其他的'},
// ]
// 获取公司信息

// 法定代表人
const legalPersonList = ref([])
// 法定代表人数据
function getSelectData() {
  listUser().then(res => {
    legalPersonList.value = res.data.list
  })
}
// 归属连锁
// function handelParent() {
//
// }

// 上传成功
function handleAvatarSuccess(res) {
  if (res.code === 200) {
    uploadData.url = res.data.url
    form.value.logo = uploadData.url
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(res.msg)
  }
}
// 上传验证
function beforeAvatarUpload(file) {
  const isPicture = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 702 / 180 < 2
  if (!isPicture) {
    ElMessage.error('请上传jepg,png,jpg格式的图片!')
    return false
  } else if (!isLt2M) {
    ElMessage.error('上传图片不能超过2M!')
    return false
  }
  return true
}
// 上传状态
function handleChange (file, fileList) {
  if (fileList.length > 1) {
    fileList.splice(0,1)
  }
}

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
    inputType.value='readey'
    onSubmit()
  } else if (type === 'cancel') {
    inputType.value='readey'
    getFormData()
  }
}
function onSubmit() {
  getCorpEdit(form.value).then(res => {
    if (res.code === 200) {
      ElMessage.success('修改成功')
      getFormData()
    }
  })
}
getSelectData()
getFormData()
</script>
<style lang="scss" scoped>
.app-container {
  .btn-box {
    float: right;
  }
  .form-box {
    .form-tips {
      font-size: 12px;
      color: #787878;
      margin-top: 7px;
    }
    .el-input {
      width: 350px;
    }
  }
}
</style>
