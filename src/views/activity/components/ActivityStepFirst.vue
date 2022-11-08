<template>
  <div class="app-container" v-loading="firstLoading" element-loading-text="加载中...">
    <el-form ref="activityRef" :model="form" :rules="rules" label-width="130px">
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
      <el-form-item class="label" label="活动奖励预算(元)" prop="moneyRange">
        <el-input style="width: 400px;"
                  oninput="value=value.replace(/[^0-9.]/g,'')"
                  v-model.number="form.moneyRange" placeholder="请输入任务奖励预算"
                  clearable
                  min="0"
                  :disabled="formDisabled"/>
      </el-form-item>
      <el-form-item class="label" label="开始时间" prop="beginTime">
        <el-date-picker @change="(time)=>{dataPicker('begin',time)}"
                        style="width: 400px;" v-model="form.beginTime" type="datetime" placeholder="开始时间"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        :default-time="new Date(2022, 9, 10, 0, 0,0)"
                        :disabled="formDisabled"/>
      </el-form-item>
      <el-form-item class="label" label="结束时间" prop="endTime">
        <el-date-picker
            @change="(time)=>{dataPicker('end',time)}"
            style="width: 400px;" v-model="form.endTime" type="datetime" placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="new Date(2022, 9, 10, 23, 59,59)"
            :disabled="formDisabled"/>
      </el-form-item>
      <el-form-item class="label" label="活动范围" prop="ruleScupes">
        <el-button @click="showRuleScupes = !showRuleScupes" link type="primary">
          <span v-show="handleType === 'query'">查看&nbsp;<span
              v-show="form.ruleScupes.length>0">已选择活动范围（{{ form.ruleScupes.length }}）个</span></span>
          <span v-show="handleType === 'edit'">编辑&nbsp;<span
              v-show="form.ruleScupes.length>0">已选择活动范围（{{ form.ruleScupes.length }}）个</span></span>
          <span v-show="handleType === 'add'">新增&nbsp;<span
              v-show="form.ruleScupes.length>0">已选择活动范围（{{ form.ruleScupes.length }}）个</span></span>
        </el-button>
      </el-form-item>
      <el-form-item class="label" label="活动负责人" prop="ruleResponsibleUsers">
        <el-button @click="chickShowUsers" link type="primary">
          <span v-show="handleType === 'query'">查看&nbsp;<span
              v-show="form.responsibleUsers.length>0">已选择负责人（{{ form.responsibleUsers.length }}）人</span></span>
          <span v-show="handleType === 'edit'">编辑&nbsp;<span
              v-show="form.responsibleUsers.length>0">已选择负责人（{{ form.responsibleUsers.length }}）人</span></span>
          <span v-show="handleType === 'add'">新增&nbsp;<span
              v-show="form.responsibleUsers.length>0">已选择负责人（{{ form.responsibleUsers.length }}）人</span></span>
        </el-button>
      </el-form-item>
      <el-form-item class="label" label="活动参与方" prop="participants">
        <el-button @click="showRarticipants = !showRarticipants" link type="primary">
          <span v-show="handleType === 'query'">查看&nbsp; <span
              v-show="form.participants.length>0">已选择参与方（{{ form.participants.length }}）个</span></span>
          <span v-show="handleType === 'edit'">编辑&nbsp;<span
              v-show="form.participants.length>0">已选择参与方（{{ form.participants.length }}）个</span></span>
          <span v-show="handleType === 'add'">新增&nbsp;<span
              v-show="form.participants.length>0">已选择参与方（{{ form.participants.length }}）个</span></span>
        </el-button>
      </el-form-item>
      <el-form-item class="label" label="任务描述" prop="comment">
        <el-input
            v-model="form.comment"
            :autosize="{ minRows: 3, maxRows: 9 }"
            type="textarea"
            placeholder="请输入任务描述"
            :disabled="formDisabled"
            style="width: 400px"/>
      </el-form-item>
      <!--      <el-form-item label="任务截止类型" prop="endType">-->
      <!--        <el-select v-model="form.endType" clearablestyle="width: 100%">-->
      <!--          <el-option v-for="item in activity_type" :value="item.value" :key="item.value" :label="item.label">-->
      <!--            {{ item.label }}-->
      <!--          </el-option>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->

      <!--      <el-form-item class="label" label="活动附件" prop="filesInfos">-->
      <!--        <el-upload-->
      <!--            :disabled="formDisabled"-->
      <!--            :action="uploadData.imgBannerUrl"-->
      <!--            :headers="{'Authorization':uploadData.token}"-->
      <!--            :data="uploadData.imgBannerParam"-->
      <!--            method:="POST"-->
      <!--            accept="image/jpg,image/jpeg,image/png"-->
      <!--            :limit="1"-->
      <!--            :file-list="imgBannerList"-->
      <!--            :show-file-list="false"-->
      <!--            :on-success="handleImgBannerSuccess">-->
      <!--          <div class="demo-image__placeholder">-->
      <!--            <div class="block">-->
      <!--              <el-image :src="form.files[0].url" v-if="form.files.length!==0"-->
      <!--                        style="width: 400px;height: 150px;border: 1px solid #c0c4cc">-->
      <!--                <template #placeholder>-->
      <!--                  <div class="image-slot">Loading<span class="dot">...</span></div>-->
      <!--                </template>-->
      <!--              </el-image>-->
      <!--              <el-image-->
      <!--                  v-if="form.files.length==0"-->
      <!--                  style="width: 400px;height: 100px;border: 1px solid #c0c4cc">-->
      <!--                <template #error>-->
      <!--                  <div class="image-slot"-->
      <!--                       style="display: flex;justify-content:center;align-items:center;height: 100px">-->
      <!--                    <el-icon :size="48">-->
      <!--                      <Picture/>-->
      <!--                    </el-icon>-->
      <!--                  </div>-->
      <!--                </template>-->
      <!--              </el-image>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </el-upload>-->
      <!--      </el-form-item>-->
    </el-form>
    <!--    let brandsOption = ref([])-->
    <!--    let productTypesOption = ref([])-->
    <!--    let specificationsOption = ref([])-->
    <el-dialog title="任务范围" v-model="showRuleScupes" width="50%">
      <el-form :model="queryRuleScupesParams">
        <el-form-item label="品类" prop="productTypes">
          <el-select :disabled="handleType=='query'" @change="changeGoodsRange"
                     v-model="queryRuleScupesParams.productTypes" multiple clearable
                     style="width: 100%;">
            <el-option v-for="item in productTypesOption" :value="item" :key="item"
                       :label="item">{{ item }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="brands">
          <el-select :disabled="handleType=='query'" @change="changeGoodsRange" v-model="queryRuleScupesParams.brands"
                     clearable multiple
                     style="width: 100%;">
            <el-option v-for="item in brandsOption" :value="item" :key="item"
                       :label="item">{{ item }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格" prop="specifications">
          <el-select :disabled="handleType=='query'" @change="changeGoodsRange"
                     v-model="queryRuleScupesParams.specifications" clearable multiple
                     style="width: 100%;">
            <el-option v-for="item in specificationsOption" :value="item" :key="item"
                       :label="item">{{ item }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <BusinessTree :isShowMenuCheckStrictly="false" ref="businessTreeParticipantsRef" :handelType="props.handleType"
                    :data="data.form.ruleScupes"></BusinessTree>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onSuccessRuleScupes" v-if="handleType !== 'query'">确 定</el-button>
          <el-button @click="onCancelRuleScupes">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="任务负责人选择" v-model="showResponsibleUsers" width="70%" :close-on-click-modal="false">
      <SelectUsers :data="data.form.responsibleUsers"
                   ref="responsibleUsersRef"></SelectUsers>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onSuccessResponsibleUsers" v-if="handleType !== 'query'">确 定</el-button>
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
import {nextTick, reactive} from "vue";
import {getToken} from "@/utils/auth";
import {ElMessage, ElMessageBox} from "element-plus";
import {queryBrandList} from "@/api/activity/activityProduct";

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
    comment: [{required: true, message: "请输入任务描述", trigger: "blur"}, {
      min: 4,
      max: 1028,
      message: "任务描述不得低于4字符",
      trigger: "blur"
    }],
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
    ruleScupes: [], //任务范围,
    ruleScupesLength: 0,
    sendNotice: false, //是否发送通知给执行人
    responsibleUsers: [],//任务负责人
    participants: [],//任务参与人
    // filesInfos: [],//任务附件
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
    if (props.eventId != null && props.canEdit) {
      form.value.eventId = props.eventId
      form.value.productFilter = queryRuleScupesParams.value
      return updateEventInfo(form.value)
    } else if (props.eventId === undefined) {
      return createEventInfo(form.value)
    } else if (props.eventId != null) {
      return new Promise((resolve) => {
        resolve({code: 200, data: props.eventId})
      })
    }
  } else {
    proxy.$modal.msgError("请输入完整信息");
  }
}

// const open = (value) => {
//   ElMessageBox.confirm(
//       '修改任务信息可能会导致活动规则错误,是否继续修改?',
//       'Warning',
//       {
//         confirmButtonText: '确定',
//         cancelButtonText: '取消',
//         type: 'warning',
//       }
//   )
//       .then(() => {
//         return updateEventInfo(value)
//       })
//       .catch(() => {
//         ElMessage({
//           type: 'info',
//           message: '取消修改',
//         })
//       })
// }


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
/**时间日期选择*/
const dataPicker = (tag, time) => {
  if (!time) {
    return
  }
  switch (tag) {
    case "begin":
      verifiyBeginTime(time)
      break
    case "end":
      verifiyEndTime(time)
      break
  }
}
/**校验开始日期*/
const verifiyBeginTime = (time) => {
//当结束日期为空的时候开始日期为任意日期
//当结束日期不为空时开始日期必须小于结束日期
  if (!form.value.endTime) {
    form.value.beginTime = time
  } else if (form.value.endTime) {
    if (compareDate(form.value.beginTime, form.value.endTime)) {
      form.value.beginTime = time
    } else {
      form.value.beginTime = null
      proxy.$modal.msgError("开始时间必须小于结束时间")
    }
  }
}

/**校验结束日期*/
const verifiyEndTime = (time) => {
//  当开始日期不为空时结束日期必须大于开始日期并且大于当前日期
  //  当开始日期为空时结束日期必须大于当前日期
  if (form.value.beginTime) {
    if (compareDate(form.value.beginTime, form.value.endTime)) {
      //    获取当前时间
      let nowDate = getCurrentTime()
      if (compareDate(nowDate, time)) {
        form.value.endTime = time
      } else {
        form.value.endTime = null
        proxy.$modal.msgError("结束时间必须大于当前时间")
      }
    } else {
      form.value.endTime = null
      proxy.$modal.msgError("结束时间必须大于开始时间")
    }
  } else {
    //    获取当前时间
    let nowDate = getCurrentTime()
    if (compareDate(nowDate, time)) {
      form.value.endTime = time
    } else {
      form.value.endTime = null
      proxy.$modal.msgError("结束时间必须大于当前时间")
    }
  }
}
/**两个时间比较大小*/
const compareDate = (dateTime1, dateTime2) => {
  let formatDate1 = new Date(dateTime1)
  let formatDate2 = new Date(dateTime2)
  if (formatDate1 > formatDate2) {
    return false
  } else {
    return true
  }
}
/**获取当前日期*/
const getCurrentTime = () => {
  let date = new Date();//当前时间
  let year = date.getFullYear() //返回指定日期的年份
  let month = repair(date.getMonth() + 1);//月
  let day = repair(date.getDate());//日
  let hour = repair(date.getHours());//时
  let minute = repair(date.getMinutes());//分
  let second = repair(date.getSeconds());//秒
  //当前时间
  let curTime = year + "-" + month + "-" + day
      + " " + hour + ":" + minute + ":" + second;
  return curTime;
}
/**补充0*/
const repair = (i) => {
  if (i >= 0 && i <= 9) {
    return "0" + i;
  } else {
    return i;
  }
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
  let resultData = businessTreeParticipantsRef.value.getMenuAllCheckedKeys()
  form.value.ruleScupes = resultData.map(item => ({nodeId: item.id}))
  form.value.ruleScupesLength = getStoreArray(resultData)
  showRuleScupes.value = false
  proxy.$refs["activityRef"].validateField('ruleScupes')
}
//获取范围为门店的信息
const getStoreArray = (data) => {
  return data.filter(item => {
    return item.type == 4
  }).length
}


// 范围选择取消
const onCancelRuleScupes = () => {
  //关闭弹窗
  showRuleScupes.value = false
  //清空数据
  if (props.eventId) {
    queryBrandList(props.eventId).then(res => {
      if (res.code === 200) {
        queryRuleScupesParams.value.brands = res.data.brands
        queryRuleScupesParams.value.productTypes = res.data.productTypes
        queryRuleScupesParams.value.specifications = res.data.specifications
      }
    })
  } else {
    queryRuleScupesParams.value = {
      productTypes: [], //品类
      brands: [], //品牌
      specifications: [], //规格
      storeIds: [] //门店范围
    }
  }

}

//任务负责人选择确定
const onSuccessResponsibleUsers = () => {
  showResponsibleUsers.value = false
  if (responsibleUsersRef.value.getSelectUsers().length > 0) {
    form.value.responsibleUsers = responsibleUsersRef.value.getSelectUsers().map(item => {
      return {
        userId: item.userId,
        name: item.userName
      }
    })
  }

  proxy.$refs["activityRef"].validateField('ruleResponsibleUsers')
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
    data.form = Object.assign(form.value, resultData)
  }
//  查询任务范围
  if (eventId) {
    queryBrandList(eventId).then(res => {
      if (res.code === 200) {
        queryRuleScupesParams.value.brands = res.data.brands
        queryRuleScupesParams.value.productTypes = res.data.productTypes
        queryRuleScupesParams.value.specifications = res.data.specifications
      }
    })
  }
}

const chickShowUsers = () => {
  showResponsibleUsers.value = !showResponsibleUsers.value

  //设置默认选中
  nextTick(() => {
    responsibleUsersRef.value.defineSelected()
    responsibleUsersRef.value.setPageNum()
  })

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
  canEdit: {
    type: Boolean,
    default: false
  }
})
onLoad()
</script>

<style scoped lang="scss">
.label::v-deep( .el-form-item__label) {
  color: #606266;
  font-weight: 600;
}
</style>
