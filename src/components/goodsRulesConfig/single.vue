<template>
  <div>
    <div class="tableList">
      <selectDialog ref="deepDialog"></selectDialog>
      <addRewardRulesDialog ref="addRewardRulesInstance"></addRewardRulesDialog>
      <synchronousInfoDialog v-if="synchronousIsShow" @cancelSynchronousInfo="cancelSynchronousInfo"
                             @synchronousCallBackInfo="synchronousCallBackInfo"
                             :dataList="rewardDataList.tableData"
                             ref="synchronousInfoInstance"></synchronousInfoDialog>
      <div class="addGoods">
        <el-button v-if="isExpend" @click="closeAllExpend" type="primary">关闭所有</el-button>
        <el-button @click="addRewardRules" type="primary">新增商品</el-button>
      </div>
      <el-form ref="formTableRefOut" :rules="rulesTable" :model="rewardDataList">
        <vxe-table
            height="480px"
            style="width: 100%"
            :row-config="{height: 60}"
            :column-config="{resizable: true}"
            :data="rewardDataList.tableData"
            ref="xTable"
            class="mytable-scrollbar"
        >
          <vxe-column title="活动商品" field="productName" show-overflow type="expand">
            <!--    需要下拉展开，展示单个商品或者组合商品的信息        -->
            <template #default="{ row }">
              <span>{{ row.productName }}</span>
            </template>
            <template #content="{ row, rowIndex }">
              <div class="contentBox">
                <div class="goodsInfo">
                  <div>
                    <h1>活动商品信息</h1>
                  </div>
                  <div class="goodsItems">
                    <div class="goodsItem">
                      <div>商品id：150001111</div>
                      <div>商品名称：医用酒精棉</div>
                      <div>商品规格：箱</div>
                      <div>商品价格：200元</div>
                    </div>
                    <div class="goodsItem">
                      <div>商品id：150001111</div>
                      <div>商品名称：医用酒精棉</div>
                      <div>商品规格：箱</div>
                      <div>商品价格：200元</div>
                    </div>
                  </div>
                </div>
                <div class="goodsRules">
                  <el-form class="innerForm" :ref="InnerFormInstance" :rules="rulesTable" :model="row">
                    <vxe-table
                        class="mytable-scrollbar"
                        v-if="row.role.length!==0"
                        :show-header="true"
                        style="width: 100%"
                        :row-config="{height: 60}"
                        :column-config="{resizable: true}"
                        :data="row.role"
                    >
                      <vxe-column title="奖励角色" field="roleName" show-overflow>

                      </vxe-column>
                      <vxe-column title="条件总数" show-overflow>
                        <template #default="scope">
                          <el-form-item style="paddingTop:8px"
                                        :prop=" 'role.' + scope.$rowIndex + '.count' "
                                        :rules="rulesTable.count">
                            <el-input size="small" type="text" v-model="scope.row.count"
                                      placeholder="请输入" clearable/>
                          </el-form-item>
                        </template>
                      </vxe-column>
                      <vxe-column title="条件类型" field="roleName" show-overflow>
                        <template #default="scope">
                          <el-form-item style="paddingTop:8px"
                                        :prop=" 'role.' + scope.$rowIndex + '.rewardConditions' "
                                        :rules="rulesTable.rewardConditions">
                            <el-select v-model="scope.row.rewardConditions" size="small" placeholder="请选择"
                                       clearable>
                              <el-option
                                  v-for="item in salesType"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                              />
                            </el-select>
                          </el-form-item>
                        </template>
                      </vxe-column>

                      <!--====-->
                      <vxe-column title="奖励分配类型" field="roleName" show-overflow>
                        <template #default="scope">
                          <el-form-item style="paddingTop:8px"
                                        :prop=" 'role.' + scope.$rowIndex + '.percentageType' "
                                        :rules="rulesTable.percentageType">
                            <el-select v-model="scope.row.percentageType" size="small" placeholder="请选择"
                                       clearable>
                              <el-option
                                  v-for="item in rewardsDistribution"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                              />
                            </el-select>
                          </el-form-item>
                        </template>
                      </vxe-column>

                      <vxe-column title="奖励占比" field="roleName" show-overflow>
                        <template #default="scope">
                          <el-form-item style="paddingTop:8px"
                                        :prop=" 'role.' + scope.$rowIndex + '.rewardPercentage' "
                                        :rules="rulesTable.rewardPercentage">
                            <el-input size="small" type="text" v-model="scope.row.rewardPercentage"
                                      placeholder="请输入" clearable/>
                          </el-form-item>
                        </template>
                      </vxe-column>
                      <vxe-column title="预估奖金" field="estimatedBonus" show-overflow width="10%">
                        <template #default="scope">
                          20000元
                        </template>
                      </vxe-column>
                      <vxe-column title="操作" show-overflow width="10%">
                        <template #default="scope">
                          <el-button @click="deletePeopelList(scope.row,row)" link type="primary">删除</el-button>
                        </template>
                      </vxe-column>
                    </vxe-table>
                  </el-form>
                </div>
              </div>
            </template>

          </vxe-column>
          <vxe-column field="rewardType" :filters="filterRewardType" title="奖励结算方式" show-overflow>
            <template v-slot="scope">
              <el-form-item style="paddingTop:8px" :prop=" 'tableData.' + scope.$rowIndex + '.rewardType' "
                            :rules="rulesTable.rewardType">
                <el-select v-model="scope.row.rewardType" size="small" placeholder="请选择" clearable>
                  <el-option
                      v-for="item in rewardTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </template>
          </vxe-column>
          <vxe-column field="rewardCycle" :filters="filterRewardCycle" title="核算周期" show-overflow>
            <template #default="scope">
              <el-form-item style="paddingTop:8px" :prop=" 'tableData.' + scope.$rowIndex + '.rewardCycle' "
                            :rules="rulesTable.rewardCycle">
                <el-select v-model="scope.row.rewardCycle" size="small" placeholder="请选择"
                           clearable>
                  <el-option
                      v-for="item in rewardCycleList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </template>
          </vxe-column>
          <vxe-column title="奖励对象" show-overflow field="roles">
            <!--   默认展示奖励对象的人物，下拉展开配置每个奖励对象对应的奖励规则，         -->
            <template #default="scope">
              <el-form-item style="paddingTop:8px" :prop=" 'tableData.' + scope.$rowIndex + '.roles' "
                            :rules="rulesTable.roles">
                <el-select
                    size="small"
                    @change="changeRewardsPeople(scope.row)"
                    v-model="scope.row.roles"
                    multiple
                    placeholder="请选择"
                    collapse-tags
                >
                  <el-option
                      v-for="item in rewardsPlayers"
                      :key="item.value"
                      :label="item.roleName"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </template>
          </vxe-column>
          <vxe-column title="预估总奖金" field="estimatedBonus" show-overflow>
            <template #default="scope">
              {{ scope.row.estimatedBonus }}元
            </template>
          </vxe-column>
          <vxe-column title="操作" show-overflow>
            <template #default="scope">
              <el-button link type="primary">删除</el-button>
              <el-button @click="synchronousInfo(scope.row)" link type="primary">同步</el-button>
            </template>
          </vxe-column>

        </vxe-table>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import {getCurrentInstance, nextTick, reactive, watch, onBeforeUpdate} from "vue";
