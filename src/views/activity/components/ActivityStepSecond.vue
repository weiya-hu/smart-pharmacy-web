<template>
  <div class="app-container">
    <el-tabs type="border-card" v-model="tabValue" @tab-change="changeTab">
      <el-tab-pane name="first" label="单品｜组合">
        <el-form ref="firstForm" :model="firstFormModels" :rules="formRule" inline label-width="100px">
          <div class="form-div" v-for="(firstFormModel,index) in firstFormModels.formListData" :key="index">
            <el-row>
              <el-form-item label="核算方式" :prop="'formListData.' + index + '.calcType'"
                            :rules="formRule.calcType">
                <el-select v-model="firstFormModel.calcType">
                  <el-option v-for="item in sop_calc_type" :key="item.value" :value="item.value" :label="item.label">
                    {{ item.label }}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="核算周期" :prop="'formListData.' + index + '.timeRange'"
                            :rules="formRule.timeRangeUnit">
                <el-input type="number" v-model="firstFormModel.timeRange" class="input-with-select">
                  <template #append>
                    <el-select v-model="firstFormModel.timeRangeUnit">
                      <el-option v-for="item in sop_time_range_unit" :key="item.value" :value="item.value"
                                 :label="item.label">
                        {{ item.label }}
                      </el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="奖励条件" :prop="'formListData.' + index + '.calcUnit'"
                            :rules="formRule.calcUnit">
                <el-select v-model="firstFormModel.calcUnit">
                  <el-option v-for="item in sop_calc_unit" :key="item.value" :value="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
              <el-form-item label="奖励方式" :prop="'formListData.' + index + '.rewardType'"
                            :rules="formRule.rewardType">
                <el-select v-model="firstFormModel.rewardType">
                  <el-option v-for="item in sop_reward_type" :key="item.value" :value="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
            </el-row>
            <el-divider content-position="left">参与职务列表</el-divider>
            <el-row v-for="(item,index) in firstFormModel.jobs">
              <el-form-item label="职务">
                {{ item.jobName }}
              </el-form-item>
              <el-form-item label="奖励阈值">
                <el-input
                    v-model="item.targetRange"
                    class="input-with-select">
                  <template #append>
                    <el-select v-model="firstFormModel.calcUnit" disabled style="width: 80px">
                      <el-option v-for="item in sop_calc_unit" :key="item.value" :value="item.value"
                                 :label="item.label"/>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="奖励金额">
                <el-input v-model="item.price" class="input-with-select">
                </el-input>
              </el-form-item>
            </el-row>
            <el-button type="primary" link @click="openProductsDialog(index)">产品列表</el-button>
            <el-button type="primary" link @click="delForm(index)">删除</el-button>
            <el-button type="primary" link @click="saveFormAndAdd(index)">保存并新增</el-button>
            <el-button type="primary" link @click="addForm">新增</el-button>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="second" label="品牌">
        <el-form ref="secondForm" v-model="secondFormModels" :rules="formRule" inline label-width="100px">
          <div class="form-div" v-for="(secondFormModel,index) in secondFormModels.formListData" :key="index">
            <el-row>
              <el-form-item label="核算方式" :prop="'formListData.' + index + '.calcType'"
                            :rules="formRule.calcType">
                <el-select v-model="secondFormModel.calcType">
                  <el-option v-for="item in sop_calc_type" :key="item.value" :value="item.value" :label="item.label">
                    {{ item.label }}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="核算周期" :prop="'formListData.' + index + '.timeRange'"
                            :rules="formRule.timeRangeUnit">
                <el-input type="number" v-model="secondFormModel.timeRange" class="input-with-select">
                  <template #append>
                    <el-select v-model="secondFormModel.timeRangeUnit">
                      <el-option v-for="item in sop_time_range_unit" :key="item.value" :value="item.value"
                                 :label="item.label">
                        {{ item.label }}
                      </el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="奖励条件" :prop="'formListData.' + index + '.calcUnit'"
                            :rules="formRule.calcUnit">
                <el-select v-model="secondFormModel.calcUnit">
                  <el-option v-for="item in sop_calc_unit" :key="item.value" :value="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
              <el-form-item label="奖励方式" :prop="'formListData.' + index + '.rewardType'"
                            :rules="formRule.rewardType">
                <el-select v-model="secondFormModel.rewardType">
                  <el-option v-for="item in sop_reward_type" :key="item.value" :value="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
            </el-row>
            <el-divider content-position="left">参与职务列表</el-divider>
            <el-row v-for="(item,index) in secondFormModel.jobs">
              <el-form-item label="职务">
                {{ item.jobName }}
              </el-form-item>
              <el-form-item label="奖励阈值">
                <el-input
                    v-model="item.targetRange"
                    class="input-with-select">
                  <template #append>
                    <el-select v-model="secondFormModel.calcUnit" disabled style="width: 80px">
                      <el-option v-for="item in sop_calc_unit" :key="item.value" :value="item.value"
                                 :label="item.label"/>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="奖励金额">
                <el-input v-model="item.price" class="input-with-select">
                </el-input>
              </el-form-item>
            </el-row>
            <el-divider content-position="left">品牌</el-divider>
            <el-checkbox v-model="secondFormModel.brandsCheckAll" :indeterminate="secondFormModel.isIndeterminate"
                         @change="handleCheckAllChange($event,secondFormModel)"
            >全选
            </el-checkbox>
            <el-checkbox-group v-model="secondFormModel.filter.brands"
                               @change="handleCheckedBrandChange($event,secondFormModel)">
              <el-checkbox v-for="brand in brands" :key="brand" :label="brand">
                {{ brand }}
              </el-checkbox>
            </el-checkbox-group>
            <el-button type="primary" link @click="delForm(index)">删除</el-button>
            <el-button type="primary" link @click="saveFormAndAdd(index)">保存并新增</el-button>
            <el-button type="primary" link @click="addForm">新增</el-button>
          </div>

        </el-form>
      </el-tab-pane>
      <el-tab-pane name="third" label="门店">
        <el-form ref="thirdForm" v-model="thirdFormModels" :rules="formRule" inline label-width="100px">
          <div class="form-div" v-for="(thirdFormModel,index) in thirdFormModels.formListData" :key="index">
            <el-row>
              <el-form-item label="核算方式" :prop="'formListData.' + index + '.calcType'"
                            :rules="formRule.calcType">
                <el-select v-model="thirdFormModel.calcType">
                  <el-option v-for="item in sop_calc_type" :key="item.value" :value="item.value" :label="item.label">
                    {{ item.label }}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="核算周期" :prop="'formListData.' + index + '.timeRange'"
                            :rules="formRule.timeRangeUnit">
                <el-input type="number" v-model="thirdFormModel.timeRange" class="input-with-select">
                  <template #append>
                    <el-select v-model="thirdFormModel.timeRangeUnit">
                      <el-option v-for="item in sop_time_range_unit" :key="item.value" :value="item.value"
                                 :label="item.label">
                        {{ item.label }}
                      </el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="奖励条件" :prop="'formListData.' + index + '.calcUnit'"
                            :rules="formRule.calcUnit">
                <el-select v-model="thirdFormModel.calcUnit">
                  <el-option v-for="item in sop_calc_unit" :key="item.value" :value="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
              <el-form-item label="奖励方式" :prop="'formListData.' + index + '.rewardType'"
                            :rules="formRule.rewardType">
                <el-select v-model="thirdFormModel.rewardType">
                  <el-option v-for="item in sop_reward_type" :key="item.value" :value="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
            </el-row>
            <el-divider content-position="left">参与职务列表</el-divider>
            <el-row v-for="(item,index) in thirdFormModel.jobs">
              <el-form-item label="职务">
                {{ item.jobName }}
              </el-form-item>
              <el-form-item label="奖励阈值">
                <el-input
                    v-model="item.targetRange"
                    class="input-with-select">
                  <template #append>
                    <el-select v-model="thirdFormModel.calcUnit" disabled style="width: 80px">
                      <el-option v-for="item in sop_calc_unit" :key="item.value" :value="item.value"
                                 :label="item.label"/>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="奖励金额">
                <el-input v-model="item.price" class="input-with-select">
                </el-input>
              </el-form-item>
            </el-row>
            <el-button type="primary" link @click="openStoreDialog(index)">门店列表</el-button>
            <el-button type="primary" link @click="delForm(index)">删除</el-button>
            <el-button type="primary" link @click="saveFormAndAdd(index)">保存并新增</el-button>
            <el-button type="primary" link @click="addForm">新增</el-button>
          </div>

        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!-- 商品列表弹窗-->
    <el-dialog title="商品列表" v-model="showProductsDialog" width="70%">
      <SelectProducts :eventId="props.eventId" :packageId="productPackageId" ref="selectProductsRef"></SelectProducts>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onSuccessProductsDialog(0)">单品保存</el-button>
          <el-button type="primary" @click="onSuccessProductsDialog(1)">组合保存</el-button>
          <el-button @click="onCancelProductsDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 门店列表弹窗-->
    <el-dialog title="门店列表" v-model="showStoreDialog" width="70%">
      <SelectStore :eventId="props.eventId" ref="selectStoreRef"></SelectStore>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onSuccessStoreDialog">保 存</el-button>
          <el-button @click="onCancelStoreDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  queryBrandList, queryStoreList, queryJobList
} from "@/api/activity/activityProduct";
import {addEventRule} from '@/api/activity/eventInfo'
import SelectProducts from '@/components/SelectProducts/index'
import SelectStore from '@/components/SelectStore/index'

