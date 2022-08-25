<template>
  <div class="outBox">
    <el-dialog :append-to-body="false" :width="dialogWidth" v-model="dialogFormVisible"
               :close-on-click-modal="false"
               :title="title"
               style="width: 80vw">
      <template v-if="step==1">
        <el-form v-loading="isShowLoading" ref="baseForm" :model="activeTaskInfo" :rules="ruleForm" label-width="100px"
                 label-position="left">
          <el-form-item class="label" label="激励活动名称" label-width="50" prop="name">
            <el-input clearable placeholder="请输入" v-model="activeTaskInfo.name" autocomplete="off"/>
          </el-form-item>
          <el-form-item class="label" label="激励活动类型">
            <el-select clearable v-model="activeTaskInfo.region" placeholder="请选择">
              <el-option label="销售激励" value="shanghai"/>
              <el-option label="激励销售" value="beijing"/>
            </el-select>
          </el-form-item>
          <el-form-item class="label" label="激励负责人" prop="responsibleUsers">
            <!--激励负责人数据回显-->
            <div class="responsibilityPeople">
              <el-tag
                  style="marginLeft:5px "
                  v-for="(item,index) in activeTaskInfo.responsibleUsers"
                  :key="index"
                  type="success"
              >
                {{ item.userName }}
              </el-tag>
            </div>
            <el-link style="marginLeft:5px " v-if="activeTaskInfo.responsibleUsers.length==0" @click="showPeopleDialog"
                     type="primary">请选择
            </el-link>
            <el-link style="marginLeft:5px " v-if="activeTaskInfo.responsibleUsers.length!==0" @click="showPeopleDialog"
                     type="primary">
              修改
            </el-link>
            <selectDialog :emitName="'responsible'" @responsible="responsibleCallBack"
                          ref="selectPeopleResponsibility"></selectDialog>

          </el-form-item>
          <el-form-item class="label" label="激励参与人" prop="participants">

            <!--激励参与数据回显-->
            <div class="responsibilityPeople">
              <el-tag
                  style="marginLeft:5px "
                  v-for="(item,index) in activeTaskInfo.participants"
                  :key="index"
                  type="success"
              >
                {{ item.userName }}
              </el-tag>
            </div>


            <el-link v-if="activeTaskInfo.participants.length==0" style="marginLeft:5px " @click="showDeepDialog"
                     type="primary">请选择
            </el-link>
            <el-link v-if="activeTaskInfo.participants.length!==0" style="marginLeft:5px " @click="showDeepDialog"
                     type="primary">修改
            </el-link>
            <el-link style="marginLeft:5px " @click="addParticipantDialog" type="primary">录入参与人</el-link>
            <selectDialog :emitName="'participate'" @participate="participateCallBack"
                          ref="selectPeopleParticipate"></selectDialog>
            <ParticipantDialog ref="ParticipantDialogInstance"></ParticipantDialog>
          </el-form-item>
          <el-form-item class="label" label="激励范围">
            <el-link @click="selectRangeFunction" type="primary">请选择</el-link>
            <el-link v-if="false" @click="selectRangeFunction" type="primary">修改</el-link>
            <selectionRange ref="selectRange"></selectionRange>
          </el-form-item>
          <el-form-item class="label" label="任务时段" prop="timeLimite">
            <el-date-picker
                v-model="activeTaskInfo.timeLimite"
                type="datetimerange"
                range-separator="~"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item class="label" label="任务海报">
            <el-upload
                :action="uploadData.imgBannerUrl"
                :headers="{'Authorization':uploadData.token}"
                :data="uploadData.imgBannerParam"
                method:="POST"
                accept="image/jpg,image/jpeg,image/png"
                :limit="1"
                :file-list="imgBannerList"
                :show-file-list="false"
                :on-success="handleImgBannerSuccess"
            >
              <div class="demo-image__placeholder">
                <!--                <div class="block">-->
                <!--                  <el-image :src="postData.imgBanner" v-if="postData.imgBanner"-->
                <!--                            style="width: 300px;height: 100px;border: 1px solid #c0c4cc">-->
                <!--                    <template #placeholder>-->
                <!--                      <div class="image-slot">Loading<span class="dot">...</span></div>-->
                <!--                    </template>-->
                <!--                  </el-image>-->
                <!--                  <el-image v-if="!postData.imgBanner" style="width: 300px;height: 100px;border: 1px solid #c0c4cc">-->
                <!--                    <template #error>-->
                <!--                      <div class="image-slot"-->
                <!--                           style="display: flex;justify-content:center;align-items:center;height: 100px">-->
                <!--                        <el-icon :size="48">-->
                <!--                          <Picture/>-->
                <!--                        </el-icon>-->
                <!--                      </div>-->
                <!--                    </template>-->
                <!--                  </el-image>-->
                <!--                </div>-->
                <el-link type="primary">上传</el-link>

              </div>
            </el-upload>
          </el-form-item>
          <el-form-item class="label" label="任务描述" prop="comment">
            <el-input
                v-model="activeTaskInfo.comment"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
                placeholder="请输入描述"
            />
          </el-form-item>
        </el-form>
      </template>
      <template v-if="step==2">
        <div class="step_two_outBox">
          <div class="topHeader">
            <div class="info">
              <span class="title">奖励设定</span>
              <span>总则:预算用完，奖励结束</span>
              <span>预估奖金总额:126500元</span>
            </div>
            <div class="budget">
              <span>我的奖金预算: </span>
              <div>
                <el-input placeholder="请输入"></el-input>
              </div>
              <span>元</span>
            </div>
          </div>
          <div class="content-box">
            <el-tabs
                type="border-card">
              <el-tab-pane label="单品">
                <div v-for="(item,index) in 2" :key="index" class="content">
                  <div class="activeType">
                    <div class="select">
                      <span>活动类型:单品奖励</span>
                      <span>
                  单品奖励，指的是以组合商品/单个商品为销售目标，对参与人员给予奖励。
                </span>
                    </div>
                    <div>
                      <!-- 活动类型--单品奖励-->
                      <single :ref="singleInstance"></single>
                    </div>
                  </div>
                </div>

              </el-tab-pane>
              <el-tab-pane label="门店">
                <div class="content">
                  <div class="activeType">
                    <div class="select">
                      <span>活动类型:门店奖励</span>
                      <span>
                  门店奖励，指的是以门店商品销售额为销售目标，对参与人员给予奖励。
                </span>
                    </div>
                    <div>
                      <!-- 活动类型--门店奖励-->
                      <store :ref="storeInstance"></store>
                    </div>
                  </div>

                </div>
              </el-tab-pane>
              <el-tab-pane label="品牌">
                <div class="content">
                  <div class="activeType">
                    <div class="select">
                      <span>活动类型:品牌奖励</span>
                      <span>
                 品牌奖励，指的是以品牌销售额为销售目标，对参与人员给予奖励。
                </span>
                    </div>
                    <div>
                      <!--  活动类型--品牌奖励-->
                      <brand :ref="brandInstance"></brand>
                    </div>
                  </div>

                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="bottomFooter">
            <el-button type="primary" size="small" class="el-icon-plus" @click="addRewardRules"
                       :icon="Plus">
              新增奖励规则
            </el-button>
            <addRewardRulesDialog ref="addRewardRulesInstance"></addRewardRulesDialog>
          </div>
        </div>
      </template>
      <template #footer>
      <span class="dialog-footer">
        <el-button v-if="step==2" @click="cutStep('decrease')">上一步</el-button>
        <el-button v-if="step==1" @click="cutStep('add')">下一步</el-button>
        <el-button @click="close">取消</el-button>
        <el-button v-if="step==2" type="primary" @click="subMit"
        >保存</el-button
        >
      </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import {Plus, Search, Picture, RefreshRight} from '@element-plus/icons-vue'
