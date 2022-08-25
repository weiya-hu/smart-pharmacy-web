<template>
  <div class="outBox">
    <div class="desc">
      <span>自营任务 —— 连锁商户自己发起的营销激励任务</span>
    </div>
    <!--    搜索条件-->
    <div class="serachParams">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.region" placeholder="请选择任务类型" clearable>
            <el-option label="销售任务" value="shanghai"/>
            <el-option label="陈列任务" value="beijing"/>
            <el-option label="学习任务" value="shanghai"/>
            <el-option label="服务任务" value="beijing"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.region" placeholder="请选择任务区域" clearable>
            <el-option label="成都" value="shanghai"/>
            <el-option label="重庆" value="beijing"/>
            <el-option label="上海" value="shanghai"/>
            <el-option label="南京" value="beijing"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
              v-model="formInline.value1"
              type="datetimerange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="defaultTime1"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.region" placeholder="请选择任务状态" clearable>
            <el-option label="进行中" value="shanghai"/>
            <el-option label="已完结" value="beijing"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请输入商品名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="statistic">
      <el-row>
        <el-col :span="4">
          <div class="totalItem">
            <div>当前活动</div>
            <div>13</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="totalItem">
            <div>参与店铺</div>
            <div>32</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="totalItem">
            <div>参与人次</div>
            <div>2323</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="totalItem">
            <div>销售额(元)</div>
            <div>500000</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="totalItem">
            <div>合计奖池(元)</div>
            <div>1532</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="totalItem">
            <div>累计发放(元)</div>
            <div>328.30</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--    图形统计-->
    <div class="barChart">
      <div class="chart chart_one">
        <columnChart :dataOption="chart_one_data"></columnChart>
      </div>
      <div class="chart chart_two">
        <columnChart :dataOption="chart_two_data"></columnChart>
      </div>
    </div>
    <!--    区域销售列表展示-->
    <div class="areaMarket">

      <div class="allArea area">
        <pagevxeContent :listName="'activityReportList'" :storeConfig="contentTableActivityReport"
                        :contentTableConfig="allAreaTableConfig">
          <template #chainRatioSlot="{row}">
            <div>
              {{ row.chainRatio }}
              <span v-if="row.isUp">
                          <el-icon color="green"><Top/></el-icon>
                      </span>
              <span v-else>
                        <el-icon color="red"><Bottom/></el-icon>
                      </span>

            </div>
          </template>

        </pagevxeContent>
      </div>

      <div class="provinceArea area">
        <pagevxeContent :listName="'activityReportList'" :storeConfig="contentTableActivityReport"
                        :contentTableConfig="allAreaTableConfig">
          <template #chainRatioSlot="{row}">
            <div>
              {{ row.chainRatio }}
              <span v-if="row.isUp">
                          <el-icon color="green"><Top/></el-icon>
                      </span>
              <span v-else>
                        <el-icon color="red"><Bottom/></el-icon>
                      </span>

            </div>
          </template>

        </pagevxeContent>
      </div>
      <div class="cityArea area">
        <pagevxeContent :listName="'activityReportList'" :storeConfig="contentTableActivityReport"
                        :contentTableConfig="allAreaTableConfig">
          <template #chainRatioSlot="{row}">
            <div>
              {{ row.chainRatio }}
              <span v-if="row.isUp">
                          <el-icon color="green"><Top/></el-icon>
                      </span>
              <span v-else>
                        <el-icon color="red"><Bottom/></el-icon>
                      </span>

            </div>
          </template>

        </pagevxeContent>
      </div>
      <div class="storeArea area">
        <pagevxeContent :listName="'activityReportList'" :storeConfig="contentTableActivityReport"
                        :contentTableConfig="allAreaTableConfig">
          <template #chainRatioSlot="{row}">
            <div>
              {{ row.chainRatio }}
              <span v-if="row.isUp">
                          <el-icon color="green"><Top/></el-icon>
                      </span>
              <span v-else>
                        <el-icon color="red"><Bottom/></el-icon>
                      </span>

            </div>
          </template>

        </pagevxeContent>
      </div>
    </div>
    <!--    品牌销量和单品销量-->
    <div class="salesBrandAndSingle">
      <div class="salesBrand sales">
        <el-tabs
            v-model="salesBrand"
            class="demo-tabs"
        >
          <el-tab-pane label="品牌销量" name="first">
            <pagevxeContent :listName="'activityReportList'" :storeConfig="contentTableActivityReport"
                            :contentTableConfig="allAreaTableConfig">
              <template #chainRatioSlot="{row}">
                <div>
                  {{ row.chainRatio }}
                  <span v-if="row.isUp">
                          <el-icon color="green"><Top/></el-icon>
                      </span>
                  <span v-else>
                        <el-icon color="red"><Bottom/></el-icon>
                      </span>

                </div>
              </template>
            </pagevxeContent>
          </el-tab-pane>
          <el-tab-pane label="品牌客单" name="second">
            <pagevxeContent :listName="'activityReportList'" :storeConfig="contentTableActivityReport"
                            :contentTableConfig="allAreaTableConfig">
              <template #chainRatioSlot="{row}">
                <div>
                  {{ row.chainRatio }}
                  <span v-if="row.isUp">
                          <el-icon color="green"><Top/></el-icon>
                      </span>
                  <span v-else>
                        <el-icon color="red"><Bottom/></el-icon>
                      </span>
                </div>
              </template>
            </pagevxeContent>
          </el-tab-pane>

        </el-tabs>

      </div>
      <div class="salesSingle sales">
        <el-tabs
            v-model="salesSingle"
            class="demo-tabs"
        >
          <el-tab-pane label="单品销量" name="first">
            <pagevxeContent :listName="'activityReportList'" :storeConfig="contentTableActivityReport"
                            :contentTableConfig="allAreaTableConfig">
              <template #chainRatioSlot="{row}">
                <div>
                  {{ row.chainRatio }}
                  <span v-if="row.isUp">
                          <el-icon color="green"><Top/></el-icon>
                      </span>
                  <span v-else>
                        <el-icon color="red"><Bottom/></el-icon>
                      </span>

                </div>
              </template>
            </pagevxeContent>
          </el-tab-pane>
          <el-tab-pane label="单品客单" name="second">
            <pagevxeContent :listName="'activityReportList'" :storeConfig="contentTableActivityReport"
                            :contentTableConfig="allAreaTableConfig">
              <template #chainRatioSlot="{row}">
                <div>
                  {{ row.chainRatio }}
                  <span v-if="row.isUp">
                          <el-icon color="green"><Top/></el-icon>
                      </span>
                  <span v-else>
                        <el-icon color="red"><Bottom/></el-icon>
                      </span>
                </div>
              </template>
            </pagevxeContent>
          </el-tab-pane>

        </el-tabs>
      </div>
    </div>
    <div>

      <!--      奖励列表-->
      <div class="rewardList">
        <div class="rewardTypeList listInfo">
          <el-tabs
              v-model="rewardType"
              type="card"
          >
            <el-tab-pane label="单品激励" name="first">
              <pagevxeContent :listName="'activityReportList'" :storeConfig="contentTableActivityReport"
                              :contentTableConfig="allAreaTableConfig">
                <template #chainRatioSlot="{row}">
                  <div>
                    {{ row.chainRatio }}
                    <span v-if="row.isUp">
                          <el-icon color="green"><Top/></el-icon>
                      </span>
                    <span v-else>
                        <el-icon color="red"><Bottom/></el-icon>
                      </span>

                  </div>
                </template>
              </pagevxeContent>
            </el-tab-pane>
            <el-tab-pane label="品牌激励" name="second">
              <pagevxeContent :listName="'activityReportList'" :storeConfig="contentTableActivityReport"
                              :contentTableConfig="allAreaTableConfig">
                <template #chainRatioSlot="{row}">
                  <div>
                    {{ row.chainRatio }}
                    <span v-if="row.isUp">
                          <el-icon color="green"><Top/></el-icon>
                      </span>
                    <span v-else>
                        <el-icon color="red"><Bottom/></el-icon>
                      </span>

                  </div>
                </template>
              </pagevxeContent>
            </el-tab-pane>
            <el-tab-pane label="门店激励" name="third">
              <pagevxeContent :listName="'activityReportList'" :storeConfig="contentTableActivityReport"
                              :contentTableConfig="allAreaTableConfig">
                <template #chainRatioSlot="{row}">
                  <div>
                    {{ row.chainRatio }}
                    <span v-if="row.isUp">
                          <el-icon color="green"><Top/></el-icon>
                      </span>
                    <span v-else>
                        <el-icon color="red"><Bottom/></el-icon>
                      </span>

                  </div>
                </template>
              </pagevxeContent>
            </el-tab-pane>
          </el-tabs>


        </div>
        <div class="rewardInfoList listInfo">
          <el-tabs
              v-model="rewardInfo"
              type="card"
          >
            <el-tab-pane label="品牌获奖" name="first">
              <pagevxeContent :listName="'activityReportList'" :storeConfig="contentTableActivityReport"
                              :contentTableConfig="allAreaTableConfig">
                <template #chainRatioSlot="{row}">
                  <div>
                    {{ row.chainRatio }}
                    <span v-if="row.isUp">
                          <el-icon color="green"><Top/></el-icon>
                      </span>
                    <span v-else>
                        <el-icon color="red"><Bottom/></el-icon>
                      </span>

                  </div>
                </template>
              </pagevxeContent>
            </el-tab-pane>
            <el-tab-pane label="区域获奖" name="second">
              <pagevxeContent :listName="'activityReportList'" :storeConfig="contentTableActivityReport"
                              :contentTableConfig="allAreaTableConfig">
                <template #chainRatioSlot="{row}">
                  <div>
                    {{ row.chainRatio }}
                    <span v-if="row.isUp">
                          <el-icon color="green"><Top/></el-icon>
                      </span>
                    <span v-else>
                        <el-icon color="red"><Bottom/></el-icon>
                      </span>

                  </div>
                </template>
              </pagevxeContent>
            </el-tab-pane>
            <el-tab-pane label="门店获奖" name="third">
              <pagevxeContent :listName="'activityReportList'" :storeConfig="contentTableActivityReport"
                              :contentTableConfig="allAreaTableConfig">
                <template #chainRatioSlot="{row}">
                  <div>
                    {{ row.chainRatio }}
                    <span v-if="row.isUp">
                          <el-icon color="green"><Top/></el-icon>
                      </span>
                    <span v-else>
                        <el-icon color="red"><Bottom/></el-icon>
                      </span>

                  </div>
                </template>
              </pagevxeContent>
            </el-tab-pane>
            <el-tab-pane label="个人获奖" name="four">
              <pagevxeContent :listName="'activityReportList'" :storeConfig="contentTableActivityReport"
                              :contentTableConfig="allAreaTableConfig">
                <template #chainRatioSlot="{row}">
                  <div>
                    {{ row.chainRatio }}
                    <span v-if="row.isUp">
                          <el-icon color="green"><Top/></el-icon>
                      </span>
                    <span v-else>
                        <el-icon color="red"><Bottom/></el-icon>
                      </span>

                  </div>
                </template>
              </pagevxeContent>
            </el-tab-pane>
          </el-tabs>

        </div>


      </div>


    </div>
  </div>