const {proxy} = getCurrentInstance();
const {
  sop_calc_type, sop_calc_unit, sop_event_calc_reward_type,
  sop_reward_type, sop_time_range_unit
} = proxy.useDict("sop_calc_type", 'sop_calc_unit', 'sop_event_calc_reward_type', 'sop_reward_type', 'sop_time_range_unit');

const tabValue = ref('first')

const firstForm = ref()
const jobList = ref([])

const productPackageId = ref(NaN)
const formStoreIndex = ref(NaN)
const firstFormModels = ref({
      formListData: [{
        eventCalcRewardType: 1,
        calcType: 1,
        timeRange: 1,
        timeRangeUnit: 'everyday',
        rewardType: 1,
        calcUnit: 1,
        jobs: [
          {
            targetRange: 0,
            price: 0,
            jobId: '',
            jobName: '',
          }
        ]
      }]
    }
)
const resetFirstForm = () => {
  return {
    eventCalcRewardType: 1,
    calcType: 1,
    timeRange: 1,
    timeRangeUnit: 'everyday',
    calcUnit: 1,
    rewardType: 1,
    jobs:jobList.value,
  }
}

const formRule = {
  calcType: [{required: true, message: "请选择奖励结算方式", trigger: "change"}],
  timeRange: [{required: true, message: "请选择核算周期", trigger: "blur"}],
  calcUnit: [{required: true, message: "请选择奖励条件", trigger: "change"}],
  rewardType: [{required: true, message: "请选择奖励方式", trigger: "change"}],
}