import {reactive, ref, defineProps, getCurrentInstance, onMounted, onBeforeUpdate, watch, nextTick} from 'vue'
import ParticipantDialog from '../participantDialog/index.vue'
import {useSelectionRangeFunction} from '@/hooks/use-selectRange.js'
import {useSelectDialogFunction} from '@/hooks/use-selectDialog.js'
import selectionRange from '@/components/selectionRange/selectionRange.vue'
import selectDialog from '@/components/selectDialog/selectDialog.vue'
import brand from '@/components/goodsRulesConfig/brand.vue'
import single from '@/components/goodsRulesConfig/single.vue'
import store from '@/components/goodsRulesConfig/store.vue'
// import Single from "@/components/goodsRulesConfig/single";
// import Store from "@/components/goodsRulesConfig/store";
import Brand from "@/components/goodsRulesConfig/brand";
import addRewardRulesDialog from '@/components/addRewardRulesDialog/addRewardRulesDialog.vue'
import useAutotrophicTaskStore from "@/store/modules/autotrophicTask.js";

import {ElMessage} from 'element-plus'
//初始化任务的基本信息
let taskInfo = reactive({})
let activeType = ref('single')
let dialogWidth = ref('40vw')
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const close = function () {
  brandInstanceArray.value = []
  storeInstanceArray.value = []
  singleInstanceArray.value = []
  dialogFormVisible.value = false
  baseForm.value.resetFields()
  watchInstance()
}
let responsibleUsersRule = (rule, value, callback) => {
  if (activeTaskInfo.value.responsibleUsers.length == 0) {
    callback(new Error("请选择激励活动负责人"));
  } else {
    callback();
  }
};
let participantsRule = (rule, value, callback) => {
  if (activeTaskInfo.value.participants.length == 0) {
    callback(new Error("请选择激励活动参与人"));
  } else {
    callback();
  }
};
let timeLimiteRule = (rule, value, callback) => {
  if (activeTaskInfo.value.timeLimite.length == 0) {
    callback(new Error("请选择任务时段"));
  } else {
    callback();
  }
};
//规则
const ruleForm = {
  name: [{required: true, message: "请输入活动名称", trigger: "change"}],
  rewardType: [{required: true, message: "请选择活动类型", trigger: "change"}],
  responsibleUsers: [{required: true, validator: responsibleUsersRule}],
  participants: [{required: true, validator: participantsRule}],
  comment: [{required: true, message: "请输入任务描述", trigger: "change"}],
  timeLimite: [{required: true, validator: timeLimiteRule}],
}
let baseForm = ref('')


