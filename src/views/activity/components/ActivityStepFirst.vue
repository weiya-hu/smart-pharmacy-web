<template>
  <div class="app-container">
    <el-form ref="activityRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="任务简称" prop="name">
        <el-input v-model="form.name" placeholder="请输入任务简称" :disabled="formDisabled"/>
      </el-form-item>
      <el-form-item label="任务全称" prop="fullname">
        <el-input v-model="form.fullname" placeholder="请输入任务全称" :disabled="formDisabled"/>
      </el-form-item>
      <el-form-item label="任务奖励预算" prop="moneyRange">
        <el-input type="number" v-model.number="form.moneyRange" placeholder="请输入任务奖励预算"
                  :disabled="formDisabled"/>
      </el-form-item>

      <el-form-item label="开始时间" prop="beginTime">
        <el-date-picker v-model="form.beginTime" type="date" placeholder="开始时间" value-format="YYYY-MM-DD HH:mm:ss"
                        :disabled="formDisabled"/>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker v-model="form.endTime" type="date" placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss"
                        :disabled="formDisabled"/>
      </el-form-item>
      <el-form-item label="任务范围" prop="ruleScupes">
        <el-button @click="showRuleScupes = !showRuleScupes" link type="primary">
          <span v-show="handleType === 'query'">查看</span>
          <span v-show="handleType === 'edit'">编辑</span>
          <span v-show="handleType === 'add'">新增</span>
        </el-button>
      </el-form-item>
      <el-form-item label="任务负责人" prop="ruleResponsibleUsers">
        <el-button @click="showResponsibleUsers = !showResponsibleUsers" link type="primary">
          <span v-show="handleType === 'query'">查看</span>
          <span v-show="handleType === 'edit'">编辑</span>
          <span v-show="handleType === 'add'">新增</span>
        </el-button>
      </el-form-item>
      <el-form-item label="任务参与方" prop="participants">
        <el-button @click="showRarticipants = !showRarticipants" link type="primary">
          <span v-show="handleType === 'query'">查看</span>
          <span v-show="handleType === 'edit'">编辑</span>
          <span v-show="handleType === 'add'">新增</span>
        </el-button>
      </el-form-item>
      <!--      <el-form-item label="任务截止类型" prop="endType">-->
      <!--        <el-select v-model="form.endType" clearablestyle="width: 100%">-->
      <!--          <el-option v-for="item in activity_type" :value="item.value" :key="item.value" :label="item.label">-->
      <!--            {{ item.label }}-->
      <!--          </el-option>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item label="任务附件" prop="filesInfos">
        <el-upload
            v-model:file-list="form.filesInfos"
            class="upload-demo"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :limit="3"
        >
          <el-button type="primary" size="small">上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>

    <el-dialog title="任务范围" v-model="showRuleScupes" width="50%" >
      <el-form :model="queryRuleScupesParams" label-width="68px">
        <el-form-item label="品类" prop="productTypes">
          <el-select v-model="queryRuleScupesParams.productTypes" multiple clearable>
            <el-option v-for="item in activity_type" :value="item.value" :key="item.value"
                       :label="item.label">{{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="brands">
          <el-select v-model="queryRuleScupesParams.brands" clearable multiple>
            <el-option v-for="item in activity_type" :value="item.value" :key="item.value"
                       :label="item.label">{{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格" prop="specifications">
          <el-select v-model="queryRuleScupesParams.specifications" clearable multiple>
            <el-option v-for="item in activity_type" :value="item.value" :key="item.value"
                       :label="item.label">{{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <BusinessTree ref="businessTreeParticipantsRef" :handelType="props.handleType" :data="data.form.ruleScupes"></BusinessTree>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onSuccessRuleScupes">确 定</el-button>
          <el-button @click="onCancelRuleScupes">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="任务负责人选择" v-model="showResponsibleUsers" width="70%" :close-on-click-modal="false">
      <SelectUsers ref="responsibleUsersRef"></SelectUsers>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onSuccessResponsibleUsers">确 定</el-button>
          <el-button @click="onCancelResponsibleUsers">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="任务参与方" v-model="showRarticipants" width="50%" :close-on-click-modal="false">
      <el-form :model="queryRuleScupesParams" label-width="68px">
        <el-form-item label="品类" prop="productTypes">
          <el-select v-model="queryRuleScupesParams.productTypes" multiple clearable>
            <el-option v-for="item in activity_type" :value="item.value" :key="item.value"
                       :label="item.label">{{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="brands">
          <el-select v-model="queryRuleScupesParams.brands" clearable multiple>
            <el-option v-for="item in activity_type" :value="item.value" :key="item.value"
                       :label="item.label">{{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格" prop="specifications">
          <el-select v-model="queryRuleScupesParams.specifications" clearable multiple>
            <el-option v-for="item in activity_type" :value="item.value" :key="item.value"
                       :label="item.label">{{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <BusinessTree ref="businessTreeParticipantsRef" :handelType="props.handleType" :data="data.form.participants" ></BusinessTree>
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
} from "@/api/activity/eventInfo";
import BusinessTree from '@/components/BusinessTree/index'
import SelectUsers from '@/components/SelectUsers/index'

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

const businessTreeParticipantsRef = ref()
const responsibleUsersRef = ref()

const data = reactive({
  form: {},
  rules: {
    beginTime: [{required: true, message: "请选择开始时间", trigger: "change"}],
    endTime: [{required: true, message: "请选择结束时间", trigger: "change"}],
    name: [{required: true, message: "请输入简称", trigger: "blur"}],
    fullname: [{required: true, message: "请输入全称", trigger: "blur"}],
    moneyRange: [{required: true, message: "请输入任务奖励预算", trigger: "blur"}],
    ruleScupes: [{required: true, validator: ruleScupes}],
    ruleResponsibleUsers: [{required: true, validator: ruleResponsibleUsers}],
  }
});

const {form, rules} = toRefs(data);


// 表单重置
function reset() {
  form.value = {
    activityJoint: false,
    moneyRange: 0,//任务奖励预算
    name: '', //简称
    fullname: '', //全称
    beginTime: '', //开始时间
    endTime: '', //结束时间
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
  };
  proxy.resetForm("activityRef");
}

/** 提交按钮 */
async function submitForm() {
  let v = await proxy.$refs["activityRef"].validate();
  if (v) {
    //任务范围
    if (form.value.eventId != null) {
      return updateEventInfo(form.value)
    } else {
      return createEventInfo(form.value)
    }
  }
}


//范围选择条件
const queryRuleScupesParams = ref({
  productTypes: [], //品类
  brands: [], //品牌
  specifications: [], //规格
  storeIds: [] //门店范围
})

// 范围选择确定
const onSuccessRuleScupes = () => {
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
  form.value.responsibleUsers = responsibleUsersRef.value.getSelectUsers().map(item => ({userId: item.userId}))
}
//任务负责人选择取消
const onCancelResponsibleUsers = () => {
  showResponsibleUsers.value = false
}
//任务参与方选择确定
const onSuccessRarticipants = () => {
  showRarticipants.value = false
  form.value.rarticipants = businessTreeParticipantsRef.value.getMenuAllCheckedKeys().map(item => ({
    nodeId: item.id,
    name: item.name
  }))
}
//任务参与方选择取消
const onCancelRarticipants = () => {
  showRarticipants.value = false
}

//查询任务数据
const queryActivityEventId = (eventId) => {
  getEventInfoByid(eventId)
      .then(res => {
        if (res.code === 200) {
          data.form = res.data
        }
      })
}


defineExpose({
  submitForm
})

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

const formDisabled = ref(false)
const onLoad = async () => {
  let handleType = props.handleType
  switch (handleType) {
    case 'add' :
      break;
    case 'edit' :
      await queryActivityEventId(props.eventId)
      break;
    case 'query' :
      //禁用表单
      formDisabled.value = true
      queryActivityEventId(props.eventId)
      //查询任务数据
      break;
  }
}
onLoad()


</script>

<style scoped>

</style>