const secondForm = ref()

const secondFormModels = ref({
  formListData: [{
    brandsCheckAll: false,
    isIndeterminate: false,
    eventCalcRewardType: 1,
    calcType: 1,
    timeRange: 1,
    timeRangeUnit: 'everyday',
    rewardType: 1,
    calcUnit: 1,
    jobs: [
      {
        targetRange: 0,
        price: 0,
        jobId: '',
        jobName: '',
      }
    ],
    filter: {
      brands: []
    }
  }]
})

const resetSecondForm = () => {
  return {
    brandsCheckAll: false,
    isIndeterminate: false,
    eventCalcRewardType: 1,
    calcType: 1,
    timeRange: 1,
    timeRangeUnit: 'everyday',
    rewardType: 1,
    calcUnit: 1,
    jobs:jobList.value,
    filter: {
      brands: []
    }
  }
}

const thirdForm = ref()

const thirdFormModels = ref({
  formListData: [{
    eventCalcRewardType: 1,
    calcType: 1,
    timeRange: 1,
    timeRangeUnit: 'everyday',
    rewardType: 1,
    calcUnit: 1,
    jobs:jobList.value,
    filter: {
      storeIds: []
    }
  }]
})
const resetThirdForm = () => {
  return {
    eventCalcRewardType: 1,
    calcType: 1,
    timeRange: 1,
    timeRangeUnit: 'everyday',
    rewardType: 1,
    calcUnit: 1,
    jobs:jobList.value,
    filter: {
      storeIds: []
    }
  }

}

const showProductsDialog = ref(false)
const selectProductsRef = ref()

const selectStoreRef = ref()
const showStoreDialog = ref()

/** 单品 组合**/

/** 单品 组合**/


/** 品牌 **/
const brands = ref([])

//品牌全选
const handleCheckAllChange = (val, secondFormModel) => {
  secondFormModel.filter.brands = val ? brands.value : []
  secondFormModel.isIndeterminate = false
}
//品牌选择
const handleCheckedBrandChange = (value, secondFormModel) => {
  const checkedCount = value.length
  secondFormModel.brandsCheckAll = checkedCount === brands.value.length
  secondFormModel.isIndeterminate = checkedCount > 0 && checkedCount < brands.value.length
}
//查询品牌列表
const getBrandList = () => {
  queryBrandList(props.eventId)
      .then(res => {
        if (res.code === 200) {
          brands.value = res.data.brands
        }
      })
}