import selectDialog from '@/components/selectDialog/selectDialog.vue'
import addRewardRulesDialog from '@/components/addRewardRulesDialog/addRewardRulesDialog.vue'
import synchronousInfoDialog from '@/components/synchronousInfoDialog/synchronousInfoDialog.vue'
import {cloneFunction} from "@/utils/globalFunction";
import {ElMessage,} from 'element-plus'

const rulesTable = {
  roles: [{required: true, message: "请选择奖励对象", trigger: "change"}],
  rewardType: [{required: true, message: "请选择结算方式", trigger: "change"}],
  rewardCycle: [{required: true, message: "请选择核算周期", trigger: "change"}],
  count: [{required: true, message: "请输入奖励条件", trigger: "change"}],
  rewardConditions: [{required: true, message: "请选择条件类型", trigger: "change"}],
  percentageType: [{required: true, message: "请选择比例类型", trigger: "change"}],
  rewardPercentage: [{required: true, message: "请输入奖金比例", trigger: "change"}],
  rewardUnit: [{required: true, message: "请输入达标数量", trigger: "blur"}],
  rewardCondition: [{required: true, message: "请输入奖励条件", trigger: "blur"}],
}

const addRewardRulesInstance = ref()
//新增奖励规则
const addRewardRules = function () {

  addRewardRulesInstance.value.showDialog()
}
//同步取消
const cancelSynchronousInfo = function () {
  synchronousIsShow.value = false
}
//同步信息
const synchronousInfoInstance = ref('')
let oldRewardRule = reactive({})
const synchronousIsShow = ref(false)
const synchronousInfo = function (currentGoodsInfo) {
  synchronousIsShow.value = true
  //保存当前的商品信息
  oldRewardRule = cloneFunction(currentGoodsInfo)
  console.log(oldRewardRule)
  delete oldRewardRule.id
  delete oldRewardRule.productName
  delete oldRewardRule.brand
  delete oldRewardRule.category
  delete oldRewardRule._X_ROW_KEY
  //打开弹框选取要同步到的其他商品奖励规则
  nextTick(() => {
    synchronousInfoInstance.value.showDialog()
  })
}
const synchronousCallBackInfo = function (callbackId) {
  synchronousIsShow.value = false
  //遍历获取选中id对应的商品信息
  callbackId.forEach(itemId => {
    let index = rewardDataList.tableData.findIndex(item => {
      return itemId == item.id
    })
    let newObject = Object.assign(rewardDataList.tableData[index], cloneFunction(oldRewardRule))
    rewardDataList.tableData[index] = newObject
  })
  console.log(rewardDataList.tableData)
}

