<template>
  <div class="outBox" v-loading="salesLoading" element-loading-text="加载中...">
    <!--    搜索区域-->
    <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
      <el-form-item class="label" label="任务时间" prop="name">
        <el-date-picker start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        v-model="queryParams.betweenDates"
                        type="daterange"
                        format="YYYY-MM-DD "
                        value-format="YYYY-MM-DD HH:mm:ss"
                        :default-time="defaultTime"
                        clearable
                        style="width: 220px;"
        />
      </el-form-item>
      <el-form-item class="label" label="时间范围" prop="name">
        <el-select style="width: 220px;" v-model="queryParams.timeRangeQuickSelection"
                   placeholder="请选择要查看的时间范围" clearable>
          <el-option v-for="(item,key) in fastSelectDate" :key="key" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item class="label" label="区域" prop="name">
        <el-cascader v-model="queryParams.nodeId" style="width: 220px;"
                     placeholder="请选择区域"
                     :collapse-tags="true"
                     :options="areaOptions"
                     :props="props"
                     clearable/>
      </el-form-item>
      <el-form-item class="label" label="品类" prop="name">
        <el-select style="width: 220px;" v-model="queryParams.productTypeFilter" placeholder="请选择要查看的品类"
                   clearable>
          <el-option v-for="(item,index) in productTypeOption" :key="index" :label="item.name" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item class="label" label="品牌" prop="name">
        <el-select collapse-tags multiple style="width: 220px;" v-model="queryParams.brand"
                   placeholder="请选择要查看的品牌" clearable>
          <el-option v-for="(item,index) in brandOption" :key="index" :label="item.name" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item class="label" label="关键字" prop="name">
        <el-input style="width: 220px;" v-model="queryParams.otherFilter"
                  placeholder="请输入商品名称|商品ID"></el-input>
      </el-form-item>
      <el-form-item class="label">
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--    总数统计-->
    <div class="totalStatistics">
      <el-row>
        <el-col :xs="8" :sm="6" :md="4">
          <div class="totalItem">
            <div class="data">{{ baseInfo.sumAmount !== 0 ? baseInfo.sumAmount.toFixed(2) : 0 }}</div>
            <div class="title">销售总额(元)</div>
          </div>
        </el-col>

        <el-col :xs="8" :sm="6" :md="4">
          <div class="totalItem">
            <div class="data">{{ baseInfo.sumEventAmount !== 0 ? baseInfo.sumEventAmount.toFixed(2) : 0 }}</div>
            <div class="title">激励活动销售额(元)</div>
          </div>
        </el-col>

        <el-col :xs="8" :sm="6" :md="4">
          <div class="totalItem">
            <div class="data">{{ baseInfo.storeCount }}</div>
            <div class="title">动销店铺(家)</div>
          </div>
        </el-col>

        <el-col :xs="8" :sm="6" :md="4">
          <div class="totalItem">
            <div class="data">{{ baseInfo.brandCount }}</div>
            <div class="title">动销品牌(个)</div>
          </div>
        </el-col>

        <el-col :xs="8" :sm="6" :md="4">
          <div class="totalItem">
            <div class="data">{{ baseInfo.productCount }}</div>
            <div class="title">动销商品(个/套)</div>
          </div>
        </el-col>
      </el-row>

    </div>
    <!--    统计图展示-->
    <div class="chartShow">
      <el-tabs
          v-model="activeName"
          type="card"
          class="demo-tabs chartTabs"
          v-loading="chartLoading"
          element-loading-text="加载中..."
          @tab-change=chartTabChange
      >
        <el-tab-pane name="first">
          <template #label>
            <div class="saleActiveProportion">销售活动占比{{ saleChartTaskName ? `(${saleChartTaskName})` : '' }}
              <el-popover width="220px" placement="right" trigger="click">
                <template #reference>
                  <el-icon>
                    <Switch/>
                  </el-icon>
                </template>
                <template #default>
                  <el-select @change="changeActive" style="width: 200px;" ref="activeSelectInstance"
                             v-model="selectedActive"
                             placeholder="请选择要查看的活动">
                    <el-option v-for="(item,index) in eventActiveSelectOptions" :label="item.name" :value="item.eventId"
                               :key="item.eventId">

                    </el-option>
                  </el-select>
                </template>
              </el-popover>
            </div>
          </template>
          <div class="itemChart">
            <scaleChart ref="charts_one_instance" v-show="charts_one_isNull == false"
                        :registeredLegendEvent="legendEvent"
                        :dataOption="chart_one_Option">
            </scaleChart>
            <el-empty description="暂无数据" v-show="charts_one_isNull == true"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="动销店铺占比" name="second">
          <div class="itemChart">
            <columnChart v-show="charts_two_isNull == false" ref="charts_two_instance" :size="twoChartSize"
                         :dataOption="chart_two_Option"></columnChart>
            <el-empty description="暂无数据" v-show="charts_two_isNull == true"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="动销品牌占比" name="third">
          <div class="itemChart">
            <columnChart v-show="charts_three_isNull == false" ref="charts_three_instance" :size="twoChartSize"
                         :dataOption="chart_three_Option"></columnChart>
            <el-empty description="暂无数据" v-show="charts_three_isNull == true"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="动销单品占比" name="fourth">
          <div class="itemChart">
            <columnChart v-show="charts_four_isNull == false" ref="charts_four_instance" :size="twoChartSize"
                         :dataOption="chart_four_Option"></columnChart>
            <el-empty description="暂无数据" v-show="charts_four_isNull == true"/>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>

    <!-- 门店，单品，品牌统计表-->
    <div class="areaStatistical">
      <el-tabs
          v-model="areaName"
          type="card"
          class="demo-tabs"
          v-loading="areaNameLoading"
          element-loading-text="加载中..."
          @tab-change=listTabChange
      >
        <el-tab-pane label="门店激励" name="fourth">
          <div class="tableList">
            <pagevxeContent :contentTableConfig="allAreaTableConfig"
                            :storeConfig="contentTableSalesReportToStore">
              <template #yearOnYearSlot="{row}">
                <div>
                  {{ row.yearOnYear }}
                  <span v-if="row.yearOnYear && Number(row.yearOnYear.split('%')[0])>0">
                      <el-icon size="18px" color="green"><Top/></el-icon>
                  </span>
                  <span v-else-if="row.yearOnYear == null"></span>
                  <span v-else>
                    <el-icon size="18px" color="red"><Bottom/></el-icon>
                  </span>

                </div>
              </template>
              <template #monthOnMonthSlot="{row}">
                <div>
                  {{ row.monthOnMonth }}
                  <span v-if="row.monthOnMonth && Number(row.monthOnMonth.split('%')[0])>0">
                      <el-icon size="18px" color="green"><Top/></el-icon>
                  </span>
                  <span v-else-if="row.monthOnMonth == null"></span>
                  <span v-else>
                    <el-icon size="18px" color="red"><Bottom/></el-icon>
                  </span>
                </div>
              </template>
              <template #slotEmpty>
                <el-empty description="暂无数据"/>
              </template>
            </pagevxeContent>
          </div>
        </el-tab-pane>
        <el-tab-pane label="品牌" name="five">
          <div class="tableList">
            <pagevxeContent :contentTableConfig="allAreaTableConfig"
                            :storeConfig="contentTableSalesReportToBrand">
              <template #yearOnYearSlot="{row}">
                <div>
                  {{ row.yearOnYear }}
                  <span v-if="row.yearOnYear && Number(row.yearOnYear.split('%')[0])>0">
                      <el-icon size="18px" color="green"><Top/></el-icon>
                  </span>
                  <span v-else-if="row.yearOnYear == null"></span>
                  <span v-else>
                    <el-icon size="18px" color="red"><Bottom/></el-icon>
                  </span>

                </div>
              </template>
              <template #monthOnMonthSlot="{row}">
                <div>
                  {{ row.monthOnMonth }}
                  <span v-if="row.monthOnMonth && Number(row.monthOnMonth.split('%')[0])>0">
                      <el-icon size="18px" color="green"><Top/></el-icon>
                  </span>
                  <span v-else-if="row.monthOnMonth == null"></span>
                  <span v-else>
                    <el-icon size="18px" color="red"><Bottom/></el-icon>
                  </span>
                </div>
              </template>
              <template #slotEmpty>
                <el-empty description="暂无数据"/>
              </template>
            </pagevxeContent>
          </div>
        </el-tab-pane>
        <el-tab-pane label="单品" name="six">
          <div class="tableList">
            <pagevxeContent :contentTableConfig="allAreaTableConfig"
                            :storeConfig="contentTableSalesReportToProduct">
              <template #yearOnYearSlot="{row}">
                <div>
                  {{ row.yearOnYear }}
                  <span v-if="row.yearOnYear && Number(row.yearOnYear.split('%')[0])>0">
                      <el-icon size="18px" color="green"><Top/></el-icon>
                  </span>
                  <span v-else-if="row.yearOnYear == null"></span>
                  <span v-else>
                    <el-icon size="18px" color="red"><Bottom/></el-icon>
                  </span>

                </div>
              </template>
              <template #monthOnMonthSlot="{row}">
                <div>
                  {{ row.monthOnMonth }}
                  <span v-if="row.monthOnMonth && Number(row.monthOnMonth.split('%')[0])>0">
                      <el-icon size="18px" color="green"><Top/></el-icon>
                  </span>
                  <span v-else-if="row.monthOnMonth == null"></span>
                  <span v-else>
                    <el-icon size="18px" color="red"><Bottom/></el-icon>
                  </span>
                </div>
              </template>
              <template #slotEmpty>
                <el-empty description="暂无数据"/>
              </template>
            </pagevxeContent>
          </div>
        </el-tab-pane>
        <el-tab-pane label="区域" name="seven">
          <!-- 自定义结构统计表      :cell-style="{'text-align':'center'}" -->
          <div class="tableList">
            <el-table
                v-loading="treeLoading"
                element-loading-text="加载中..."
                :data="regionTableListTree"
                :default-expand-all="false"
                row-key="nodeId"
                style="width: 100%;height: 100%"
                :tree-props="{ children: 'children' }"
                :cell-style="{'text-align':'center'}"
                :header-cell-style="{backgroundColor: '#efefef !important','text-align':'center'}"
            >
              <el-table-column type="index" label="序号" width="200"/>
              <el-table-column prop="group" width="230" label="名称" show-tooltip-when-overflow></el-table-column>
              <el-table-column prop="avgMoney" label="均值(元)" show-tooltip-when-overflow>
                <template #default="{row}">
                  <span>{{ row.avgMoney.toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="maxMoney" label="峰值(元)" show-tooltip-when-overflow>
                <template #default="{row}">
                  <span>{{ row.maxMoney.toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="maxTime" label="峰值日期" show-tooltip-when-overflow></el-table-column>
              <el-table-column prop="proportion" label="总额占比" show-tooltip-when-overflow></el-table-column>
              <el-table-column prop="yearOnYear" label="同比" show-tooltip-when-overflow>
                <template #default="{row}">
                  <div>
                    {{ row.yearOnYear }}
                    <span v-if="row.yearOnYear && Number(row.yearOnYear.split('%')[0])>0">
                      <el-icon size="18px" color="green"><Top/></el-icon>
                  </span>
                    <span v-else-if="row.yearOnYear == null"></span>
                    <span v-else>
                    <el-icon size="18px" color="red"><Bottom/></el-icon>
                  </span>

                  </div>
                </template>

              </el-table-column>
              <el-table-column prop="monthOnMonth" label="环比" show-tooltip-when-overflow>
                <template #default="{row}">
                  <div>
                    {{ row.monthOnMonth }}
                    <span v-if="row.monthOnMonth && Number(row.monthOnMonth.split('%')[0])>0">
                      <el-icon size="18px" color="green"><Top/></el-icon>
                  </span>
                    <span v-else-if="row.monthOnMonth == null"></span>
                    <span v-else>
                    <el-icon size="18px" color="red"><Bottom/></el-icon>
                  </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="shelfSalesRatio" label="动销率" show-tooltip-when-overflow></el-table-column>
              <el-table-column prop="sumMoney" label="销售额(元)" show-tooltip-when-overflow>
                <template #default="{row}">
                  <span>{{ row.sumMoney.toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="count" label="品/单数" show-tooltip-when-overflow></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <template #empty>
          <el-empty description="暂无数据"/>
        </template>
      </el-tabs>
    </div>

  </div>
</template>

<script setup>
import {nextTick, reactive, toRefs, watch} from "vue";
import useSalesReport from "@/store/modules/Company/salesReport.js"
import scaleChart from '@/components/scale-Chart/scale-Chart.vue'
import * as echarts from "echarts";
import columnChart from "@/components/column-Chart/column-Chart.vue"
import pagevxeContent from "@/components/page-vxeContent/page-vxeContent.vue";
import {
  contentTableSalesReportToStore,
  contentTableSalesReportToBrand,
  contentTableSalesReportToProduct
} from './config/storeConfig.js'
import {allAreaTableConfig} from './config/allAreaConfig.js'
import {
  getBrandOption,
  getProductTypeOption,
  getAreaTree
} from "@/api/activeTask/taskBI.js"

import {
  getStoreRatio,
  getBrandRatio,
  getProductRatio,
  getOrderList,
  getActivityAndNormal
} from '@/api/salesReport.js'
import {cloneFunction} from "@/utils/globalFunction";
import {getRegionMulti} from "@/api/salesReport/salesBI.js"

let defaultTime = ref([new Date(2022, 9, 10, 0, 0, 0), new Date(2022, 9, 10, 23, 59, 59)])
const {proxy} = getCurrentInstance();
/**自定义结构列表数据*/
let regionTableList = ref([])
/**自定义列表数据树形结构*/
let regionTableListTree = ref([])
/**自定义树形结构loading*/
let treeLoading = ref(false)
let saleStore = useSalesReport()
/**查询参数*/
const data = reactive({
  queryParams: {
    betweenDates: [],
    timeRangeQuickSelection: 3,
    productTypeFilter: [],
    brand: [],
    otherFilter: '',
    nodeId: []
  }
});
const {queryParams} = toRefs(data)
/**快捷时间下拉选项*/
const fastSelectDate = ref([
  {
    label: "今日",
    value: 1
  },
  {
    label: "本周",
    value: 2
  },
  {
    label: "本月",
    value: 3
  },


])
/**活动任务下拉框实例*/
const activeSelectInstance = ref()
/**图形tab切换栏*/
let activeName = ref('first')
/**表格tab切换栏*/
let areaName = ref('fourth')
/**品牌选项*/
let brandOption = ref([])
/**品类选项*/
let productTypeOption = ref([])
/**区域级联下拉*/
let props = ref({multiple: true, label: 'name', value: 'id', checkStrictly: false})
/**区域级联下拉选项*/
let areaOptions = ref([])
/**整个界面的loading*/
let salesLoading = ref(false)
/**控制chart图表tab栏切换的loading*/
let chartLoading = ref(false)
/**控制tab列表切换的loading*/
let areaNameLoading = ref(false)
/**看板基本统计信息*/
let baseInfo = ref({
  brandCount: 0,
  productCount: 0,
  storeCount: 0,
  sumAmount: 0,
  sumEventAmount: 0
})
/**图一任务下拉选项*/
let eventActiveSelectOptions = ref([])
/**图一销售活动占比活动下拉值*/
let selectedActive = ref('')
/**控制echarts图形是否为空展示的内容*/
let charts_one_isNull = ref(false)
let charts_two_isNull = ref(false)
let charts_three_isNull = ref(false)
let charts_four_isNull = ref(false)
/**表一的数据占比*/
let charts_one_dataRatio = ref([])
/**表二数据占比*/
let charts_two_dataRatio = ref([])
/**表三数据占比*/
let charts_three_dataRatio = ref([])
/**表四数据占比*/
let charts_four_dataRatio = ref([])
/**图一的实例*/
const charts_one_instance = ref()
/**图二的实例*/
const charts_two_instance = ref()
/**图三的实例*/
const charts_three_instance = ref()
/**图四的实例*/
const charts_four_instance = ref()
/**图形比例*/
/**下拉任务查看销售占比的任务名称*/
let saleChartTaskName = ref('')
const twoChartSize = {
  width: '90vw',
  height: '50vh',
  paddingRight: "80px"
}
/**图一基本配置*/
const chart_one_Option = ref({
  title: {
    text: '销售活动占比'
  },
  color: ['#81AFD5', '#ffab9c'],
  // 设置图表的位置
  grid: {
    x: 60, // 左间距
    y: 80, // 上间距
    x2: 60, // 右间距
    y2: 40, // 下间距
    containLabel: true // grid 区域是否包含坐标轴的刻度标签, 常用于『防止标签溢出』的场景
  },
  dataZoom: [                 //Y轴滑动条
    {
      type: 'slider', //滑动条
      show: false,      //开启
      xAxisIndex: [0],
      right: '93%',  //滑动条位置
      start: 1,    //初始化时，滑动条宽度开始标度
      end: 50,
      maxSpan: 30
    },   //初始化时，滑动条宽度结束标度 //y轴内置滑动
    {
      type: 'inside',  //内置滑动，随鼠标滚轮展示
      show: false,
      xAxisIndex: [0],
      start: 1,//初始化时，滑动条宽度开始标度  end: 50  //初始化时，滑动条宽度结束标度　　　　　　　　　　　
    }
  ],
  // 提示框组件
  tooltip: {
    trigger: 'axis', // 触发类型, axis: 坐标轴触发
    axisPointer: {
      // 指示器类型  'line' 直线指示器 'shadow' 阴影指示器 'none' 无指示器
      // 'cross' 十字准星指示器 其实是种简写，表示启用两个正交的轴的 axisPointer
      type: 'shadow',
      shadowStyle: {
        color: 'rgba(254, 198, 185, 0.2)',
        width: '1'
      }
    },

    textStyle: {
      // color: '#cdd3ee' // 文字颜色
    },
    // // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式 折线（区域）图、柱状（条形）图、K线图
    // // {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
    formatter: function (value) {
      return value[0].name + '<br />' + "活动销售额: " + value[0].data.value + '元' + '<br/>' + "日常销售额: " + value[1].data.value + "元" + '<br/>' + "销售总额: " + value[2].data.value + "元" + '<br/>' + "日常占比:" + charts_one_dataRatio.value[value[0].dataIndex].dailyRatio + '<br/>' + "活动占比:" + charts_one_dataRatio.value[value[0].dataIndex].activityRatio
    },
  },
  // 图例组件
  legend: {
    selectedMode: false,
    textStyle: { // 文本样式
      fontSize: 16,
      color: '#cdd3ee'
    },
    top: 13, // 定位
    data: ['活动', '日常'] // 图例的数据数组
  },
  yAxis: {
    name: '销售总额（元）',
    type: 'value', // 坐标轴类型,   'value' 数值轴，适用于连续数据
    // 坐标轴刻度
    axisTick: {
      show: false // 是否显示坐标轴刻度 默认显示
    },
    // 坐标轴轴线
    axisLine: { // 是否显示坐标轴轴线 默认显示
      show: true, // 是否显示坐标轴轴线 默认显示
      symbol: ['none', 'arrow'],
      lineStyle: { // 坐标轴线线的颜色
        color: '#6e7079'
      }
    },
    // 坐标轴在图表区域中的分隔线
    // splitLine: {
    //   show: false // 是否显示分隔线。默认数值轴显示
    // },
    // 坐标轴刻度标签
    axisLabel: {
      type: 'value',
      show: true, // 是否显示刻度标签 默认显示
      // fontSize: 16, // 文字的字体大小
      // color: '#cdd3ee', // 刻度标签文字的颜色
      // 使用字符串模板，模板变量为刻度默认标签 {value}
      formatter: '{value}'
    }

  },
  xAxis: [
    {
      name: '日期',
      // 坐标轴类型,  'category' 类目轴，适用于离散的类目数据
      // 为该类型时必须通过 data 设置类目数据
      type: 'category',
      // 坐标轴刻度
      axisTick: {
        show: false // 是否显示坐标轴刻度 默认显示
      },
      // 坐标轴轴线
      axisLine: { // 是否显示坐标轴轴线 默认显示
        show: true, // 是否显示坐标轴轴线 默认显示
        lineStyle: { // 坐标轴线线的颜色
          color: '#6e7079'
        }
      },
      // 坐标轴在图表区域中的分隔线
      splitLine: {
        show: false // 是否显示分隔线。默认数值轴显示
      },
      // 坐标轴刻度标签
      axisLabel: {
        show: true, // 是否显示刻度标签 默认显示
        // fontSize: 16, // 文字的字体大小
        // color: '#cdd3ee', // 刻度标签文字的颜色
        // 使用字符串模板，模板变量为刻度默认标签 {value}
        formatter: '{value}'
      },
      // 类目数据，在类目轴（type: 'category'）中有效
      data: []
    }
  ],
  // 系列列表
  series: [
    {
      type: 'bar', // 系列类型
      name: '活动', // 系列名称, 用于tooltip的显示, legend 的图例筛选
      // 数据堆叠，同个类目轴上系列配置相同的stack值后，后一个系列的值会在前一个系列的值上相加
      stack: '总量',
      barMaxWidth: 20, // 柱条的最大宽度，不设时自适应
      // 图形上的文本标签
      label: {
        show: true,
        // 标签的位置 left right bottom top inside  // 绝对的像素值 position: [10, 10]
        // 相对的百分比 position: ['50%', '50%']
        position: 'inside',
        formatter: function (value) {
          return ''
          // return charts_one_dataRatio.value[value.dataIndex].activityRatio
        },
        textStyle: {
          fontWeight: "bolder",
          fontSize: '12',
          color: "#333333"
        }
      },

      data: [] // 系列中的数据内容数组
    },
    {
      type: 'bar', // 系列类型
      name: '日常', // 系列名称, 用于tooltip的显示, legend 的图例筛选
      // 数据堆叠，同个类目轴上系列配置相同的stack值后，后一个系列的值会在前一个系列的值上相加
      stack: '总量',
      barMaxWidth: 20, // 柱条的最大宽度，不设时自适应
      // 图形上的文本标签
      label: {
        show: true,
        // 标签的位置 left right bottom top inside  // 绝对的像素值 position: [10, 10]
        // 相对的百分比
        position: 'inside',
        formatter: function (value) {
          // return charts_one_dataRatio.value[value.dataIndex].dailyRatio
          return ''
        },
        textStyle: {
          fontWeight: "bolder",
          fontSize: '12',
          color: "#333333"
        }
      },

      // itemStyle: {
      //   normal: {
      //     barBorderRadius: [12, 12, 0, 0], // （顺时针左上，右上，右下，左下）
      //   }
      // },
      data: [] // 系列中的数据内容数组
    },
    {
      name: '总数',    // 总数显示，生成一个总数的柱状图，将颜色设为透明，
      type: 'bar',     // label将位置设备内部底部，造成一个总数显示在
      stack: '总量',    // 柱状图上方的假象
      label: {
        normal: {
          show: true,
          position: 'insideBottom',
          formatter: '{c}元',         // 显示的总数
          textStyle: {
            color: '#333333',
            fontWeight: "bolder",
            fontSize: '12',
          }
        }
      },
      itemStyle: {
        normal: {
          color: 'rgba(128, 128, 128, 0)'      // 柱状图颜色设为透明
        }
      },
      data: []
    }
  ]
})
/**图二基本配置*/
const chart_two_Option = ref({
  color: ['#ffab9c'],
  dataZoom: [                 //Y轴滑动条
    {
      type: 'slider', //滑动条
      show: false,      //开启
      yAxisIndex: [0],
      right: '93%',  //滑动条位置
      start: 1,    //初始化时，滑动条宽度开始标度
      end: 10,
      maxSpan: 2,
    },   //初始化时，滑动条宽度结束标度 //y轴内置滑动
    {
      type: 'inside',  //内置滑动，随鼠标滚轮展示
      show: false,
      yAxisIndex: [0],
      start: 1,//初始化时，滑动条宽度开始标度  end: 50  //初始化时，滑动条宽度结束标度　　　　　　　　　　　
    }
  ],
  grid: {
    x: 60, // 左间距
    y: 80, // 上间距
    x2: 60, // 右间距
    y2: 40, // 下间距
    containLabel: true // grid 区域是否包含坐标轴的刻度标签, 常用于『防止标签溢出』的场景
  },
  tooltip: {
    trigger: 'axis', // 触发类型, axis: 坐标轴触发
    axisPointer: {
      // 指示器类型  'line' 直线指示器 'shadow' 阴影指示器 'none' 无指示器
      // 'cross' 十字准星指示器 其实是种简写，表示启用两个正交的轴的 axisPointer
      type: 'shadow',
      shadowStyle: {
        color: 'rgba(254, 198, 185, 0.2)',
        width: '1'
      }
    },
    textStyle: {
      // color: '#cdd3ee' // 文字颜色
    },
    // // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式 折线（区域）图、柱状（条形）图、K线图
    // // {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
    formatter: '{b}<br />{a0}: {c0}元'
  },
  title: {
    text: '动销店铺占比'
  },
  legend: {
    data: ['店铺销量'],
    selectedMode: false,
    textStyle: { // 文本样式
      fontSize: 16,
      color: '#cdd3ee'
    },
    top: 13, // 定位
  },
  xAxis: {
    // 坐标轴刻度标签
    name: '销售额',
    splitLine: {
      show: true // 是否显示分隔线。默认数值轴显示
    },
    axisLine: { // 是否显示坐标轴轴线 默认显示
      show: true, // 是否显示坐标轴轴线 默认显示
      lineStyle: { // 坐标轴线线的颜色
        color: '#6e7079'
      }
    },
    axisTick: {
      show: false // 是否显示坐标轴刻度 默认显示
    },
    axisLabel: {
      show: true, // 是否显示刻度标签 默认显示
      // fontSize: 16, // 文字的字体大小
      // color: '#cdd3ee', // 刻度标签文字的颜色
      // 使用字符串模板，模板变量为刻度默认标签 {value}
      formatter: '{value}元'
    },
  },
  yAxis: {
    name: "店铺名称",
    type: "category",
    axisTick: {
      show: false // 是否显示坐标轴刻度 默认显示
    },
    axisLine: { // 是否显示坐标轴轴线 默认显示
      show: true, // 是否显示坐标轴轴线 默认显示
      symbol: ['none', 'arrow'],
      lineStyle: { // 坐标轴线线的颜色
        color: '#6e7079'
      }
    },

    axisLabel: {
      type: 'value',
      show: true, // 是否显示刻度标签 默认显示
      // fontSize: 16, // 文字的字体大小
      // color: '#cdd3ee', // 刻度标签文字的颜色
      // 使用字符串模板，模板变量为刻度默认标签 {value}
      // formatter: '{value}'
      formatter: function (value) {
        if (value.length > 5) {
          return value.slice(0, 5) + "..."
        } else {
          return value
        }
      }
    },
    splitLine: {
      show: false // 是否显示分隔线。默认数值轴显示
    },
    data: []
  },
  series: [{
    name: '店铺销量',
    type: 'bar',
    stack: '总量',
    barMaxWidth: 20, // 柱条的最大宽度，不设时自适应
    label: {
      show: true,
      // 标签的位置 left right bottom top inside  // 绝对的像素值 position: [10, 10]
      // 相对的百分比 position: ['50%', '50%']
      position: 'inside',
      formatter: '',
      textStyle: {
        fontWeight: "bolder",
        fontSize: '12',
        color: "#333333"
      }
    },
    itemStyle: {
      normal: {
        barBorderRadius: [0, 12, 12, 0], // （顺时针左上，右上，右下，左下）
      }
    },
    data: []
  },
    {
      name: '总数',    // 总数显示，生成一个总数的柱状图，将颜色设为透明，
      type: 'bar',     // label将位置设备内部底部，造成一个总数显示在
      stack: '总量',    // 柱状图上方的假象
      barMaxWidth: 20, // 柱条的最大宽度，不设时自适应
      label: {
        show: true,
        // 标签的位置 left right bottom top inside  // 绝对的像素值 position: [10, 10]
        // 相对的百分比 position: ['50%', '50%']
        position: 'insideLeft',
        formatter: function (value) {
          return charts_two_dataRatio.value[value.dataIndex]
        },
        textStyle: {
          fontWeight: "bolder",
          fontSize: '12',
          color: "#333333"
        }
      },
      itemStyle: {
        normal: {
          color: 'rgba(128, 128, 128, 0)'      // 柱状图颜色设为透明
        }
      },
      data: []
    }
  ]
})
/**图三的基本配置*/
const chart_three_Option = ref({
  color: ['#ffab9c'],
  dataZoom: [                 //Y轴滑动条
    {
      type: 'slider', //滑动条
      show: false,      //开启
      yAxisIndex: [0],
      right: '93%',  //滑动条位置
      start: 1,    //初始化时，滑动条宽度开始标度
      end: 100
    },   //初始化时，滑动条宽度结束标度 //y轴内置滑动
    {
      type: 'inside',  //内置滑动，随鼠标滚轮展示
      show: false,
      yAxisIndex: [0],
      start: 1,//初始化时，滑动条宽度开始标度  end: 50  //初始化时，滑动条宽度结束标度　　　　　　　　　　　
    }
  ],
  grid: {
    x: 60, // 左间距
    y: 80, // 上间距
    x2: 60, // 右间距
    y2: 40, // 下间距
    containLabel: true // grid 区域是否包含坐标轴的刻度标签, 常用于『防止标签溢出』的场景
  },
  tooltip: {
    trigger: 'axis', // 触发类型, axis: 坐标轴触发
    axisPointer: {
      // 指示器类型  'line' 直线指示器 'shadow' 阴影指示器 'none' 无指示器
      // 'cross' 十字准星指示器 其实是种简写，表示启用两个正交的轴的 axisPointer
      type: 'shadow',
      shadowStyle: {
        color: 'rgba(254, 198, 185, 0.2)',
        width: '1'
      }
    },
    textStyle: {
      // color: '#cdd3ee' // 文字颜色
    },
    // // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式 折线（区域）图、柱状（条形）图、K线图
    // // {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
    formatter: '{b}<br />{a0}: {c0}元'
  },
  title: {
    text: '动销品牌占比'
  },
  legend: {
    data: ['品牌销量'],
    selectedMode: false,
    textStyle: { // 文本样式
      fontSize: 16,
      color: '#cdd3ee'
    },
    top: 13, // 定位
  },
  xAxis: {
    // 坐标轴刻度标签
    name: '销售额',
    splitLine: {
      show: true // 是否显示分隔线。默认数值轴显示
    },
    axisLine: { // 是否显示坐标轴轴线 默认显示
      show: true, // 是否显示坐标轴轴线 默认显示
      lineStyle: { // 坐标轴线线的颜色
        color: '#6e7079'
      }
    },
    axisTick: {
      show: false // 是否显示坐标轴刻度 默认显示
    },
    axisLabel: {
      show: true, // 是否显示刻度标签 默认显示
      // fontSize: 16, // 文字的字体大小
      // color: '#cdd3ee', // 刻度标签文字的颜色
      // 使用字符串模板，模板变量为刻度默认标签 {value}
      formatter: '{value}元'
    },
  },
  yAxis: {
    name: "品牌名称",
    type: "category",
    axisTick: {
      show: false // 是否显示坐标轴刻度 默认显示
    },
    axisLine: { // 是否显示坐标轴轴线 默认显示
      symbol: ['none', 'arrow'],
      show: true, // 是否显示坐标轴轴线 默认显示
      lineStyle: { // 坐标轴线线的颜色
        color: '#6e7079'
      }
    },

    axisLabel: {
      type: 'value',
      show: true, // 是否显示刻度标签 默认显示
      // fontSize: 16, // 文字的字体大小
      // color: '#cdd3ee', // 刻度标签文字的颜色
      // 使用字符串模板，模板变量为刻度默认标签 {value}
      formatter: '{value}'
    },
    splitLine: {
      show: false // 是否显示分隔线。默认数值轴显示
    },
    data: []
  },
  series: [{
    name: '品牌销量',
    type: 'bar',
    stack: '总量',
    barMaxWidth: 20, // 柱条的最大宽度，不设时自适应
    label: {
      show: true,
      // 标签的位置 left right bottom top inside  // 绝对的像素值 position: [10, 10]
      // 相对的百分比 position: ['50%', '50%']
      position: 'inside',
      formatter: '',
      textStyle: {
        fontWeight: "bolder",
        fontSize: '12',
        color: "#333333"
      }
    },
    itemStyle: {
      normal: {
        barBorderRadius: [0, 12, 12, 0], // （顺时针左上，右上，右下，左下）
      }
    },
    data: []
  },
    {
      name: '总数',    // 总数显示，生成一个总数的柱状图，将颜色设为透明，
      type: 'bar',     // label将位置设备内部底部，造成一个总数显示在
      stack: '总量',    // 柱状图上方的假象
      barMaxWidth: 20, // 柱条的最大宽度，不设时自适应
      label: {
        show: true,
        // 标签的位置 left right bottom top inside  // 绝对的像素值 position: [10, 10]
        // 相对的百分比 position: ['50%', '50%']
        position: 'insideLeft',
        formatter: function (value) {
          return charts_three_dataRatio.value[value.dataIndex]
        },
        textStyle: {
          fontWeight: "bolder",
          fontSize: '12',
          color: "#333333"
        }
      },
      itemStyle: {
        normal: {
          color: 'rgba(128, 128, 128, 0)'      // 柱状图颜色设为透明
        }
      },
      data: []
    }
  ]
})
/**图四的基本配置*/
const chart_four_Option = ref({
  color: ['#ffab9c'],
  grid: {
    x: 60, // 左间距
    y: 80, // 上间距
    x2: 60, // 右间距
    y2: 40, // 下间距
    containLabel: true // grid 区域是否包含坐标轴的刻度标签, 常用于『防止标签溢出』的场景
  },
  tooltip: {
    trigger: 'axis', // 触发类型, axis: 坐标轴触发
    axisPointer: {
      // 指示器类型  'line' 直线指示器 'shadow' 阴影指示器 'none' 无指示器
      // 'cross' 十字准星指示器 其实是种简写，表示启用两个正交的轴的 axisPointer
      type: 'shadow',
      shadowStyle: {
        color: 'rgba(254, 198, 185, 0.2)',
        width: '1'
      }
    },
    textStyle: {
      // color: '#cdd3ee' // 文字颜色
    },
    // // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式 折线（区域）图、柱状（条形）图、K线图
    // // {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
    formatter: '{b}<br />{a0}: {c0}元'
  },
  dataZoom: [                 //Y轴滑动条
    {
      type: 'slider', //滑动条
      show: false,      //开启
      yAxisIndex: [0],
      right: '93%',  //滑动条位置
      start: 1,    //初始化时，滑动条宽度开始标度
      end: 10,
      maxSpan: 10,
    },   //初始化时，滑动条宽度结束标度 //y轴内置滑动
    {
      type: 'inside',  //内置滑动，随鼠标滚轮展示
      show: false,
      yAxisIndex: [0],
      start: 1,//初始化时，滑动条宽度开始标度  end: 50  //初始化时，滑动条宽度结束标度　　　　　　　　　　　
    }
  ],
  title: {
    text: '动销单品占比'
  },
  legend: {
    selectedMode: false,
    data: ['单品销量'],
    textStyle: { // 文本样式
      fontSize: 16,
      color: '#cdd3ee'
    },
    top: 13, // 定位
  },
  xAxis: {
    name: '销售额',
    // 坐标轴刻度标签
    splitLine: {
      show: true // 是否显示分隔线。默认数值轴显示
    },
    axisLine: { // 是否显示坐标轴轴线 默认显示
      show: true, // 是否显示坐标轴轴线 默认显示
      lineStyle: { // 坐标轴线线的颜色
        color: '#6e7079'
      }
    },
    axisTick: {
      show: false // 是否显示坐标轴刻度 默认显示
    },
    axisLabel: {
      show: true, // 是否显示刻度标签 默认显示
      // fontSize: 16, // 文字的字体大小
      // color: '#cdd3ee', // 刻度标签文字的颜色
      // 使用字符串模板，模板变量为刻度默认标签 {value}
      formatter: '{value}元'
    },
  },
  yAxis: {
    name: "单品名称",
    type: "category",
    axisTick: {
      show: false // 是否显示坐标轴刻度 默认显示
    },
    axisLine: { // 是否显示坐标轴轴线 默认显示
      symbol: ['none', 'arrow'],
      show: true, // 是否显示坐标轴轴线 默认显示
      lineStyle: { // 坐标轴线线的颜色
        color: '#6e7079'
      }
    },

    axisLabel: {
      type: 'value',
      show: true, // 是否显示刻度标签 默认显示
      // fontSize: 16, // 文字的字体大小
      // color: '#cdd3ee', // 刻度标签文字的颜色
      // 使用字符串模板，模板变量为刻度默认标签 {value}
      formatter: function (value) {
        if (value.length > 5) {
          return value.slice(0, 5) + "..."
        } else {
          return value
        }
      }
    },
    splitLine: {
      show: false // 是否显示分隔线。默认数值轴显示
    },
    data: []
  },
  series: [{
    name: '单品销量',
    type: 'bar',
    stack: '总量',
    barMaxWidth: 20, // 柱条的最大宽度，不设时自适应
    label: {
      show: true,
      // 标签的位置 left right bottom top inside  // 绝对的像素值 position: [10, 10]
      // 相对的百分比 position: ['50%', '50%']
      position: 'inside',
      formatter: '',
      textStyle: {
        fontWeight: "bolder",
        fontSize: '12',
        color: "#333333"
      }
    },
    itemStyle: {
      normal: {
        barBorderRadius: [0, 12, 12, 0], // （顺时针左上，右上，右下，左下）
      }
    },
    data: []
  },
    {
      name: '总数',    // 总数显示，生成一个总数的柱状图，将颜色设为透明，
      type: 'bar',     // label将位置设备内部底部，造成一个总数显示在
      stack: '总量',    // 柱状图上方的假象
      barMaxWidth: 20, // 柱条的最大宽度，不设时自适应
      label: {
        show: true,
        // 标签的位置 left right bottom top inside  // 绝对的像素值 position: [10, 10]
        // 相对的百分比 position: ['50%', '50%']
        position: 'insideLeft',
        formatter: function (value) {
          return charts_four_dataRatio.value[value.dataIndex]
        },
        textStyle: {
          fontWeight: "bolder",
          fontSize: '12',
          color: "#333333"
        }
      },
      itemStyle: {
        normal: {
          color: 'rgba(128, 128, 128, 0)'      // 柱状图颜色设为透明
        }
      },
      data: []
    }
  ]
})
const legendEvent = {
  isRegistered: true,
  callBackFunction: (param) => {
    //根据回调返回值更新总量
    updataCount(param)
    charts_one_instance.value.setOption(chart_one_Option.value, true)
  }
}
//更新总数
const updataCount = function (param) {
  Object.keys(param.selected).forEach(itemKey => {
    if (param.selected[itemKey]) {

    }
  })
}
/**下拉选项初始化*/
const innitSelectOption = () => {
  //获取品牌
  getBrandOption().then(res => {
    if (res.code == 200) {
      brandOption.value = res.data
    }
  })
// 获取品类
  getProductTypeOption().then(res => {
    if (res.code == 200) {
      productTypeOption.value = res.data
    }
  })
//  获取区域下拉
  getAreaTree({allChild: true}).then(res => {
    if (res.code == 200) {
      areaOptions.value = res.data
    }
  })

}
/**计算百分比*/
const calculateRatio = (data, totalData) => {
  if (data == 0) {
    return 0 + '%'
  } else if (data > 0 && totalData > 0) {
    return (Math.round(data / totalData * 10000).toFixed(2)) / 100 + "%";
  } else if (data < 0 && totalData < 0) {
    return "-" + (Math.round(data / totalData * 10000).toFixed(2)) / 100 + "%";
  }

}
/**echarts统计图tab切换时的回调*/
const chartTabChange = (name) => {
  switch (name) {
    case "first":
      innitDataInfo()
      break;
    case "second":
      innitDataInfo(name)
      break;
    case "third":
      innitDataInfo(name)
      break;
    case "fourth":
      innitDataInfo(name)
      break;
  }
}
/**统计图表tab切换的回调*/
const listTabChange = (name = 'fourth') => {
  switch (name) {
    case "first":
      getListInfo(name)
      break;
    case "second":
      getListInfo(name)
      break;
    case "third":
      getListInfo(name)
      break;
    case "fourth":
      getListInfo(name)
      break;
    case "five":
      getListInfo(name)
      break;
    case "six":
      getListInfo(name)
      break;
    case 'seven':
      getRegionTableList()
      break;
  }

}
/**获取tab图表的信息*/
const getListInfo = (name) => {
  let timeObject = {
    startTime: undefined,
    endTime: undefined
  }
  if (queryParams.value.betweenDates.length !== 0) {
    timeObject = {
      startTime: queryParams.value.betweenDates[0],
      endTime: queryParams.value.betweenDates[1]
    }
  }
  queryParams.value.nodeId = Array.from(new Set(queryParams.value.nodeId.flat()));
  if (name == "first") {
    saleStore.getSalesAreaTableList({...cloneFunction(queryParams.value), ...timeObject})
  }
  if (name == "second") {
    saleStore.getSalesProvinceTableList({...cloneFunction(queryParams.value), ...timeObject})
  }
  if (name == "third") {
    saleStore.getSalesCityTableList({...cloneFunction(queryParams.value), ...timeObject})
  }
  if (name == "fourth") {
    areaNameLoading.value = true
    saleStore.getSalesStoreTableList({...cloneFunction(queryParams.value), ...timeObject}).then(res => {
      areaNameLoading.value = false
    })

  }
  if (name == "five") {
    areaNameLoading.value = true
    saleStore.getSalesBrandTableList({...cloneFunction(queryParams.value), ...timeObject}).then(res => {
      areaNameLoading.value = false
    })

  }
  if (name == "six") {
    areaNameLoading.value = true
    saleStore.getSalesProductTableList({...cloneFunction(queryParams.value), ...timeObject}).then(res => {
      areaNameLoading.value = false
    })

  }
}
/**格式化看板基本统计信息的数据*/
const formatBaseInfo = (data) => {
  baseInfo.value = data
}

/**任务改变获取活动报表数据*/
const changeActive = (e) => {
  let mapActive = eventActiveSelectOptions.value.filter(item => {
    return item.eventId == e
  })
  console.log(eventActiveSelectOptions.value, mapActive)
  saleChartTaskName.value = mapActive[0].name
  let timeObject = {
    startTime: undefined,
    endTime: undefined
  }
  if (queryParams.value.betweenDates.length !== 0) {
    timeObject = {
      startTime: queryParams.value.betweenDates[0],
      endTime: queryParams.value.betweenDates[1]
    }
  }
  // 重新获取不同任务活动下的销售活动占比数据
  getActivityAndNormal({
    ...cloneFunction(queryParams.value), ...timeObject,
    eventId: selectedActive.value
  }).then(res => {
    if (res.code == 200) {
      formatSalesActiveInfo(res.data)
    }
  })

}
/**格式化销售活动占比图表的数据*/
const formatSalesActiveInfo = (data) => {
  charts_one_isNull.value = false
  //横坐标的值
  let horizontalData = data.map(item => {
    return item.day
  })
  if (horizontalData.length == 0) {
    chartLoading.value = false
    charts_one_isNull.value = true
    return null
  }
  //  活动的销售额
  let activityData = []
  // 日常的销售额
  let dailyData = []
  //  总销售额
  let totalData = []
  data.forEach(item => {
    activityData.push(item.detail.activity.toFixed(2))
    dailyData.push(item.detail.daily.toFixed(2))
    totalData.push((item.detail.daily + item.detail.activity).toFixed(2))
  })
  //  日常销售额在总销售额当中的销售占比  活动销售额在总销售额当中的销售占比
  charts_one_dataRatio.value = horizontalData.map((itemKey, index) => {
    return {
      activityRatio: calculateRatio(activityData[index], totalData[index]),
      dailyRatio: calculateRatio(dailyData[index], totalData[index])
    }
  })
  //给图表数据重新赋值，重新渲染图标
  chart_one_Option.value.xAxis[0].data = horizontalData
  chart_one_Option.value.series[0].data = activityData.map((item, index) => {
    if (dailyData[index] > 0) {
      if (item < 0) {
        return {
          value: item,
          itemStyle: {
            normal: {
              barBorderRadius: [12, 12, 0, 0], // （顺时针左上，右上，右下，左下）
            }
          }
        }
      } else {
        return {
          value: item,
        }
      }
    } else if (dailyData[index] < 0) {
      if (item > 0) {
        return {
          value: item,
          itemStyle: {
            normal: {
              barBorderRadius: [12, 12, 0, 0], // （顺时针左上，右上，右下，左下）
            }
          }
        }
      } else {
        return {
          value: item,
        }
      }
    } else if (dailyData[index] == 0) {
      if (item > 0) {
        return {
          value: item,
          itemStyle: {
            normal: {
              barBorderRadius: [12, 12, 0, 0], // （顺时针左上，右上，右下，左下）
            }
          }
        }
      } else if (item < 0) {
        return {
          value: item,
          itemStyle: {
            normal: {
              barBorderRadius: [12, 12, 0, 0], // （顺时针左上，右上，右下，左下）
            }
          }
        }
      } else if (item == 0) {
        return {
          value: item,
        }
      }
    }
  })
  chart_one_Option.value.series[1].data = dailyData.map(item => {
    if (item > 0) {
      return {
        value: item,
        itemStyle: {
          normal: {
            barBorderRadius: [12, 12, 0, 0], // （顺时针左上，右上，右下，左下）
          }
        }
      }
    } else if (item < 0) {
      return {
        value: item,
        itemStyle: {
          normal: {
            barBorderRadius: [0, 0, 12, 12], // （顺时针左上，右上，右下，左下）
          }
        }
      }
    } else if (item == 0) {
      return {
        value: item,
      }
    }
  })
  totalData = totalData.map((item, index) => {
    if (item > 0) {
      return {
        value: item,
        label: {
          normal: {
            show: true,
            position: 'insideBottom',
            formatter: '{c}元',         // 显示的总数
            textStyle: {
              color: '#333333',
              fontWeight: "bolder",
              fontSize: '12',
            }
          }
        },
      }
    } else if (item < 0) {
      return {
        value: item,
        label: {
          normal: {
            show: true,
            position: 'insideTop',
            formatter: '{c}元',         // 显示的总数
            textStyle: {
              color: '#333333',
              fontWeight: "bolder",
              fontSize: '12',
            }
          }
        },
      }
    } else if (item == 0) {
      return {
        value: item,
        label: {
          normal: {
            show: true,
            position: 'insideBottom',
            formatter: '{c}元',         // 显示的总数
            textStyle: {
              color: '#333333',
              fontWeight: "bolder",
              fontSize: '12',
            }
          }
        },
      }
    }
  })
  chart_one_Option.value.series[2].data = totalData
  nextTick(() => {
    charts_one_instance.value.setOption(chart_one_Option.value, true)
    chartLoading.value = false
  })

}
/**对象按属性值排序*/
const sortObject = (data) => {
  let result = Object.values(data).sort((a, b) => {
    return b - a;
  });
  let new_obj = {};
  for (let i = 0; i < result.length; i++) {
    Object.keys(data).map((item, index) => {
      if (data[item] === result[i]) {
        new_obj[item] = result[i];
      }
    });
  }
  return new_obj
}
/**格式化动销店铺占比的基本数据*/
const formatStoreInfo = (data) => {
  data = sortObject(data)
  charts_two_isNull.value = false
//  纵坐标的值
  let ordinatesData = []
  ordinatesData = Object.keys(data)
  if (ordinatesData.length == 0) {
    chartLoading.value = false
    charts_two_isNull.value = true
    return null
  }
//  店铺的销售额
  let storeSalesAccount = []
// 所有店铺的销售总额
  let totalStoreSalesAccount = null
  ordinatesData.forEach(itemKey => {
    storeSalesAccount.push(data[itemKey])
    totalStoreSalesAccount = totalStoreSalesAccount + data[itemKey]
  })
//  店铺总的销售占比
  let storeSalesRatio = ordinatesData.map(itemKey => {
    return calculateRatio(data[itemKey], storeSalesAccount)
  })
  chart_two_Option.value.yAxis.data = ordinatesData
  chart_two_Option.value.series[0].data = storeSalesAccount.map(item => {
    if (item > 0) {
      return {
        value: item,
        itemStyle: {
          normal: {
            barBorderRadius: [0, 12, 12, 0], // （顺时针左上，右上，右下，左下）
          }
        }
      }
    } else if (item < 0) {
      return {
        value: item,
        itemStyle: {
          normal: {
            barBorderRadius: [12, 0, 0, 12], // （顺时针左上，右上，右下，左下）
          }
        }
      }
    } else if (item == 0) {
      return {
        value: item,
      }
    }
  })
  chart_two_Option.value.series[1].data = storeSalesAccount.map(item => {
    if (item > 0) {
      return {
        value: item,
        label: {
          normal: {
            show: true,
            position: 'insideLeft',
            formatter: '{c}元',         // 显示的总数
            textStyle: {
              color: '#333333',
              fontWeight: "bolder",
              fontSize: '12',
            }
          }
        },
      }
    } else if (item < 0) {
      return {
        value: item,
        label: {
          normal: {
            show: true,
            position: 'insideRight',
            formatter: '{c}元',         // 显示的总数
            textStyle: {
              color: '#333333',
              fontWeight: "bolder",
              fontSize: '12',
            }
          }
        },
      }
    } else if (item == 0) {
      return {
        value: item,
        label: {
          normal: {
            show: true,
            position: 'insideLeft',
            formatter: '{c}元',         // 显示的总数
            textStyle: {
              color: '#333333',
              fontWeight: "bolder",
              fontSize: '12',
            }
          }
        },
      }
    }
  })
  charts_two_dataRatio.value = storeSalesRatio
  nextTick(() => {
    charts_two_instance.value.setOption(chart_two_Option.value, true)
    chartLoading.value = false
  })

}
/** 格式化动销品牌占比的基本数据*/
const formatBrandInfo = (data) => {
  data = sortObject(data)
  charts_three_isNull.value = false
//  纵坐标的值
  let ordinatesData = []
  ordinatesData = Object.keys(data)
  if (ordinatesData.length == 0) {
    chartLoading.value = false
    charts_three_isNull.value = true
    return null
  }
  //  店铺的销售额
  let brandSalesAccount = []
// 所有品牌的销售总额
  let totalBrandSalesAccount = null
  ordinatesData.forEach(itemKey => {
    brandSalesAccount.push(data[itemKey])
    totalBrandSalesAccount = totalBrandSalesAccount + data[itemKey]
  })
//  店铺总的销售占比
  let brandSalesRatio = ordinatesData.map(itemKey => {
    return calculateRatio(data[itemKey], totalBrandSalesAccount)
  })
  chart_three_Option.value.yAxis.data = ordinatesData
  chart_three_Option.value.series[0].data = brandSalesAccount
  chart_three_Option.value.series[1].data = brandSalesAccount
  charts_three_dataRatio.value = brandSalesRatio
  nextTick(() => {
    charts_three_instance.value.setOption(chart_three_Option.value, true)
    chartLoading.value = false
  })
}
/** 格式化动销单品占比图表的基本数据*/
const formatProductInfo = (data) => {
  charts_four_isNull.value = false
  data = sortObject(data)
//  纵坐标的值
  let ordinatesData = []
  ordinatesData = Object.keys(data)
  if (ordinatesData.length == 0) {
    chartLoading.value = false
    charts_four_isNull.value = true
    return null
  }
  //  单品的销售额
  let productSalesAccount = []
// 所有单品的销售总额
  let totalProductSalesAccount = null
  ordinatesData.forEach(itemKey => {
    productSalesAccount.push(data[itemKey])
    totalProductSalesAccount = totalProductSalesAccount + data[itemKey]
  })
//  单品总的销售占比
  let productSalesRatio = ordinatesData.map(itemKey => {
    return calculateRatio(data[itemKey], totalProductSalesAccount)
  })
  chart_four_Option.value.yAxis.data = ordinatesData
  chart_four_Option.value.series[0].data = productSalesAccount.map(item => {
    if (item > 0) {
      return {
        value: item,
        itemStyle: {
          normal: {
            barBorderRadius: [0, 12, 12, 0], // （顺时针左上，右上，右下，左下）
          }
        }
      }
    } else if (item < 0) {
      return {
        value: item,
        itemStyle: {
          normal: {
            barBorderRadius: [12, 0, 0, 12], // （顺时针左上，右上，右下，左下）
          }
        }
      }
    } else if (item == 0) {
      return {
        value: item,
      }
    }
  })
  chart_four_Option.value.series[1].data = productSalesAccount.map(item => {
    if (item > 0) {
      return {
        value: item,
        label: {
          normal: {
            show: true,
            position: 'insideLeft',
            formatter: '{c}元',         // 显示的总数
            textStyle: {
              color: '#333333',
              fontWeight: "bolder",
              fontSize: '12',
            }
          }
        },
      }
    } else if (item < 0) {
      return {
        value: item,
        label: {
          normal: {
            show: true,
            position: 'insideRight',
            formatter: '{c}元',         // 显示的总数
            textStyle: {
              color: '#333333',
              fontWeight: "bolder",
              fontSize: '12',
            }
          }
        },
      }
    } else if (item == 0) {
      return {
        value: item,
        label: {
          normal: {
            show: true,
            position: 'insideLeft',
            formatter: '{c}元',         // 显示的总数
            textStyle: {
              color: '#333333',
              fontWeight: "bolder",
              fontSize: '12',
            }
          }
        },
      }
    }
  })
  charts_four_dataRatio.value = productSalesRatio
  nextTick(() => {
    charts_four_instance.value.setOption(chart_four_Option.value, true)
    chartLoading.value = false
  })
}
/**看板基本信息初始化*/
const innitDataInfo = function (tags = "first") {
  let timeObject = {
    startTime: undefined,
    endTime: undefined
  }
  if (queryParams.value.betweenDates.length !== 0) {
    timeObject = {
      startTime: queryParams.value.betweenDates[0],
      endTime: queryParams.value.betweenDates[1]
    }
  }
  queryParams.value.nodeId = Array.from(new Set(queryParams.value.nodeId.flat()));
  chartLoading.value = true
  if (tags == "first") {
    //  获取看板基本统计信息
    getOrderList({...cloneFunction(queryParams.value), ...timeObject}).then(res => {
      if (res.code == 200) {
        let {brandCount, productCount, storeCount, sumAmount, sumEventAmount, events} = res.data
        if (events && events.length !== 0) {
          selectedActive.value = events[0].eventId
          saleChartTaskName.value = events[0].name
          eventActiveSelectOptions.value = cloneFunction(events)
          //  获取当前任务的echarts图表信息
          getActivityAndNormal({
            ...cloneFunction(queryParams.value), ...timeObject,
            eventId: events[0].eventId
          }).then(res => {
            if (res.code == 200) {
              formatSalesActiveInfo(res.data)
            }
          })
        } else {
          eventActiveSelectOptions.value = []
          formatSalesActiveInfo([])
        }

        let baseInfoObj = {brandCount, productCount, storeCount, sumAmount, sumEventAmount}
        formatBaseInfo(baseInfoObj)

      }
    })
  } else if (tags == "second") {
    //获取动销店铺占比的基本数据
    getStoreRatio({...cloneFunction(queryParams.value), ...timeObject}).then(res => {
      if (res.code == 200) {
        formatStoreInfo(res.data)
      }
    })

  } else if (tags == "third") {
    //获取动销品牌占比的基本数据
    getBrandRatio({...cloneFunction(queryParams.value), ...timeObject}).then(res => {
      if (res.code == 200) {
        formatBrandInfo(res.data)
      }
    })

  } else if (tags == 'fourth') {
    //获取动销单品占比的数据
    getProductRatio({...cloneFunction(queryParams.value), ...timeObject}).then(res => {
      if (res.code == 200) {
        formatProductInfo(res.data)
      }
    })
  }
}
/**获取自定义结构的列表数据*/
const getRegionTableList = () => {
  let timeObject = {
    startTime: undefined,
    endTime: undefined
  }
  if (queryParams.value.betweenDates.length !== 0) {
    timeObject = {
      startTime: queryParams.value.betweenDates[0],
      endTime: queryParams.value.betweenDates[1]
    }
  }
  treeLoading.value = true
  queryParams.value.nodeId = Array.from(new Set(queryParams.value.nodeId.flat()));
  getRegionMulti({...cloneFunction(queryParams.value), ...timeObject}).then(res => {
    if (res.code == 200) {
      regionTableList.value = res.data
      regionTableListTree.value = formatToTree(res.data)
      treeLoading.value = false
    }
  }, rej => {
    treeLoading.value = false
  })
}
/**自定义结构当中的数据格式化为树形结构*/
const formatToTree = (data) => {
  let allData = data.map(item => {
    return item.msgList
  }).flat()
  return proxy.handleTree(allData, "nodeId", "parentNodeId");
}
/**查询*/
const handleQuery = () => {
  selectedActive.value = undefined
  activeName.value = 'first'
  areaName.value = 'fourth'
  if (queryParams.value.betweenDates.length !== 0 || queryParams.value.timeRangeQuickSelection) {
    innitDataInfo()
    listTabChange()
  } else {
    proxy.$modal.msgError("请选择查询时间")
    return
  }
}
/**销售活动占比选择任务*/
const saleSelectedActive = () => {
  activeSelectInstance.value.change()
}
/**重置*/
const resetQuery = () => {
  queryParams.value = {
    state: null,
    nodeId: [],
    otherFilter: null,
    betweenDates: [],
    brand: [],
    timeRangeQuickSelection: 3
  }
  selectedActive.value = undefined
  handleQuery()
}
/**获取整个看板的基本信息*/
const innit = function () {
  innitSelectOption()
  innitDataInfo()
  listTabChange()
}
innit()
</script>
<style scoped lang="scss">
.chartTabs::v-deep(.el-tabs__nav-scroll) {
  display: flex;
  justify-content: center;
}

.saleActiveProportion {
  position: relative;
}

.saleActiveProportion::v-deep(.el-select) {
  position: absolute;
  left: 0;
  top: -10px;
}

.saleActiveProportion::v-deep(.el-icon) {
  top: 3px;
}

.saleActiveProportion::v-deep(.el-popover) {
  height: 20vh;
  overflow: auto;
}

.label::v-deep( .el-form-item__label) {
  color: #606266;
  font-weight: 600;
}

.chartShow::v-deep( .el-tabs__nav-scroll) {
  padding-bottom: 10px;
}

// 先把整体的线去掉
.chartShow::v-deep(.el-tabs--card >.el-tabs__header) {
  border: none !important;
}

// 再为tabs添加border-bottom
.chartShow::v-deep(.el-tabs__nav) {
  border: none !important;
}

.chartShow::v-deep(.el-tabs__nav-wrap)::after {
  position: static !important;
}

.chartShow ::v-deep(.el-tabs__active-bar) {
  background-color: transparent !important;
}

.chartShow::v-deep(.el-tabs__item ) {
  margin-left: 10px;
  line-height: 60px;
  border: none !important;
}

.areaStatistical::v-deep(.el-tabs--card >.el-tabs__header) {
  border: none !important;
}

// 再为tabs添加border-bottom
.areaStatistical::v-deep(.el-tabs__nav) {
  border: none !important;
}

.areaStatistical::v-deep(.el-tabs__nav-wrap)::after {
  position: static !important;
}

.areaStatistical ::v-deep(.el-tabs__active-bar) {
  background-color: transparent !important;
}

.areaStatistical::v-deep(.el-tabs__item ) {
  margin-left: 10px;
  line-height: 60px;
  border: none !important;
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

.outBox {
  display: flex;
  flex-direction: column;
  padding: 40px;

  .totalStatistics {
    margin-top: 40px;
    //display: flex;
    //flex-direction: row;
    //justify-content: space-evenly;
    border-top: 1px solid #d6dde4;
    padding-top: 20px;

    .totalItem {
      flex: 1;
      //width: 150px;
      width: 100%;
      height: 100px;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .data {
        font-weight: 400;
        font-size: 30px;
        color: #333333;
        line-height: 25px;
      }

      .title {
        font-size: 16px;
        font-weight: 500;
        color: #999999;
        line-height: 25px;
      }
    }
  }

  .chartShow {
    margin-top: 40px;
    border: 1px solid #d9dad9;
    padding: 10px;

    .demo-tabs : {


    }

    .itemChart {
      width: 90vw;
      height: 50vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .customizeTableList {
    //border: 1px solid #d9dad9;
    margin-top: 40px;
    //display: flex;
    //justify-content: space-between;

    .area {
      flex: 1;
      border: 1px solid #D6D6D6;
      text-align: center;
      //border-radius: 10px;
      overflow: hidden;
      margin: 40px 0px;
    }
  }

  .areaStatistical {
    border: 1px solid #d9dad9;
    margin-top: 20px;

    .tableList {
      height: 40vh;
    }
  }
}
</style>

