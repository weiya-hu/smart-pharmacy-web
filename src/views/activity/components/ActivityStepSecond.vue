<template>

  <div class="app-container" v-loading="secondLoading" element-loading-text="请等待...">
    <el-tabs type="border-card" v-model="tabValue" @tab-change="changeTab">
      <el-tab-pane name="first" label="单品｜组合">
        <el-form ref="firstForm" :model="firstFormModels" :rules="formRule" inline label-width="100px">
          <div class="form-div" v-for="(firstFormModel,index) in firstFormModels.formListData" :key="index">
            <div class="rulerStatus">
              <div v-if="firstFormModel.eventRuleId" class="save">已保存</div>
              <div v-if="!firstFormModel.eventRuleId&&index!==0" class="notSave">未保存</div>
            </div>
            <div class="handler">
              <div v-if="handleType!=='query'">
                <el-button type="primary" @click="delForm(index)">删除</el-button>
                <el-button type="primary" @click="saveFormAndAdd(index,'save')">保存</el-button>
                <el-button type="primary" @click="saveFormAndAdd(index,'saveAndAdd')">保存并新增</el-button>
                <el-button type="primary" @click="addForm">新增</el-button>
              </div>
            </div>
            <el-row>
              <div class="moudelTitle">奖励核算配置</div>
            </el-row>
            <el-row>
              <el-form-item class="label" label="核算方式" :prop="'formListData.' + index + '.calcType'"
                            :rules="formRule.calcType">
                <el-select :disabled="handleType=='query'" v-model="firstFormModel.calcType">
                  <el-option v-for="item in sop_calc_type" :key="item.value" :value="item.value" :label="item.label">
                    {{ item.label }}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="label" label="核算周期" :prop="'formListData.' + index + '.timeRange'"
                            :rules="formRule.timeRangeUnit">
                <el-input :disabled="handleType=='query'" type="number" v-model="firstFormModel.timeRange"
                          class="input-with-select">
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
            </el-row>
            <el-row>
              <el-form-item class="label" label="奖励条件" :prop="'formListData.' + index + '.calcUnit'"
                            :rules="formRule.calcUnit">
                <el-select :disabled="handleType=='query'" v-model="firstFormModel.calcUnit">
                  <el-option v-for="item in sop_calc_unit" :key="item.value" :value="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
              <el-form-item class="label" label="奖励方式" :prop="'formListData.' + index + '.rewardType'"
                            :rules="formRule.rewardType">
                <el-select :disabled="handleType=='query'" v-model="firstFormModel.rewardType">
                  <el-option v-for="item in sop_reward_type" :key="item.value" :value="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
            </el-row>
            <el-divider content-position="left"></el-divider>
            <el-row>
              <div class="moudelTitle">
                参与职务列表
              </div>
            </el-row>
            <el-row v-for="(item,i) in firstFormModel.jobs" :key="i">
              <el-form-item class="label" label="职务">
                <div style="width: 70px !important;fontWeight: bold;color: #606266;">
                  {{ item.jobName }}
                </div>
              </el-form-item>
              <el-form-item v-if="firstFormModel.calcUnit==1"
                            class="label" label="奖励阈值" :rules="formRule.targetRange">
                <el-input
                    :disabled="handleType=='query'"
                    type="number"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    v-model.number="item.targetRange"
                    class="input-with-select">
                  <template #append>
                    <el-select v-model="firstFormModel.calcUnit" disabled style="width: 80px">
                      <el-option v-for="item in sop_calc_unit" :key="item.value" :value="item.value"
                                 :label="item.label"/>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item v-if="firstFormModel.calcUnit==2" class="label" label="奖励阈值">
                <el-input
                    :disabled="handleType=='query'"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
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
              <el-form-item class="label" label="奖励金额">
                <el-input oninput="value=value.replace(/[^0-9.]/g,'')"
                          :disabled="handleType=='query'"
                          v-model="item.price"
                          class="input-with-select">
                </el-input>
              </el-form-item>
            </el-row>
            <el-divider content-position="left"></el-divider>
            <el-row>
              <div class="moudelTitle">参与商品</div>
            </el-row>
            <el-button v-show="firstFormModel.products.length === 0" type="primary" link
                       @click="openProductsDialog(index,firstFormModel)">添加商品
            </el-button>
            <el-button type="primary" link>已选（{{
                firstFormModel.products && firstFormModel.products.length
              }}）个
            </el-button>
            <el-button v-show="firstFormModel.products.length > 0 " type="primary"
                       @click="openProductsDialog(index,firstFormModel)">点击查看商品列表
            </el-button>

          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="second" label="品牌">
        <el-form ref="secondForm" v-model="secondFormModels" :rules="formRule" inline label-width="100px">
          <div class="form-div" v-for="(secondFormModel,index) in secondFormModels.formListData" :key="index">
            <div class="rulerStatus">
              <div v-if="secondFormModel.eventRuleId" class="save">已保存</div>
              <div v-if="!secondFormModel.eventRuleId&&index!==0" class="notSave">未保存</div>
            </div>
            <div class="handler">
              <div v-if="handleType!=='query'">
                <el-button type="primary" @click="delForm(index)">删除</el-button>
                <el-button type="primary" @click="saveFormAndAdd(index,'save')">保存</el-button>
                <el-button type="primary" @click="saveFormAndAdd(index,'saveAndAdd')">保存并新增</el-button>
                <el-button type="primary" @click="addForm">新增</el-button>
              </div>
            </div>
            <el-row>
              <div class="moudelTitle">奖励核算配置</div>
            </el-row>
            <el-row>
              <el-form-item class="label" label="核算方式" :prop="'formListData.' + index + '.calcType'"
                            :rules="formRule.calcType">
                <el-select :disabled="handleType=='query'" v-model="secondFormModel.calcType">
                  <el-option v-for="item in sop_calc_type" :key="item.value" :value="item.value" :label="item.label">
                    {{ item.label }}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="label" label="核算周期" :prop="'formListData.' + index + '.timeRange'"
                            :rules="formRule.timeRangeUnit">
                <el-input :disabled="handleType=='query'" type="number" v-model="secondFormModel.timeRange"
                          class="input-with-select">
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
            </el-row>
            <el-row>
              <el-form-item class="label" label="奖励条件" :prop="'formListData.' + index + '.calcUnit'"
                            :rules="formRule.calcUnit">
                <el-select :disabled="handleType=='query'" v-model="secondFormModel.calcUnit">
                  <el-option v-for="item in sop_calc_unit" :key="item.value" :value="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
              <el-form-item class="label" label="奖励方式" :prop="'formListData.' + index + '.rewardType'"
                            :rules="formRule.rewardType">
                <el-select :disabled="handleType=='query'" v-model="secondFormModel.rewardType">
                  <el-option v-for="item in sop_reward_type" :key="item.value" :value="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
            </el-row>
            <el-divider content-position="left"></el-divider>
            <el-row>
              <div class="moudelTitle">参与职务列表</div>
            </el-row>
            <el-row v-for="(item,index) in secondFormModel.jobs">
              <el-form-item class="label" label="职务">
                <div style="width: 70px !important;fontWeight: bold;color: #606266;">
                  {{ item.jobName }}
                </div>
              </el-form-item>
              <el-form-item v-if="secondFormModel.calcUnit==1" class="label" label="奖励阈值">
                <el-input
                    :disabled="handleType=='query'"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    v-model.number="item.targetRange"
                    class="input-with-select">
                  <template #append>
                    <el-select v-model="secondFormModel.calcUnit" disabled style="width: 80px">
                      <el-option v-for="item in sop_calc_unit" :key="item.value" :value="item.value"
                                 :label="item.label"/>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item v-if="secondFormModel.calcUnit==2" class="label" label="奖励阈值">
                <el-input
                    :disabled="handleType=='query'"
                    v-model.number="item.targetRange"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                    class="input-with-select">
                  <template #append>
                    <el-select v-model="secondFormModel.calcUnit" disabled style="width: 80px">
                      <el-option v-for="item in sop_calc_unit" :key="item.value" :value="item.value"
                                 :label="item.label"/>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item class="label" label="奖励金额">
                <el-input oninput="value=value.replace(/[^0-9.]/g,'')" :disabled="handleType=='query'"
                          v-model="item.price" class="input-with-select">
                </el-input>
              </el-form-item>
            </el-row>
            <el-divider content-position="left"></el-divider>
            <el-row>
              <div class="moudelTitle">参与品牌</div>
            </el-row>
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

          </div>

        </el-form>
      </el-tab-pane>
      <el-tab-pane name="third" label="门店">
        <el-form ref="thirdForm" v-model="thirdFormModels" :rules="formRule" inline label-width="100px">
          <div class="form-div" v-for="(thirdFormModel,index) in thirdFormModels.formListData" :key="index">
            <div class="rulerStatus">
              <div v-if="thirdFormModel.eventRuleId" class="save">已保存</div>
              <div v-if="!thirdFormModel.eventRuleId&&index!==0" class="notSave">未保存</div>
            </div>
            <div class="handler">
              <div v-if="handleType!=='query'">
                <el-button type="primary" @click="delForm(index)">删除</el-button>
                <el-button type="primary" @click="saveFormAndAdd(index,'save')">保存</el-button>
                <el-button type="primary" @click="saveFormAndAdd(index,'saveAndAdd')">保存并新增</el-button>
                <el-button type="primary" @click="addForm">新增</el-button>
              </div>
            </div>
            <el-row>
              <div class="moudelTitle">
                奖励核算配置
              </div>
            </el-row>
            <el-row>
              <el-form-item class="label" label="核算方式" :prop="'formListData.' + index + '.calcType'"
                            :rules="formRule.calcType">
                <el-select :disabled="handleType=='query'" v-model="thirdFormModel.calcType">
                  <el-option v-for="item in sop_calc_type" :key="item.value" :value="item.value" :label="item.label">
                    {{ item.label }}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="label" label="核算周期" :prop="'formListData.' + index + '.timeRange'"
                            :rules="formRule.timeRangeUnit">
                <el-input :disabled="handleType=='query'" type="number" v-model="thirdFormModel.timeRange"
                          class="input-with-select">
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
            </el-row>
            <el-row>
              <el-form-item class="label" label="奖励条件" :prop="'formListData.' + index + '.calcUnit'"
                            :rules="formRule.calcUnit">
                <el-select :disabled="handleType=='query'" v-model="thirdFormModel.calcUnit">
                  <el-option v-for="item in sop_calc_unit" :key="item.value" :value="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
              <el-form-item class="label" label="奖励方式" :prop="'formListData.' + index + '.rewardType'"
                            :rules="formRule.rewardType">
                <el-select :disabled="handleType=='query'" v-model="thirdFormModel.rewardType">
                  <el-option v-for="item in sop_reward_type" :key="item.value" :value="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
            </el-row>
            <el-divider content-position="left"></el-divider>
            <el-row>
              <div class="moudelTitle">
                参与职务列表
              </div>
            </el-row>
            <el-row v-for="(item,index) in thirdFormModel.jobs" :key="index">
              <el-form-item class="label" label="职务">
                <div style="width: 70px !important;fontWeight: bold;color: #606266;">
                  {{ item.jobName }}
                </div>
              </el-form-item>
              <el-form-item v-if="thirdFormModel.calcUnit==1" class="label" label="奖励阈值">
                <el-input
                    :disabled="handleType=='query'"
                    v-model.number="item.targetRange"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    class="input-with-select">
                  <template #append>
                    <el-select v-model="thirdFormModel.calcUnit" disabled style="width: 80px">
                      <el-option v-for="item in sop_calc_unit" :key="item.value" :value="item.value"
                                 :label="item.label"/>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item v-if="thirdFormModel.calcUnit==2" class="label" label="奖励阈值">
                <el-input
                    :disabled="handleType=='query'"
                    v-model.number="item.targetRange"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                    class="input-with-select">
                  <template #append>
                    <el-select v-model="thirdFormModel.calcUnit" disabled style="width: 80px">
                      <el-option v-for="item in sop_calc_unit" :key="item.value" :value="item.value"
                                 :label="item.label"/>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item class="label" label="奖励金额">
                <el-input oninput="value=value.replace(/[^0-9.]/g,'')" :disabled="handleType=='query'"
                          v-model="item.price" class="input-with-select">
                </el-input>
              </el-form-item>
            </el-row>

            <el-divider content-position="left"></el-divider>
            <el-row>
              <div class="moudelTitle">参与门店</div>
            </el-row>
            <el-button v-if="thirdFormModels.formListData[index].filter.ids.length==0" type="primary" link
                       @click="openStoreDialog(index)">添加门店
            </el-button>
            <el-button type="primary" link>已选（{{
                thirdFormModels.formListData[index].filter.ids.length
              }}）个
            </el-button>
            <el-button v-if="thirdFormModels.formListData[index].filter.ids.length!==0" type="primary"
                       @click="openStoreDialog(index)">点击查看门店列表
            </el-button>
          </div>

        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!-- 商品列表弹窗-->
    <el-dialog title="商品列表" v-model="showProductsDialog" width="70%">
      <SelectProducts :eventRuleId="itemRuleId" :eventId="props.eventId" :packageId="productPackageId"
                      ref="selectProductsRef"></SelectProducts>
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="handleType!=='query'" type="primary" @click="onSuccessProductsDialog(0)">单品保存</el-button>
          <el-button v-if="handleType!=='query'" type="primary" @click="onSuccessProductsDialog(1)">组合保存</el-button>
          <el-button @click="onCancelProductsDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 门店列表弹窗-->
    <el-dialog title="门店列表" v-model="showStoreDialog" width="70%">
      <SelectStore :eventId="props.eventId" ref="selectStoreRef"></SelectStore>
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="handleType!=='query'" type="primary" @click="onSuccessStoreDialog">保 存</el-button>
          <el-button @click="onCancelStoreDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  queryBrandList, queryStoreList, queryJobList,
} from "@/api/activity/activityProduct";
import {
  addEventRule,
  queryEventRule,
  publish,
  publishActivityTask,
  changeEventRule,
  deleteEventRule,
  approvalActivityTask,
  getEventInfoByid
} from '@/api/activity/eventInfo'
import SelectProducts from '@/components/SelectProducts/index'
import SelectStore from '@/components/SelectStore/index'
import {nextTick} from "vue";
import {cloneFunction} from "@/utils/globalFunction";