const deepDialog = ref('')
const showDeepDialog = function () {
  deepDialog.value.showDialog()
}
// 表格
let rewardDataList = reactive({
  tableData: [
    {
      id: '123',
      productName: '医用酒精棉',
      brand: "万和",
      category: "医疗",
      //奖励结算方式
      rewardType: '',
      //核算周期
      rewardCycle: '',
      //奖励角色和奖励规则
      roles: [],
      role: [],
      //预估奖金
      estimatedBonus: 120000

    },
    {
      id: '456',
      productName: '医用注射器',
      brand: "万和",
      category: "医疗",
      //奖励结算方式
      rewardType: '',
      //核算周期
      rewardCycle: '',
      //奖励角色和奖励规则
      roles: [],
      role: [],
      //预估奖金
      estimatedBonus: 120000

    },
    {
      id: '789',
      productName: '针灸理疗仪',
      brand: "和平",
      category: "医疗",
      //奖励结算方式
      rewardType: '',
      //核算周期
      rewardCycle: '',
      //奖励角色和奖励规则
      roles: [],
      role: [],
      //预估奖金
      estimatedBonus: 120000

    },
  ]
})
// 奖励类型
const rewardTypeList = [
  {value: 1, label: '存量'},
  {value: 2, label: '达量'},
  {value: 3, label: '增量'}
]
//奖励类型筛选
const filterRewardType = [{label: '存量', value: 1}, {label: '达量', value: 2}, , {label: '增量', value: 3}]
//核算周期
const rewardCycleList = [
  {value: 1, label: '日'},
  {value: 2, label: '周'},
  {value: 3, label: '月'}
]
//核算周期筛选
const filterRewardCycle = [{label: '日', value: 1}, {label: '周', value: 2}, , {label: '天', value: 3}]
//销量类型
const salesType = [
  {value: 1, label: '元'},
  {value: 2, label: '件'},
]
//奖金分类
const rewardsDistribution = [
  {value: 1, label: '按销售额百分比奖励'},
  {value: 2, label: '按奖金金额奖励'},
]
//奖励的参与人
const rewardsPlayers = [
  {
    value: 1,
    roleName: '大区经理',
    count: "",
    rewardConditions: 1,
    rewardPercentage: 10,
    percentageType: 1
  },
  {
    value: 2,
    roleName: '片区经理',
    count: "",
    rewardConditions: 1,
    rewardPercentage: 10,
    percentageType: 1
  },
  {
    value: 3,
    roleName: '店长',
    count: "",
    rewardConditions: 1,
    rewardPercentage: 10,
    percentageType: 1
  },
  {
    value: 4,
    roleName: '店员',
    count: "",
    rewardConditions: 1,
    rewardPercentage: 10,
    percentageType: 1
  },
]