const responsibleCallBack = function (data) {
  //执行校验
  activeTaskInfo.value.responsibleUsers = data
  baseForm.value.validateField(['responsibleUsers'])

}

const participateCallBack = function (data) {
  //执行校验
  activeTaskInfo.value.participants = data
  baseForm.value.validateField(['participants'])
}

const props = defineProps({
  //标题
  title: {
    type: String,
    required: true
  },
  //单个任务活动信息
  dataInfo: {
    type: Object,
    required: false
  }
});
let isShowLoading = ref(false)
//监听传入数据进行初始化活动数据
let watchInstance = watch(() => props.dataInfo, () => {
  isShowLoading.value = true
  innitTaskInfo(props.dataInfo)
}, {immediate: false})


let innitTaskInfo = function (data) {
  let store = useAutotrophicTaskStore()
  //查询任务详情
  store.getAutotrophicTaskDetail(data.eventId).then(res => {
    activeTaskInfo.value = {...activeTaskInfo, ...store.ActiveTaskDetail}
    activeTaskInfo.value.timeLimite = [activeTaskInfo.value.beginTime, activeTaskInfo.value.endTime]
    isShowLoading.value = false
  })

}

//上传海报
const imgBannerList = ref([])
//自定义校验选项
// const formValid = () => {
//   if (postData.value.factoryEntry === 1) {
//     let validateRules = ['activityTitle', 'activityType', 'taskTime', 'leader', 'scopes', 'imgBanner'];
//     ruleFormRef.value.validateField(validateRules)
//   } else {
//     ruleFormRef.value.validate()
//   }
// }
let uploadData = reactive({
  // url: process.env.VUE_APP_BASE_API + 'product/info/importData',
  url: '',
  // imgBannerUrl: process.env.VUE_APP_BASE_API + '/file/file/upload',
  imgBannerUrl: '',
  // imgBannerParam: {corpId: store.getters.user.user.corpId, path: '/activity/imgBanner/'},
  imgBannerParam: '',
  // token: getToken(),
  // parameter: {corpId: store.getters.user.user.corpId, file: ''}
  parameter: ''
})
//上传成功的回调
const handleImgBannerSuccess = (res) => {
  //加载状态控制
  // lodingEvent.value = true
  //成功之后清空上传文件列表
  imgBannerList.value = []
  if (res.code === 200) {
    // lodingEvent.value = false
    ElMessage({type: 'success', message: res.msg})
    //将传回的海报url进行保存
    // postData.value.imgBanner = res.data.url
    formValid()
  } else {
    ElMessage({type: 'warning', message: res.msg})
    // lodingEvent.value = false
  }
}
//一个活动的基础信息
let activeTaskInfo = ref({
  timeLimite: [],
  eventId: "",
  name: "2022活动测试",
  fullname: "string11111111",
  comment: "string",
  beginTime: "2022-08-19 06:06:01",
  endTime: "2022-08-19 06:06:01",
  state: "0",
  hasFile: false,
  syncCalendar: false,
  sendNotice: false,
  syncChatSidebar: false,
  syncCreatePoster: false,
  syncProdKnowledge: false,
  endType: "0",
  sqNo: "0",
  parentId: null,
  factoryEntry: false,
  activityJoint: false,
  scheduleId: "0",
  dismissReason: null,
  createBy: "0",
  createTime: "2022-08-19 14:35:30",
  updateBy: "0",
  updateTime: "2022-08-19 14:50:24",
  files: [],
  participants: [],
  responsibleUsers: [],
  ruleScupes: [],
  products: []
})