const {proxy} = getCurrentInstance();
const {
  sop_calc_type, sop_calc_unit, sop_event_calc_reward_type,
  sop_reward_type, sop_time_range_unit
} = proxy.useDict("sop_calc_type", 'sop_calc_unit', 'sop_event_calc_reward_type', 'sop_reward_type', 'sop_time_range_unit');
const tabValue = ref('first')
let firstForm = ref()
const jobList = ref([])
let secondLoading = ref(false)
const productPackageId = ref(NaN)
const formStoreIndex = ref(NaN)
let itemRuleId = ref(null)
const firstFormModels = ref({
      formListData: [{
        eventCalcRewardType: 1,
        calcType: 1,
        timeRange: 1,
        timeRangeUnit: 'everyday',
        rewardType: 1,
        calcUnit: 1,
        products: [],
        jobs: jobList.value,
        filter: {
          ids: [], specifications: [], brands: [], productTypes: []
        }
      }]
    }
)
const resetFirstForm = () => {
  return {
    eventCalcRewardType: 1,
    calcType: 1,
    timeRange: 1,
    timeRangeUnit: 'everyday',
    rewardType: 1,
    calcUnit: 1,
    products: [],
    jobs: cloneFunction(jobList.value),
    filter: {
      ids: [], specifications: [], brands: [], productTypes: []
    }
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
    eventCalcRewardType: 3,
    calcType: 1,
    timeRange: 1,
    timeRangeUnit: 'everyday',
    rewardType: 1,
    calcUnit: 1,
    jobs: cloneFunction(jobList.value),
    filter: {
      ids: [], specifications: [], brands: [], productTypes: []
    }
  }]
})