</template>

<script setup>

import {reactive} from "vue";
import pagevxeContent from "@/components/page-vxeContent/page-vxeContent.vue";
import {allAreaTableConfig} from './config/allAreaConfig.js'
import columnChart from "@/components/column-Chart/column-Chart.vue"
import {contentTableActivityReport} from './config/storeConfig.js'

const formInline = reactive({
  user: '',
  region: '',
  value1: '',
})
const onSubmit = () => {
  console.log('submit!')
}
const salesBrand = ref('first')
const salesSingle = ref('first')
const rewardType = ref('first')
const rewardInfo = ref('first')


//图标一配置项
const chart_one_data = {
  title: {
    text: '销售额'
  },
  tooltip: {},
  legend: {
    data: ['销量']
  },
  xAxis: {},
  yAxis: {
    type: "category",
    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
  },
  series: [{
    name: '销量',
    type: 'bar',
    data: [5, 20, 36, 10, 10, 20]
  }]
};


//图表二配置项
const chart_two_data = {
  title: {
    text: '奖金'
  },
  tooltip: {},
  legend: {
    data: ['销量']
  },
  xAxis: {},
  yAxis: {
    type: "category",
    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
  },
  series: [{
    name: '销量',
    type: 'bar',
    data: [5, 20, 36, 10, 10, 20]
  }]
};
</script>
<style scoped lang="scss">
//选中时样式设置
.rewardList::v-deep(.el-tabs--card>.el-tabs__header .el-tabs__item.is-active) {
  background-color: #02a7f0;
  color: black;
}