//查询职务列表
const getJobList = () => {
  queryJobList(props.eventId)
      .then(res => {
        if (res.code === 200) {
          jobList.value = res.data.list.map(job => ({...job, targetRange: 0, price: 0}))
          firstFormModels.value.formListData.forEach(item => {
            item.jobs = res.data.list.map(job => ({...job, targetRange: 0, price: 0}))
          })
          secondFormModels.value.formListData.forEach(item => {
            item.jobs = res.data.list.map(job => ({...job, targetRange: 0, price: 0}))
          })
          thirdFormModels.value.formListData.forEach(item => {
            item.jobs = res.data.list.map(job => ({...job, targetRange: 0, price: 0}))
          })
        }
      })
}

/** 品牌 **/

/**
 * 打开产品列表
 * @param index 当前规则序号
 */
const openProductsDialog = (index) => {
  productPackageId.value = index
  showProductsDialog.value = true
}

const openStoreDialog = (index)=>{
  showStoreDialog.value = true
  formStoreIndex.value = index
}
const onSuccessProductsDialog = (e) => {
  showProductsDialog.value = false
  if (e === 0) {
    firstFormModels.value.formListData[productPackageId.value].products = selectProductsRef.value.getProductResultList()
  } else {
    firstFormModels.value.formListData[productPackageId.value].products = selectProductsRef.value.getProductPackageResultList()
  }

}
const onCancelProductsDialog = () => {
  showProductsDialog.value = false
}

//Tab 选择事件
const changeTab = (e) => {
  switch (e) {
    case 'first' :
      break;
    case 'second' :
      getBrandList()
      break;
    case 'third' :
      break;
  }
}

//添加规则
const addForm = () => {
  switch (tabValue.value) {
    case 'first' :
      firstFormModels.value.formListData.push(resetFirstForm())
      break;
    case 'second' :
      secondFormModels.value.formListData.push(resetSecondForm())
      break;
    case 'third' :
      thirdFormModels.value.formListData.push(resetThirdForm())
      break;
  }
}
//删除规则
const delForm = (index) => {

  switch (tabValue.value) {
    case 'first' :
      if (firstFormModels.value.formListData.length > 1) {
        firstFormModels.value.formListData.splice(index, 1)
      }
      break;
    case 'second' :
      if (secondFormModels.value.formListData.length > 1) {
        secondFormModels.value.formListData.splice(index, 1)
      }
      break;
    case 'third' :
      if (thirdFormModels.value.formListData.length > 1) {
        thirdFormModels.value.formListData.splice(index, 1)
      }
      break;
  }
}
//保存并新增规则
const saveFormAndAdd = async (index) => {
  switch (tabValue.value) {
    case 'first' :
      let v = await firstForm.value.validate()
      if (v) {
        firstFormModels.value.formListData[index].eventId = props.eventId
        addEventRule(firstFormModels.value.formListData[index])
            .then(res => {
              proxy.$modal.msgSuccess("保存成功");
            })
        firstFormModels.value.formListData.push(resetFirstForm())
      }
      break;
    case 'second' :
      let v1 = await firstForm.value.validate()
      if (v1) {
        secondFormModels.value.formListData[index].eventId = props.eventId
        addEventRule(secondFormModels.value.formListData[index])
            .then(res => {
              proxy.$modal.msgSuccess("保存成功");
            })
        secondFormModels.value.formListData.push(resetSecondForm())
      }
      break;
    case 'third' :
      let v2 = await firstForm.value.validate()
      if (v2) {
        thirdFormModels.value.formListData[index].eventId = props.eventId
        addEventRule(thirdFormModels.value.formListData[index])
            .then(res => {
              proxy.$modal.msgSuccess("保存成功");
            })
        thirdFormModels.value.formListData.push(resetThirdForm())
      }
      break;
  }
}
//门店弹出确定
const onSuccessStoreDialog = () => {
  showStoreDialog.value = false
  thirdFormModels.value.formListData[formStoreIndex.value].filter.storeIds = selectStoreRef.value.getStoreResultList()
}
//门店弹窗关闭
const onCancelStoreDialog = () => {
  showStoreDialog.value = false
}

const props = defineProps({
  eventId: {
    type: String,
    default: undefined
  }
})
defineExpose({})
getJobList()

</script>

<style scoped>
.form-div {
  border: 1px solid #D4D7DE;
  margin: 5px;
  padding: 20px;
}
</style>