const step = ref(null)
//控制弹框显示
//传入参数用于数据回显
const showDialog = function () {
  dialogFormVisible.value = true
  step.value = 1
  innitTaskInfo(props.dataInfo)
}
//加减步骤操作
const cutStep = function (param) {
  if (param == 'decrease') {
    if (step.value > 1) {
      step.value--
      dialogWidth.value = "40vw"

    }
  } else {
    baseForm.value.validate((valid) => {
      if (valid) {
        if (step.value < 2) {
          step.value++
          dialogWidth.value = "90vw"

        }
      }
    })

  }
}
//活动类型选择
const selectType = function (type) {
  activeType.value = type
}

//========选择负责人
let {
  deepDialog: selectPeopleResponsibility,
  dialogShow: selectPeopleResponsibilityDialogShow
} = useSelectDialogFunction()
const showPeopleDialog = function () {
  let store = useAutotrophicTaskStore()
//  初始化树形结构数据
  store.getTreeNode({allChild: true})
  selectPeopleResponsibilityDialogShow()
}
//hooks 实现组件复用  参与人
let {deepDialog: selectPeopleParticipate, dialogShow: selectPeopleParticipateDialogShow} = useSelectDialogFunction()
const showDeepDialog = function () {
  let store = useAutotrophicTaskStore()
//  初始化树形结构数据
  store.getTreeNode({allChild: true})
  selectPeopleParticipateDialogShow()

}
//选择范围
let {Dialog: selectRange, dialogShow: selectRangeDialogShow} = useSelectionRangeFunction()
const selectRangeFunction = function () {
  selectRangeDialogShow()
}
const addRewardRulesInstance = ref()
//新增奖励规则
const addRewardRules = function () {
  addRewardRulesInstance.value.showDialog()
}
//新增参与人
let ParticipantDialogInstance = ref('')
const addParticipantDialog = function () {
  ParticipantDialogInstance.value.showDialog()
}
//保存
let singleInstanceArray = ref([])
let singleInstance = function (itemInstance) {
  if (itemInstance) {
    singleInstanceArray.value.push(itemInstance)
  }
}
let storeInstanceArray = ref([])
let storeInstance = function (itemInstance) {
  storeInstanceArray.value.push(itemInstance)
}
let brandInstanceArray = ref([])
let brandInstance = function (itemInstance) {
  brandInstanceArray.value.push(itemInstance)
}

const subMit = function () {
  // loopExecution(brandInstanceArray.value)
  // loopExecution(storeInstanceArray.value)
  loopExecution(singleInstanceArray.value)


}
onBeforeUpdate(() => {
  singleInstanceArray.value = []
  storeInstanceArray.value = []
  brandInstanceArray.value = []
})
const loopExecution = function (array) {
  array.forEach((item, index) => {
    if (item !== null) {
      item.validateForm()
    }
  })
}


//方法导出
defineExpose({
  showDialog
})
</script>

<style scoped lang="scss">


.outBox {
  display: flex;
  flex-direction: column;

  .label::v-deep( .el-form-item__label) {
    color: #606266;
    font-weight: 600;
    margin-bottom: 5px;
    justify-content: flex-start !important;
  }

  .step_two_outBox {
    .topHeader {
      display: flex;
      flex-direction: row;

      .info {
        width: 60%;
        display: flex;
        justify-content: space-between;
        height: 50px;
        line-height: 50px;

        .title {
          font-weight: 800;
          font-size: 20px;
        }
      }

      .budget {
        justify-content: flex-end;
        width: 40%;
        display: flex;
        flex-direction: row;
        text-align: center;
        height: 50px;
        line-height: 50px;
      }
    }

    .activeTypeSelect {
      display: flex;
      flex-direction: row;
      margin: 20px 0;
      justify-content: flex-end;
    }

    .content-box {
      display: flex;
      flex-direction: column;

      .content {
        //height: 250px;
        //overflow: auto;
        width: 100%;
        padding: 10px;
        border-radius: 5px;
        border: 1px dashed black;
        margin-bottom: 10px;

        .activeType {
          .select {
            padding: 10px 0;
            display: flex;
            align-items: center;

            span:nth-child(2) {
              margin-left: 50px;
            }
          }
        }

      }

    }

    .bottomFooter {
      margin-top: 10px;
    }

  }


}


</style>
