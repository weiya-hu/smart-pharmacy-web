<template>
  <div class="app-container">
    <div class="btn-box">
      <el-button type="primary"  @click="handelRead('edit')" v-if="inputType === 'readey'">修改</el-button>
      <el-button v-if="inputType!=='readey'" type="primary" @click="handelRead('sure')">确定</el-button>
      <el-button v-if="inputType!=='readey'" @click="handelRead('cancel')">取消</el-button>
    </div>
    <div class="form-box">
      <el-form v-model="form" label-position="left">
        <el-form-item label="企业logo" prop="logo">
          <div>
            <el-upload
             v-if="inputType!=='readey'"
             class="avatar-uploader"
             accept="image/*"
             :file-list="fileList"
             :action="uploadData.uploadUrl"
             :headers="{ 'Authorization': uploadData.token }"
             :show-file-list="false"
             :on-success="handleAvatarSuccess"
             :before-upload="beforeAvatarUpload"
             :on-change="handleChange"
             style="width:180px;height:180px;"
            >
              <div style="textAlign: center;width:180px;height:180px;border: 1px dashed #ddd;">
                <el-icon style="marginTop:50px" size="80px">
                  <Plus/>
                </el-icon>
              </div>
            </el-upload>

            <div v-if="inputType==='readey'" class="demo-image__preview">
              <el-image
                  :src="form.url"
                  :initial-index="4"
                  fit="cover"
                  style="width:210px;height:100px;"/>
            </div>
            <div class="form-tips">推荐尺寸702*180</div>
          </div>
        </el-form-item>
        <el-form-item label="老板的ID" prop="bossUserId">
          <el-input v-model="form.bossUserId" readonly :disabled="inputType==='readey'" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="企业名称">
          <el-input v-model="form.name" readonly :disabled="inputType==='readey'" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="企业全称">
          <el-input v-model="form.fullname" readonly :disabled="inputType==='readey'" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="企业类型">
          <el-select v-model="form.corpType" :disabled="inputType==='readey'" placeholder="请选择" style="width: 300px;">
            <el-option v-for="item in corpTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="门店编号" v-if="form.corpType !== 3">
          <el-input v-model="form.code"
                    clearable
                    :disabled="inputType==='readey'"
                    style="width: 300px;" />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="form.address" placeholder="请输入详细地址" style="width: 300px;" :disabled="inputType==='readey'"></el-input>
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
        <el-form-item label="企业成员">
          <span>{{ form.userCount }}个成员</span>
        </el-form-item>
        <el-form-item label="企业部门">
          <span>{{ form.deptCount }}个部门</span>
        </el-form-item>
        <el-form-item label="已使用 / 人数上限">
          <span>{{ form.userCount }}/{{ form.corpUserMax }}</span>
        </el-form-item>
        <el-divider />
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
import useUserStore from "../../store/modules/user";
import {ElMessage} from "element-plus";

const userStore = useUserStore(), corpId = userStore.userInfo.corpId
let inputType = ref('readey')
let store = useStore()
let uploadData = reactive({
  uploadUrl: import.meta.env.VITE_APP_BASE_API + '/file/file/upload?path=temp&corpId=' + corpId,
  token: getToken(),
  dialogVisible: false,
})
const fileList = ref([])
const form = ref({
  bossUserId: '', // 老板的userID
  logo: '', // 企业logo
  name: '', // 企业名称
  fullname: '', // 企业全称
  corpType: '', // 企业类型:1厂家,2代理商,3连锁药房,4药店
  address: '', // 详细地址
  code: '', // 门店编码
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
]
// 连锁品牌
// const sourceList = [
//   {value: 1, label: '和平'},
//   {value: 2, label: '鑫斛'},
//   {value: 3, label: '等等其他的'},
// ]
// 获取公司信息

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
// 归属连锁
// function handelParent() {
//
// }


// 上传成功
function handleAvatarSuccess(res) {
  if (res.code === 200) {
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
  }
}
</style>