const resetSecondForm = () => {
  return {
    brandsCheckAll: false,
    isIndeterminate: false,
    eventCalcRewardType: 3,
    calcType: 1,
    timeRange: 1,
    timeRangeUnit: 'everyday',
    rewardType: 1,
    calcUnit: 1,
    jobs: cloneFunction(jobList.value),
    filter: {
      ids: [], specifications: [], brands: [], productTypes: []
    }
  }
}

const thirdForm = ref()

const thirdFormModels = ref({
  formListData: [{
    eventCalcRewardType: 2,
    calcType: 1,
    timeRange: 1,
    timeRangeUnit: 'everyday',
    rewardType: 1,
    calcUnit: 1,
    jobs: jobList.value,
    filter: {
      ids: [], specifications: [], brands: [], productTypes: []
    }
  }]
})
const resetThirdForm = () => {
  return {
    eventCalcRewardType: 2,
    calcType: 1,
    timeRange: 1,
    timeRangeUnit: 'everyday',
    rewardType: 1,
    calcUnit: 1,
    jobs: jobList.value,
    filter: {
      ids: [], specifications: [], brands: [], productTypes: []
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
  if (props.handleType === 'query') return
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
const openProductsDialog = (index, row) => {
  if (row.eventRuleId) {
    itemRuleId.value = row.eventRuleId
  } else {
    itemRuleId.value = null
  }
  productPackageId.value = index
  showProductsDialog.value = true
}

const openStoreDialog = (index) => {
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
const delForm = async (index) => {
  switch (tabValue.value) {
    case 'first' :
      if (firstFormModels.value.formListData.length > 0) {
        if (firstFormModels.value.formListData[index].eventRuleId) {
          let {data: {canEdit}} = await getEventInfoByid(firstFormModels.value.formListData[index].eventId)
          // 存在规则id将规则进行删除
          if (canEdit) {
            await deleteEventRule(firstFormModels.value.formListData[index].eventRuleId).then(res => {
              if (res.code == 200) {
                proxy.$modal.msgSuccess("删除成功");
                getActivityRules()
                if (firstFormModels.value.formListData.length == 0) {
                  firstFormModels.value.formListData.push(resetFirstForm())
                }
              }
            })
          } else {
            proxy.$modal.msgError("任务规则不允许被删除");
          }
        } else {
          firstFormModels.value.formListData.splice(index, 1)
        }
        break;
      }
    case
    'second'
    :
      if (secondFormModels.value.formListData.length > 0) {
        // 存在规则id将规则进行删除
        if (secondFormModels.value.formListData[index].eventRuleId) {
          let {data: {canEdit}} = await getEventInfoByid(secondFormModels.value.formListData[index].eventId)
          if (canEdit) {
            await deleteEventRule(secondFormModels.value.formListData[index].eventRuleId).then(res => {
              if (res.code == 200) {
                proxy.$modal.msgSuccess("删除成功");
                getActivityRules()
                if (secondFormModels.value.formListData.length == 0) {
                  secondFormModels.value.formListData.push(resetSecondForm())
                }
              }
            })

          } else {
            proxy.$modal.msgError("任务规则不允许被删除");
          }
        } else {
          secondFormModels.value.formListData.splice(index, 1)
        }
      }
      break;
    case
    'third'
    :
      if (thirdFormModels.value.formListData.length > 0) {
        // 存在规则id将规则进行删除
        if (thirdFormModels.value.formListData[index].eventRuleId) {
          let {data: {canEdit}} = await getEventInfoByid(thirdFormModels.value.formListData[index].eventId)
          if (canEdit) {
            await deleteEventRule(thirdFormModels.value.formListData[index].eventRuleId).then(res => {
              if (res.code == 200) {
                proxy.$modal.msgSuccess("删除成功");
                getActivityRules()
                if (thirdFormModels.value.formListData.length == 0) {
                  thirdFormModels.value.formListData.push(resetThirdForm())
                }
              }
            })
          } else {
            proxy.$modal.msgError("任务规则不允许被删除");
          }
        } else {
          thirdFormModels.value.formListData.splice(index, 1)
        }
      }
      break;
  }
}
//保存并新增规则
const saveFormAndAdd = async (index, type) => {
  switch (tabValue.value) {
    case 'first' :
      let v = await firstForm.value.validate()
      if (v) {
        firstFormModels.value.formListData[index].eventId = props.eventId
        if (!firstFormModels.value.formListData[index].eventRuleId) {
          openLoading()
          addEventRule(firstFormModels.value.formListData[index])
              .then(res => {
                if (res.code === 200) {
                  proxy.$modal.msgSuccess("新增规则成功");
                  getActivityRules().then(res => {
                    if (type === 'saveAndAdd') {
                      firstFormModels.value.formListData.push(resetFirstForm())
                    }
                  })
                }
                closeLoading()
              }).catch(e=>closeLoading())
        } else {
          openLoading()
          changeEventRule(firstFormModels.value.formListData[index])
              .then(res => {
                if (res.code === 200) {
                  proxy.$modal.msgSuccess("修改规则成功");
                  if (type === 'saveAndAdd') {
                    firstFormModels.value.formListData.push(resetFirstForm())
                  }
                }
                closeLoading()
              }).catch(e=>closeLoading())
        }
      }
      break;
    case 'second' :
      let v1 = await firstForm.value.validate()
      if (v1) {
        secondFormModels.value.formListData[index].eventId = props.eventId
        if (!secondFormModels.value.formListData[index].eventRuleId) {
          openLoading()
          addEventRule(secondFormModels.value.formListData[index])
              .then(res => {
                if (res.code === 200) {
                  proxy.$modal.msgSuccess("新增规则成功");
                  getActivityRules().then(res => {
                    if (type === 'saveAndAdd') {
                      secondFormModels.value.formListData.push(resetSecondForm())
                    }
                  })
                }
                closeLoading()
              }).catch(e=>closeLoading())
        } else {
          openLoading()
          changeEventRule(secondFormModels.value.formListData[index])
              .then(res => {
                if (res.code === 200) {
                  proxy.$modal.msgSuccess("修改规则成功");
                  if (type === 'saveAndAdd') {
                    secondFormModels.value.formListData.push(resetSecondForm())
                  }
                }
                closeLoading()
              }).catch(e=>closeLoading())
        }
      }
      break;
    case 'third' :
      let v2 = await firstForm.value.validate()
      if (v2) {
        thirdFormModels.value.formListData[index].eventId = props.eventId
        if (!thirdFormModels.value.formListData[index].eventRuleId) {
          openLoading()
          addEventRule(thirdFormModels.value.formListData[index])
              .then(res => {
                if (res.code === 200) {
                  proxy.$modal.msgSuccess("新增规则成功");
                  getActivityRules().then(res => {
                    if (type === 'saveAndAdd') {
                      thirdFormModels.value.formListData.push(resetThirdForm())
                    }
                  })
                }
                closeLoading()
              }).catch(e=>closeLoading())
        } else {
          openLoading()
          changeEventRule(thirdFormModels.value.formListData[index])
              .then(res => {
                if (res.code === 200) {
                  proxy.$modal.msgSuccess("修改规则成功");
                  if (type === 'saveAndAdd') {
                    thirdFormModels.value.formListData.push(resetThirdForm())
                  }
                }
                closeLoading()
              }).catch(e=>closeLoading())
        }
      }
      break;
  }
}
//获取任务下的规则
const getActivityRules = () => {
  // openLoading()
  return queryEventRule({eventId: props.eventId})
      .then(res => {
        if (res.code === 200) {
          firstFormModels.value.formListData = []
          secondFormModels.value.formListData = []
          thirdFormModels.value.formListData = []
          res.data.list.forEach(item => {
            if (item.eventCalcRewardType === 1) {
              firstFormModels.value.formListData.push(item)
            } else if (item.eventCalcRewardType === 3) {
              secondFormModels.value.formListData.push(item)
            } else if (item.eventCalcRewardType === 2) {
              thirdFormModels.value.formListData.push(item)
            }
          })
          if (firstFormModels.value.formListData.length === 0) {
            firstFormModels.value.formListData.push(resetFirstForm())
          }
          if (secondFormModels.value.formListData.length === 0) {
            secondFormModels.value.formListData.push(resetSecondForm())
          }
          if (thirdFormModels.value.formListData.length === 0) {
            thirdFormModels.value.formListData.push(resetThirdForm())
          }
        }
        // closeLoading()
      })


}


//门店弹出确定
const onSuccessStoreDialog = () => {
  showStoreDialog.value = false
  thirdFormModels.value.formListData[formStoreIndex.value].filter.ids = selectStoreRef.value.getStoreResultList()
}
//门店弹窗关闭
const onCancelStoreDialog = () => {
  showStoreDialog.value = false
}

const props = defineProps({
  eventId: {
    type: String,
    default: undefined
  },
  handleType: {
    type: String,
    default: undefined
  }
})
//添加loading
const openLoading = () => {
  secondLoading.value = true
}
//移除loading
const closeLoading = () => {
  secondLoading.value = false
}

//加载任务规则
const loadEventRule = () => {
  if (props.handleType === 'query') {
    secondLoading.value = true
    queryEventRule({eventId: props.eventId})
        .then(res => {
          if (res.code === 200) {
            firstFormModels.value.formListData = []
            secondFormModels.value.formListData = []
            thirdFormModels.value.formListData = []
            res.data.list.forEach(item => {
              if (item.eventCalcRewardType === 1) {
                firstFormModels.value.formListData.push(item)
              } else if (item.eventCalcRewardType === 3) {
                secondFormModels.value.formListData.push(item)
              } else if (item.eventCalcRewardType === 2) {
                thirdFormModels.value.formListData.push(item)
              }
            })
            console.log('thirdFormModels.value', thirdFormModels.value)
            secondLoading.value = false
            return Promise.resolve(true)
          }
        })
  } else {
    openLoading()
    queryEventRule({eventId: props.eventId})
        .then(res => {
          if (res.code === 200) {
            firstFormModels.value.formListData = []
            secondFormModels.value.formListData = []
            thirdFormModels.value.formListData = []
            res.data.list.forEach(item => {
              if (item.eventCalcRewardType === 1) {
                firstFormModels.value.formListData.push(item)
              } else if (item.eventCalcRewardType === 3) {
                secondFormModels.value.formListData.push(item)
              } else if (item.eventCalcRewardType === 2) {
                thirdFormModels.value.formListData.push(item)
              }
            })
            if (firstFormModels.value.formListData.length === 0) {
              firstFormModels.value.formListData.push(resetFirstForm())
            }
            if (secondFormModels.value.formListData.length === 0) {
              secondFormModels.value.formListData.push(resetSecondForm())
            }
            if (thirdFormModels.value.formListData.length === 0) {
              thirdFormModels.value.formListData.push(resetThirdForm())
            }
          }
          closeLoading()
          return Promise.resolve(true)
        })
  }
}
//校验输入框当中的内容是否正确
const verifyForm = () => {
  firstForm.value.validate(async (valid) => {
    if (valid) {
      alert("校验成功")
    } else {
      alert("校验失败")
    }
  })
}


const publishActivity = () => {
  return approvalActivityTask(props.eventId)
  // return publish(props.eventId)
}
defineExpose({
  loadEventRule,
  getJobList,
  publishActivity,
  openLoading,
  closeLoading
})

</script>

<style scoped lang="scss">
.label::v-deep( .el-form-item__label) {
  color: #606266;
  font-weight: 600;
  justify-content: flex-start !important;
  text-align: left;
}

.form-div {
  border: 1px solid #D4D7DE;
  margin: 5px;
  padding: 20px;
}

.moudelTitle {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
}

.rulerStatus {
  width: 60px;

  .save {
    padding: 5px;
    width: 100%;
    height: 100%;
    background-color: #8acf6a;
    color: #fff;
    border-radius: 10px 0 0 0;
  }

  .notSave {
    padding: 5px;
    width: 100%;
    height: 100%;
    background-color: #ff806c;
    color: #fff;
    border-radius: 10px 0 0 0;
  }
}

.handler {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
}
</style>