// 先把整体的线去掉
.rewardList::v-deep(.el-tabs--card > .el-tabs__header) {
  border: none !important;
}

// 再为tabs添加border-bottom
.rewardList::v-deep(.el-tabs__nav) {
  border: none !important;
}

.rewardList::v-deep(.el-tabs__nav-wrap)::after {
  position: static !important;
}

.rewardList ::v-deep(.el-tabs__active-bar) {
  background-color: transparent !important;
}

.rewardList::v-deep(.el-tabs__item ) {
  border-radius: 0 10px 0 0;
  border: 1px solid #c9cacf;
  margin-left: 10px;
}

//====
//选中时样式设置
.salesBrandAndSingle::v-deep(.el-tabs--card>.el-tabs__header .el-tabs__item.is-active) {
  background-color: #02a7f0;
  color: black;
}

// 先把整体的线去掉
.salesBrandAndSingle::v-deep(.el-tabs--card > .el-tabs__header) {
  border: none !important;
}

// 再为tabs添加border-bottom
.salesBrandAndSingle::v-deep(.el-tabs__nav) {
  border: none !important;
}

.salesBrandAndSingle::v-deep(.el-tabs__nav-wrap)::after {
  position: static !important;
}

.salesBrandAndSingle ::v-deep(.el-tabs__active-bar) {
  background-color: transparent !important;
}

.salesBrandAndSingle::v-deep(.el-tabs__item ) {
  margin-left: 10px;
  line-height: 60px;
}


//===

.outBox {
  display: flex;
  flex-direction: column;
  padding: 20px;


  .desc {
    color: #999;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    margin-bottom: 20px;
  }

  .statistic {
    .totalItem {
      width: 150px;
      height: 100px;
      border-radius: 5px;
      border: 1px solid #c9cacf;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }

  .barChart {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .chart_one {
      width: 50vw;
    }

    .chart_two {
      width: 40vw;
    }

    .chart {
      height: 500px;
      border: 1px dashed #c9cacf;
      text-align: center;
      line-height: 200px;
    }


  }

  .areaMarket {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .area {
      width: 21vw;
      border: 1px solid #c9cacf;
      text-align: center;
      border-radius: 5px;
    }
  }

  .salesBrandAndSingle {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: space-between;

    .sales {
      border: 1px solid #c9cacf;
      width: 43vw;
      border-radius: 5px;
    }
  }

  .rewardList {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: space-between;

    .listInfo {
      width: 43vw;
      border-radius: 5px;
    }


  }
}

</style>