//改变奖励人员
const changeRewardsPeople = function (dataInfo) {
//  根据选中的参与人 初始化人员规则配置
  const selectedPeoples = dataInfo.roles
  const initRoles = []
  selectedPeoples.forEach(key => {
    //拷贝一下 不然对象会形成引用导致数据错
    const array = rewardsPlayers.filter(item => {
      if (item.value === key) {
        return item
      }
    })
    const roleItem = array[0]
    initRoles.push({...roleItem})
  })
  dataInfo.role = initRoles
}
//删除已选的人员列表
const deletePeopelList = function (row, parentRow) {
  console.log(row, parentRow)
//  匹配value值
  const deleteValue = row.value
//删除本生所在人员列表
  parentRow.role = [...parentRow.role.filter(item => {
    return item.value !== deleteValue
  })]
//删除下拉框选中人员当中的key
  parentRow.roles = [...parentRow.roles.filter(item => {
    return item !== deleteValue
  })]
  console.log(row, parentRow)
}
//点击保存的校验
const formTableRefOut = ref([])
let InnerFormInstanceArray = ref([])
const InnerFormInstance = function (itemInstance) {
  if (itemInstance) {
    InnerFormInstanceArray.value.push(itemInstance)
  }
}

const xTable = ref('')
let isExpend = ref(false)
const closeAllExpend = function () {
  xTable.value.clearRowExpand()
  isExpend.value = false
}
const validateForm = async function () {
  xTable.value.setAllRowExpand(true)
  isExpend.value = true
  await formTableRefOut.value.validate((valid, fields) => {
    if (valid) {
      loopExecution(InnerFormInstanceArray.value).then(res => {
        ElMessage.closeAll()
        ElMessage.success("验证成功")
        console.log("成功的次数")
      }, rej => {
        ElMessage.closeAll()
        ElMessage.error("请输入完整单品信息")
        console.log("失败次数")
      })
    } else {
      ElMessage.closeAll()
      ElMessage.error("请输入完整单品信息")
    }
  })
}
const loopExecution = function (array) {
  let promiseArray = ref([])
  Object.values(array).forEach(item => {
    promiseArray.value.push(
        new Promise((resolve, reject) => {
          item.validate((valid, fields) => {
            if (valid) {
              resolve()
            } else {
              reject()
            }
          })
        })
    )
  })

  return Promise.all(promiseArray.value)
}
defineExpose({
  validateForm
})

</script>

<style scoped lang="scss">
//.tableList::v-deep.el-select__tags {
//  white-space: nowrap !important;
//  flex-wrap: nowrap !important;
//  overflow: hidden !important;
//  text-overflow: ellipsis !important;
//}
//
.tableList::v-deep(.el-message) {
  margin-top: 400px !important;
}

.tableList {
  display: flex;
  flex-direction: column;

  .addGoods {
    align-self: flex-end;
    margin-bottom: 10px;
  }

  .contentBox {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .goodsInfo {
      display: flex;
      flex-direction: column;
      width: 50%;

      .goodsItems {
        display: flex;
        flex-direction: row;

        .goodsItem {
          margin: 10px 50px;
        }
      }

    }

    .goodsRules {
      width: 50%;
    }
  }
}

/*滚动条整体部分*/
.mytable-scrollbar ::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

/*滚动条的轨道*/
.mytable-scrollbar ::-webkit-scrollbar-track {
  background-color: #FFFFFF;
}

/*滚动条里面的小方块，能向上向下移动*/
.mytable-scrollbar ::-webkit-scrollbar-thumb {
  background-color: #bfbfbf;
  border-radius: 5px;
  border: 1px solid #F1F1F1;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
}

.mytable-scrollbar ::-webkit-scrollbar-thumb:hover {
  background-color: #A8A8A8;
}

.mytable-scrollbar ::-webkit-scrollbar-thumb:active {
  background-color: #787878;
}

/*边角，即两个滚动条的交汇处*/
.mytable-scrollbar ::-webkit-scrollbar-corner {
  background-color: #FFFFFF;
}


</style>


