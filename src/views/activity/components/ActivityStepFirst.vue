<template>
  <div class="app-container" v-loading="firstLoading" element-loading-text="加载中...">
    <el-form ref="activityRef" :model="form" :rules="rules" label-width="120px">
      <!--      <el-form-item class="label" label="任务简称" prop="name">-->
      <!--      <el-form-item class="label" label="任务简称">-->
      <!--        <el-input style="width: 400px;" v-model="form.name" placeholder="请输入任务简称" :disabled="formDisabled"/>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item class="label" label="任务全称" prop="fullname">-->
      <!--        <el-input style="width: 400px;" v-model="form.fullname" placeholder="请输入任务全称" :disabled="formDisabled"/>-->
      <!--      </el-form-item>-->
      <el-form-item class="label" label="活动名称" prop="name">
        <el-input style="width: 400px;" v-model="form.name" placeholder="请输入任务名称" :disabled="formDisabled"/>
      </el-form-item>
      <el-form-item class="label" label="活动奖励预算" prop="moneyRange">
        <el-input style="width: 400px;" type="number" v-model.number="form.moneyRange" placeholder="请输入任务奖励预算"
                  :disabled="formDisabled"/>
      </el-form-item>
      <el-form-item class="label" label="开始时间" prop="beginTime">
        <el-date-picker style="width: 400px;" v-model="form.beginTime" type="date" placeholder="开始时间"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        :disabled="formDisabled"/>
      </el-form-item>
      <el-form-item class="label" label="结束时间" prop="endTime">
        <el-date-picker style="width: 400px;" v-model="form.endTime" type="date" placeholder="结束时间"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        :disabled="formDisabled"/>
      </el-form-item>
      <el-form-item class="label" label="活动范围" prop="ruleScupes">
        <el-button @click="showRuleScupes = !showRuleScupes" link type="primary">
          <span v-show="handleType === 'query'">查看<span
              v-show="form.ruleScupes.length>0">已选择（{{ form.ruleScupes.length }}）个</span></span>
          <span v-show="handleType === 'edit'">编辑<span
              v-show="form.ruleScupes.length>0">已选择（{{ form.ruleScupes.length }}）个</span></span>
          <span v-show="handleType === 'add'">新增<span
              v-show="form.ruleScupes.length>0">已选择（{{ form.ruleScupes.length }}）个</span></span>
        </el-button>
      </el-form-item>
      <el-form-item class="label" label="活动负责人" prop="ruleResponsibleUsers">
        <el-button @click="showResponsibleUsers = !showResponsibleUsers" link type="primary">
          <span v-show="handleType === 'query'">查看<span
              v-show="form.responsibleUsers.length>0">已选择（{{ form.responsibleUsers.length }}）个</span></span>
          <span v-show="handleType === 'edit'">编辑<span
              v-show="form.responsibleUsers.length>0">已选择（{{ form.responsibleUsers.length }}）个</span></span>
          <span v-show="handleType === 'add'">新增<span
              v-show="form.responsibleUsers.length>0">已选择（{{ form.responsibleUsers.length }}）个</span></span>
        </el-button>
      </el-form-item>
      <el-form-item class="label" label="活动参与方" prop="participants">
        <el-button @click="showRarticipants = !showRarticipants" link type="primary">
          <span v-show="handleType === 'query'">查看 <span
              v-show="form.participants.length>0">已选择（{{ form.participants.length }}）个</span></span>
          <span v-show="handleType === 'edit'">编辑<span
              v-show="form.participants.length>0">已选择（{{ form.participants.length }}）个</span></span>
          <span v-show="handleType === 'add'">新增<span
              v-show="form.participants.length>0">已选择（{{ form.participants.length }}）个</span></span>
        </el-button>
      </el-form-item>
      <el-form-item class="label" label="任务描述" prop="comment">
        <el-input
            v-model="form.comment"
            :autosize="{ minRows: 2, maxRows: 8 }"
            type="textarea"
            placeholder="请输入任务描述"/>
      </el-form-item>

      <!--      <el-form-item label="任务截止类型" prop="endType">-->
      <!--        <el-select v-model="form.endType" clearablestyle="width: 100%">-->
      <!--          <el-option v-for="item in activity_type" :value="item.value" :key="item.value" :label="item.label">-->
      <!--            {{ item.label }}-->
      <!--          </el-option>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item class="label" label="活动附件" prop="filesInfos">
        <el-upload
            :disabled="formDisabled"
            :action="uploadData.imgBannerUrl"
            :headers="{'Authorization':uploadData.token}"
            :data="uploadData.imgBannerParam"
            method:="POST"
            accept="image/jpg,image/jpeg,image/png"
            :limit="1"
            :file-list="imgBannerList"
            :show-file-list="false"
            :on-success="handleImgBannerSuccess">
          <div class="demo-image__placeholder">
            <div class="block">
              <el-image :src="form.files[0].url" v-if="form.files.length!==0"
                        style="width: 400px;height: 150px;border: 1px solid #c0c4cc">
                <template #placeholder>
                  <div class="image-slot">Loading<span class="dot">...</span></div>
                </template>
              </el-image>
              <el-image
                  v-if="form.files.length==0"
                  style="width: 400px;height: 100px;border: 1px solid #c0c4cc">
                <template #error>
                  <div class="image-slot"
                       style="display: flex;justify-content:center;align-items:center;height: 100px">
                    <el-icon :size="48">
                      <Picture/>
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </div>
          </div>
        </el-upload>


      </el-form-item>
    </el-form>
    <!--    let brandsOption = ref([])-->
    <!--    let productTypesOption = ref([])-->
    <!--    let specificationsOption = ref([])-->
    <el-dialog title="任务范围" v-model="showRuleScupes" width="50%">
      <el-form :model="queryRuleScupesParams" label-width="68px">
        <el-form-item @change="changeGoodsRange" label="品类" prop="productTypes">
          <el-select v-model="queryRuleScupesParams.productTypes" multiple clearable>
            <el-option v-for="item in productTypesOption" :value="item" :key="item"
                       :label="item">{{ item }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="brands">
          <el-select @change="changeGoodsRange" v-model="queryRuleScupesParams.brands" clearable multiple>
            <el-option v-for="item in brandsOption" :value="item" :key="item"
                       :label="item">{{ item }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格" prop="specifications">
          <el-select @change="changeGoodsRange" v-model="queryRuleScupesParams.specifications" clearable multiple>
            <el-option v-for="item in specificationsOption" :value="item" :key="item"
                       :label="item">{{ item }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <BusinessTree ref="businessTreeParticipantsRef" :handelType="props.handleType"
                    :data="data.form.ruleScupes"></BusinessTree>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onSuccessRuleScupes">确 定</el-button>
          <el-button @click="onCancelRuleScupes">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="任务负责人选择" v-model="showResponsibleUsers" width="70%" :close-on-click-modal="false">
      <SelectUsers :data="data.form.responsibleUsers" ref="responsibleUsersRef"></SelectUsers>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onSuccessResponsibleUsers">确 定</el-button>
          <el-button @click="onCancelResponsibleUsers">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="任务参与方" v-model="showRarticipants" width="50%" :close-on-click-modal="false">
      <!--      <el-form :model="queryRuleScupesParams" label-width="68px">-->
      <!--        <el-form-item label="品类" prop="productTypes">-->
      <!--          <el-select v-model="queryRuleScupesParams.productTypes" multiple clearable>-->
      <!--            <el-option v-for="item in activity_type" :value="item.value" :key="item.value"-->
      <!--                       :label="item.label">{{ item.label }}-->
      <!--            </el-option>-->
      <!--          </el-select>-->
      <!--        </el-form-item>-->
      <!--        <el-form-item label="品牌" prop="brands">-->
      <!--          <el-select v-model="queryRuleScupesParams.brands" clearable multiple>-->
      <!--            <el-option v-for="item in activity_type" :value="item.value" :key="item.value"-->
      <!--                       :label="item.label">{{ item.label }}-->
      <!--            </el-option>-->
      <!--          </el-select>-->
      <!--        </el-form-item>-->
      <!--        <el-form-item label="规格" prop="specifications">-->
      <!--          <el-select v-model="queryRuleScupesParams.specifications" clearable multiple>-->
      <!--            <el-option v-for="item in activity_type" :value="item.value" :key="item.value"-->
      <!--                       :label="item.label">{{ item.label }}-->
      <!--            </el-option>-->
      <!--          </el-select>-->
      <!--        </el-form-item>-->
      <!--      </el-form>-->
      <BusinessTree ref="businessTreeParticipantsRef" :handelType="props.handleType"
                    :data="data.form.participants"></BusinessTree>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onSuccessRarticipants">确 定</el-button>
          <el-button @click="onCancelRarticipants">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  createEventInfo,
  updateEventInfo,
  getEventInfoByid,
  delEventInfoByid,
  queryEventInfoList,
  filterGoods
} from "@/api/activity/eventInfo";
import BusinessTree from '@/components/BusinessTree/index'
import SelectUsers from '@/components/SelectUsers/index'
import {reactive} from "vue";
import {getToken} from "@/utils/auth";
import {ElMessage} from "element-plus";

let ruleScupes = (rule, value, callback) => {
  if (form.value.ruleScupes === undefined || form.value.ruleScupes.length === 0) {
    callback(new Error("请选择任务范围"));
  } else {
    callback();
  }
}
let ruleResponsibleUsers = (rule, value, callback) => {
  if (form.value.responsibleUsers === undefined || form.value.responsibleUsers.length === 0) {
    callback(new Error("请选择任务负责人"));
  } else {
    callback();
  }
}

const {proxy} = getCurrentInstance();
const {activity_type} = proxy.useDict("activity_type");
const showRuleScupes = ref(false)
const showResponsibleUsers = ref(false)
const showRarticipants = ref(false)
let firstLoading = ref(false)
const businessTreeParticipantsRef = ref()
const responsibleUsersRef = ref()
const data = reactive({
  form: {
    comment: '',
    files: [],
    ruleScupes: [],
    participants: [],
    responsibleUsers: [],
    productFilter: {
      productTypes: [], //品类
      brands: [], //品牌
      specifications: [], //规格
    },
  },
  rules: {
    beginTime: [{required: true, message: "请选择开始时间", trigger: "change"}],
    endTime: [{required: true, message: "请选择结束时间", trigger: "change"}],
    name: [{required: true, message: "请输入名称", trigger: "blur"}],
    fullname: [{required: true, message: "请输入全称", trigger: "blur"}],
    moneyRange: [{required: true, message: "请输入任务奖励预算", trigger: "blur"}],
    ruleScupes: [{required: true, validator: ruleScupes}],
    ruleResponsibleUsers: [{required: true, validator: ruleResponsibleUsers}],
    // taskName: [{required: true, message: "请输入名称", trigger: "blur"}],
    comment: [{required: true, message: "请输入任务描述", trigger: "blur"}],
  }
});

const {form, rules} = toRefs(data);

// 表单重置
function reset() {
  form.value = {
    comment: '',
    canEdit: false,
    activityJoint: false,
    moneyRange: 0,//任务奖励预算
    name: '',//名称
    fullname: '', //全称
    beginTime: '', //开始时间
    endTime: '', //结束时间
    files: [],
    ruleScupes: [], //任务范围
    sendNotice: false, //是否发送通知给执行人
    responsibleUsers: [],//任务负责人
    participants: [],//任务参与人
    filesInfos: [],//任务附件
    endType: '',//任务截止类型
    betweendates: [],
    syncCalendar: false,
    syncChatSidebar: false,
    syncCreatePoster: false,
    syncProdKnowledge: false,
    productFilter: {
      productTypes: [], //品类
      brands: [], //品牌
      specifications: [], //规格
    },

  };
  proxy.resetForm("activityRef");
}

/**上传附件*/
const imgBannerList = ref([])
let uploadData = reactive({
  imgBannerUrl: import.meta.env.VITE_APP_BASE_API + '/file/file/upload',
  imgBannerParam: {path: '/activity/imgBanner'},
  token: getToken(),
  parameter: {corpId: '', file: ''}
})
/**上传文件成功的回调*/
const handleImgBannerSuccess = (res) => {
  //成功之后清空上传文件列表
  imgBannerList.value = []
  if (res.code === 200) {
    //清空原文件
    form.value.files = []
    form.value.files.push(res.data)
    ElMessage({type: 'success', message: res.msg})
  } else {
    ElMessage({type: 'warning', message: res.msg})
  }
}

/** 提交按钮 */
async function submitForm() {
  let v = await proxy.$refs["activityRef"].validate();
  if (v) {
    //任务范围
    firstLoading.value = true
    if (form.value.eventId != null && form.value.canEdit) {
      return updateEventInfo(form.value)
    } else if (form.value.eventId === undefined) {
      return createEventInfo(form.value)
    } else if (form.value.eventId != null) {
      return new Promise((resolve) => {
        resolve({code: 200, data: form.value.eventId})
      })
    }
  } else {
    proxy.$modal.msgError("请输入完整信息");
  }
}

let brandsOption = ref([])
let productTypesOption = ref([])
let specificationsOption = ref([])
//范围选择条件
const queryRuleScupesParams = ref({
  productTypes: [], //品类
  brands: [], //品牌
  specifications: [], //规格
  storeIds: [] //门店范围
})
//商品范围改变
const changeGoodsRange = () => {
  loadGoodsFilterOption()
}
//加载品牌、品类、规格的选项
const loadGoodsFilterOption = () => {
  //加载品牌/品类/规格过滤选项
  filterGoods(queryRuleScupesParams.value).then(res => {
    let {brands, productTypes, specifications} = res.data
    brandsOption.value = brands
    productTypesOption.value = productTypes
    specificationsOption.value = specifications
  })
}

// 范围选择确定
const onSuccessRuleScupes = () => {
  form.value.productFilter = {
    productTypes: [],
    brands: [],
    specifications: [],
  }
  if (queryRuleScupesParams.value.productTypes.length == 0) {
    form.value.productFilter.productTypes = undefined
  } else {
    form.value.productFilter.productTypes = queryRuleScupesParams.value.productTypes
  }
  if (queryRuleScupesParams.value.brands.length == 0) {
    form.value.productFilter.brands = undefined
  } else {
    form.value.productFilter.brands = queryRuleScupesParams.value.brands
  }
  if (queryRuleScupesParams.value.specifications.length == 0) {
    form.value.productFilter.specifications = undefined
  } else {
    form.value.productFilter.specifications = queryRuleScupesParams.value.specifications
  }
  form.value.ruleScupes = businessTreeParticipantsRef.value.getMenuAllCheckedKeys().map(item => ({nodeId: item.id}))
  showRuleScupes.value = false
}
// 范围选择取消
const onCancelRuleScupes = () => {
  //关闭弹窗
  showRuleScupes.value = false
  //清空数据
  queryRuleScupesParams.value = {
    productTypes: [], //品类
    brands: [], //品牌
    specifications: [], //规格
    storeIds: [] //门店范围
  }
}

//任务负责人选择确定
const onSuccessResponsibleUsers = () => {
  showResponsibleUsers.value = false
  form.value.responsibleUsers = responsibleUsersRef.value.getSelectUsers().map(item => {
    return {
      userId: item.userId,
      name: item.userName
    }
  })
}
//任务负责人选择取消
const onCancelResponsibleUsers = () => {
  showResponsibleUsers.value = false
}
//任务参与方选择确定
const onSuccessRarticipants = () => {
  showRarticipants.value = false
  form.value.participants = businessTreeParticipantsRef.value.getMenuAllCheckedKeys().map(item => ({
    nodeId: item.id,
    name: item.name
  }))
}
//任务参与方选择取消
const onCancelRarticipants = () => {
  showRarticipants.value = false
}

//查询任务数据
const queryActivityEventId = async (eventId) => {
  let {code, data: resultData} = await getEventInfoByid(eventId)
  if (code === 200) {
    data.form = resultData
  }
}


//添加loading
const openLoading = () => {
  firstLoading.value = true
}
//移除loading
const closeLoading = () => {
  firstLoading.value = false
}

defineExpose({
  submitForm,
  closeLoading,
  openLoading
})


const formDisabled = ref(false)
const onLoad = async () => {
  loadGoodsFilterOption()
  let handleType = props.handleType
  switch (handleType) {
    case 'add' :
      break;
    case 'edit' :
      firstLoading.value = true
      await queryActivityEventId(props.eventId)
      firstLoading.value = false
      break;
    case 'query' :
      //禁用表单
      formDisabled.value = true
      firstLoading.value = true
      await queryActivityEventId(props.eventId)
      firstLoading.value = false
      //查询任务数据
      break;
  }
}
const props = defineProps({
  handleType: {
    type: String,
    default: 'add'
  },
  eventId: {
    type: String,
    default: undefined
  },
})
onLoad()


</script>

<style scoped lang="scss">
.label::v-deep( .el-form-item__label) {
  color: #606266;
  font-weight: 600;
  justify-content: flex-start !important;
}
</style>
