<template>
  <div class="outBox" v-loading="loading">
    <div class="desc">
      <span>激励活动报表 —— 对激励活动所产生的数据做基础的统计和分析</span>
    </div>
    <!--    搜索条件-->
    <div class="serachParams">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item class="label" label="任务时间">
          <el-date-picker
              style="width: 300px;"
              v-model="queryParams.betweenDate"
              type="daterange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD hh:mm:ss"
          />
        </el-form-item>
        <el-form-item class="label" label="区域">
          <el-cascader style="width: 300px;" placeholder="请选择区域" :collapse-tags="true" :options="options"
                       :props="props"
                       clearable/>
        </el-form-item>
        <el-form-item class="label" label="条件查询">
          <el-input style="width: 300px;" v-model="queryParams.otherFilter"
                    placeholder="请输入任务名/编号/商品名/商品ID/品牌"></el-input>
        </el-form-item>
        <el-form-item class="label" label="任务状态">
          <el-select style="width: 300px;" v-model="queryParams.state" placeholder="请选择任务状态" clearable>
            <el-option v-for="(item,key) in statusOption" :key="key" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item class="label" label="时间范围">
          <el-select style="width: 300px;" v-model="queryParams.timeRangeQuickSelection"
                     placeholder="请选择要查看的区域" clearable>
            <el-option v-for="(item,key) in fastSelectDate" :key="key" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item class="label" label=" ">
          <div style="width: 300px;">
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="statistic">
      <el-row>
        <el-col :span="4">
          <div class="totalItem">
            <div class="data">{{ reportTotalNumber.eventNumber }}</div>
            <div class="title">当前活动</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="totalItem">
            <div class="data">{{ reportTotalNumber.storeNumber }}</div>
            <div class="title">参与店铺</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="totalItem">
            <div class="data">{{ reportTotalNumber.userNumber }}</div>
            <div class="title">参与人次</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="totalItem">
            <div class="data">{{ reportTotalNumber.saleAmount }}</div>
            <div class="title">销售额(元)</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="totalItem">
            <div class="data">{{ reportTotalNumber.totalPrizePool }}</div>
            <div class="title">合计奖池(元)</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="totalItem">
            <div class="data">{{ reportTotalNumber.awardMoney }}</div>
            <div class="title">累计发放(元)</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--    图形统计-->
    <div class="barChart">
      <div class="chart chart_two">
        <scaleChart ref="chart_two_ref" :dataOption="chart_two_data"></scaleChart>
      </div>
      <div class="chart chart_one">
        <scaleChart ref="chart_one_ref" :dataOption="chart_one_data"></scaleChart>
      </div>

      <!--      <div class="chart chart_three">-->
      <!--        <scaleChart ref="chart_three_ref" :dataOption="chart_three_data"></scaleChart>-->
      <!--      </div>-->
    </div>
    <!--    区域销售列表展示-->
    <div class="areaMarket">
      <div v-for="(item,index) in store.activityReportAreaList" :key="index" class="allArea area">
        <vxe-table
            align="center"
            height="600px"
            class="mytable-scrollbar"
            :data="item.saleList">
          <vxe-column type="seq" title="序号" width="60"></vxe-column>
          <vxe-column field="name" title="名称"></vxe-column>
          <vxe-column field="saleAmount" title="销售额">
            <template #default="{row}">
              <span>{{ row.saleAmount }}元</span>
            </template>
          </vxe-column>
        </vxe-table>
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
            <pagevxeContent :listName="'activityReportList'" :storeConfig="contentTableActivityReportBrand"
                            :contentTableConfig="storeBrandTableConfig">
              <template #salesAmountSlot="{row}">
                <div>
                  {{ row.salesAmount }}元
                </div>
              </template>
              <template #yearOnYearSlot="{row}">
                <div>
                  {{ row.yearOnYear }}
                  <span v-if="Number(row.yearOnYear.split('%')[0])>0">
                          <el-icon size="18px" color="green"><Top/></el-icon>
                      </span>
                  <span v-else>
                        <el-icon size="18px" color="red"><Bottom/></el-icon>
                      </span>

                </div>
              </template>
              <template #monthOnMonthSlot="{row}">
                <div>
                  {{ row.monthOnMonth }}
                  <span v-if="Number(row.monthOnMonth.split('%')[0])>0">
                          <el-icon size="18px" color="green"><Top/></el-icon>
                      </span>
                  <span v-else>
                        <el-icon size="18px" color="red"><Bottom/></el-icon>
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
            <pagevxeContent :listName="'activityReportList'" :storeConfig="contentTableActivityReportProduct"
                            :contentTableConfig="storeProductTableConfig">
              <template #salesAmountSlot="{row}">
                <div>
                  {{ row.salesAmount }}元
                </div>
              </template>
              <template #yearOnYearSlot="{row}">
                <div>
                  {{ row.yearOnYear }}
                  <span v-if="Number(row.yearOnYear.split('%')[0])>0">
                          <el-icon size="18px" color="green"><Top/></el-icon>
                      </span>
                  <span v-else>
                        <el-icon size="18px" color="red"><Bottom/></el-icon>
                      </span>

                </div>
              </template>
              <template #monthOnMonthSlot="{row}">
                <div>
                  {{ row.monthOnMonth }}
                  <span v-if="Number(row.monthOnMonth.split('%')[0])>0">
                          <el-icon size="18px" color="green"><Top/></el-icon>
                      </span>
                  <span v-else>
                        <el-icon size="18px" color="red"><Bottom/></el-icon>
                      </span>
                </div>
              </template>
            </pagevxeContent>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!--      奖励列表-->
    <div>
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
import {getCurrentInstance, nextTick, reactive, toRefs} from "vue";
import pagevxeContent from "@/components/page-vxeContent/page-vxeContent.vue";
import {
  allAreaTableConfig,
  storeBrandTableConfig,
  storeProductTableConfig
} from './config/allAreaConfig.js'
import {
  contentTableActivityReport,
  contentTableActivityReportBrand,
  contentTableActivityReportProduct
} from './config/storeConfig.js'
import {getActivityReportNumbers, getSalesHistogram, getAreaTree, getRegionSaleInfo} from '@/api/activityReport.js'
import scaleChart from "@/components/scale-Chart/scale-Chart.vue"
import useActivityReportStore from "@/store/modules/Company/activityReport.js";

/**echarts实例*/
let chart_one_ref = ref()
let chart_two_ref = ref()
let chart_three_ref = ref()
let loading = ref()
const salesBrand = ref('first')
const salesSingle = ref('first')
const rewardType = ref('first')
const rewardInfo = ref('first')
let store = useActivityReportStore()
/**首页看板统计值*/
const reportTotalNumber = ref({
  awardMoney: '',
  eventNumber: '',
  saleAmount: '',
  storeNumber: '',
  totalPrizePool: '',
  userNumber: ''
})
//区域级联下拉
let props = ref({multiple: true, label: 'name', value: 'id'})
let options = ref([])
const size = {
  width: '90vw',
  height: '40vh'
}
//下拉状态选项
const statusOption = [
  {
    label: "全部",
    value: 100
  },
  {
    label: '进行中',
    value: 5
  },
  {
    label: '已完成',
    value: 10
  }
]
const data = reactive({
  form: {},
  queryParams: {
    state: undefined,
    nodeId: [],
    otherFilter: undefined,
    betweenDate: [],
    timeRangeQuickSelection: ''
  },
})
const {queryParams} = toRefs(data);
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
  {
    label: "所有",
    value: 4
  },


])
/**图形一配置*/
let chart_one_data = {
  color: ['#8fd5f3'],
  // grid: {
  //   x: 60, // 左间距
  //   y: 80, // 上间距
  //   x2: 60, // 右间距
  //   y2: 40, // 下间距
  //   containLabel: true // grid 区域是否包含坐标轴的刻度标签, 常用于『防止标签溢出』的场景
  // },
  tooltip: {
    trigger: 'axis', // 触发类型, axis: 坐标轴触发
    axisPointer: {
      // 指示器类型  'line' 直线指示器 'shadow' 阴影指示器 'none' 无指示器
      // 'cross' 十字准星指示器 其实是种简写，表示启用两个正交的轴的 axisPointer
      type: 'shadow'
    },
    textStyle: {
      // color: '#cdd3ee' // 文字颜色
    },
    // // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式 折线（区域）图、柱状（条形）图、K线图
    // // {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
    formatter: '{b}<br />{a0}: {c0}元'
  },
  dataZoom: [
    {
      type: 'slider',
      show: false,
      yAxisIndex: [0],
      left: '93%',
      start: 1,
      end: 100
    },
    {
      type: 'inside',
      show: false,
      yAxisIndex: [0],
      start: 1,
    }
  ],
  title: {
    text: '销售额',
    padding: [20, 20, 100, 100],
  },
  // legend: {
  //   data: ['销量']
  // },
  xAxis: {
    min: 1,
    logBase: 10,
    type: 'log',
    // name: "销售额",
    nameLocation: 'end',
    nameGap: 60,
    nameTextStyle: {
      fontSize: 18,
      color: "#282828"
    },
    // 坐标轴刻度标签
    splitLine: {
      show: false // 是否显示分隔线。默认数值轴显示
    },
    axisLine: { // 是否显示坐标轴轴线 默认显示
      // symbol: ['none', 'arrow'],
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
      fontSize: 14, // 文字的字体大小
      // color: '#cdd3ee', // 刻度标签文字的颜色
      // 使用字符串模板，模板变量为刻度默认标签 {value}
      formatter: function (value) {
        if (value >= 10000) {
          return (value / 10000) + "万"
        } else if (value < 10000 && value > 1) {
          return value + "元"
        } else if (value == 1) {
          return 0
        }
      }
    },
  },
  yAxis: {
    type: "category",
    show: true,
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
      fontSize: 14, // 文字的字体大小
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
    name: '销售额',
    type: 'bar',
    stack: '总量',
    itemStyle: {
      normal: {
        color: '#ffaa9f',
        barBorderRadius: [0, 8, 8, 0], // （顺时针左上，右上，右下，左下）
      }
    },
    // barWidth: 50,
    barMaxWidth: 40,
    label: {
      show: true,
      // 标签的位置 left right bottom top inside  // 绝对的像素值 position: [10, 10]
      // 相对的百分比 position: ['50%', '50%']
      position: 'right',
      formatter: function (value) {
        if (value.data < 10000) {
          return value.data + '元'
        } else {
          return (value.data / 10000).toFixed(2) + '万元'
        }
      },

      textStyle: {
        // fontWeight: "bolder",
        fontSize: '14',
        color: "#000"
      }
    },
    data: []
  },
  ]
}
const chart_one_data_none = {
  title: {
    text: '暂无销售数据',
    x: 'center',
    y: 'center',
    textStyle: {
      color: '#606266',
      fontWeight: 'normal',
      fontSize: 20,
    }
  },
  xAxis: {
    show: false,
    min: 1,
    logBase: 10,
    type: 'log',
    name: "销售额",
    nameLocation: 'end',
    nameGap: 60,
    nameTextStyle: {
      fontSize: 18,
      color: "#282828"
    },
    // 坐标轴刻度标签
    splitLine: {
      show: false // 是否显示分隔线。默认数值轴显示
    },
    axisLine: { // 是否显示坐标轴轴线 默认显示
      // symbol: ['none', 'arrow'],
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
      fontSize: 14, // 文字的字体大小
      // color: '#cdd3ee', // 刻度标签文字的颜色
      // 使用字符串模板，模板变量为刻度默认标签 {value}
      formatter: function (value) {
        if (value >= 10000) {
          return (value / 10000) + "万"
        } else if (value < 10000 && value > 1) {
          return value + "元"
        } else if (value == 1) {
          return 0
        }
      }
    },
  },
  yAxis: {
    type: "category",
    show: false,
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
      fontSize: 14, // 文字的字体大小
      // color: '#cdd3ee', // 刻度标签文字的颜色
      // 使用字符串模板，模板变量为刻度默认标签 {value}
      formatter: '{value}'
    },
    splitLine: {
      show: false // 是否显示分隔线。默认数值轴显示
    },
    data: []
  },
}
const chart_two_data_none = {
  title: {
    text: '暂无奖励数据',
    x: 'center',
    y: 'center',
    textStyle: {
      color: '#606266',
      fontWeight: 'normal',
      fontSize: 20,
    }
  },
  xAxis: {
    show: false,
    min: 1,
    logBase: 10,
    type: 'log',
    name: "销售额",
    nameLocation: 'end',
    nameGap: 60,
    nameTextStyle: {
      fontSize: 18,
      color: "#282828"
    },
    // 坐标轴刻度标签
    splitLine: {
      show: false // 是否显示分隔线。默认数值轴显示
    },
    axisLine: { // 是否显示坐标轴轴线 默认显示
      // symbol: ['none', 'arrow'],
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
      fontSize: 14, // 文字的字体大小
      // color: '#cdd3ee', // 刻度标签文字的颜色
      // 使用字符串模板，模板变量为刻度默认标签 {value}
      formatter: function (value) {
        if (value >= 10000) {
          return (value / 10000) + "万"
        } else if (value < 10000 && value > 1) {
          return value + "元"
        } else if (value == 1) {
          return 0
        }
      }
    },
  },
  yAxis: {
    type: "category",
    show: false,
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
      fontSize: 14, // 文字的字体大小
      // color: '#cdd3ee', // 刻度标签文字的颜色
      // 使用字符串模板，模板变量为刻度默认标签 {value}
      formatter: '{value}'
    },
    splitLine: {
      show: false // 是否显示分隔线。默认数值轴显示
    },
    data: []
  },
}
/**图形二配置*/
let chart_two_data = {
  color: ['#8fd5f3'],
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
  // grid: {
  //   x: 60, // 左间距
  //   y: 80, // 上间距
  //   x2: 60, // 右间距
  //   y2: 40, // 下间距
  //   containLabel: true // grid 区域是否包含坐标轴的刻度标签, 常用于『防止标签溢出』的场景
  // },
  tooltip: {
    trigger: 'axis', // 触发类型, axis: 坐标轴触发
    axisPointer: {
      // 指示器类型  'line' 直线指示器 'shadow' 阴影指示器 'none' 无指示器
      // 'cross' 十字准星指示器 其实是种简写，表示启用两个正交的轴的 axisPointer
      type: 'shadow'
    },
    textStyle: {
      // color: '#cdd3ee' // 文字颜色
    },
    // // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式 折线（区域）图、柱状（条形）图、K线图
    // // {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
    // formatter: '{b}<br />{a0}:{c0}:{c1}'
    formatter: function (params, ticket, callback) {
      return params[0].name + '<br />' + "已奖励占比: " + (-params[0].value) / (-params[2].value) + "%" + '<br/>' + "已奖励金额: " + (-params[0].value) + "元"
    }
  },
  title: {
    text: '奖励',
    x: 'right',
    padding: [20, 100, 20, 100],
  },
  legend: {
    data: ['奖励']
  },
  xAxis: {
    // name: "奖金",
    nameLocation: 'start',
    nameGap: 60,
    nameTextStyle: {
      fontSize: 18,
      color: "#282828"
    },
    show: true,
    // 坐标轴刻度标签
    // inverse
    splitLine: {
      show: false // 是否显示分隔线。默认数值轴显示
    },
    axisLine: { // 是否显示坐标轴轴线 默认显示
      // symbol: ['arrow', 'none'],
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
      fontSize: 14, // 文字的字体大小
      // color: '#cdd3ee', // 刻度标签文字的颜色
      // 使用字符串模板，模板变量为刻度默认标签 {value}
      formatter: function (value) {
        if (value < 0 && -value < 10000) {
          return -value + "元"
        } else if (value < 0 && -value >= 10000) {
          return (-value) / 10000 + "万"
        } else {
          return 0
        }
      }
    },
  },
  yAxis: {
    type: "category",
    position: 'right',
    show: true,
    axisTick: {
      show: false // 是否显示坐标轴刻度 默认显示
    },
    nameTextStyle: {
      fontSize: 18,
      color: "#282828",
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
      fontSize: 14, // 文字的字体大小
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
    name: '已奖励',
    type: 'bar',
    stack: '总量',
    // barWidth: 50,
    barMaxWidth: 40,
    label: {
      show: true,
      // 标签的位置 left right bottom top inside  // 绝对的像素值 position: [10, 10]
      // 相对的百分比 position: ['50%', '50%']
      position: 'left',
      formatter: function (value) { //把数据也转换成正数用的是负负为正，下面data里的数据就要是负数，如果需要负数把这段formatter删掉
        return ''
      },
      textStyle: {
        fontSize: '14',
        color: "#000"
      }
    },
    itemStyle: {
      normal: {
        barBorderRadius: [8, 0, 0, 8], // （顺时针左上，右上，右下，左下）
        color: '#82aed4'
      }
    },
    data: []
  },
    {
      name: '奖励剩余',
      type: 'bar',
      stack: '总量',
      // barWidth: 50,
      barMaxWidth: 40,
      label: {
        show: true,
        // 标签的位置 left right bottom top inside  // 绝对的像素值 position: [10, 10]
        // 相对的百分比 position: ['50%', '50%']
        position: 'insideRight',
        formatter: function (value) { //把数据也转换成正数用的是负负为正，下面data里的数据就要是负数，如果需要负数把这段formatter删掉
          return ''
        },
        // formatter: function (params) {//设置显示的数据
        //   return percentageData.value[params.dataIndex]
        // },
        textStyle: {
          fontSize: '14',
          color: "#000"
        }
      },
      itemStyle: {
        normal: {
          barBorderRadius: [8, 0, 0, 8], // （顺时针左上，右上，右下，左下）
          color: '#d3dae1'
        }
      },
      data: []
    },
    {
      name: '总数',    // 总数显示，生成一个总数的柱状图，将颜色设为透明，
      type: 'bar',     // label将位置设备内部底部，造成一个总数显示在
      stack: '总量',    // 柱状图上方的假象
      barMaxWidth: 40,
      label: {
        normal: {
          show: true,
          position: 'insideRight',
          formatter: function (value) { //把数据也转换成正数用的是负负为正，下面data里的数据就要是负数，如果需要负数把这段formatter删掉
            if (value.data < 0) {
              return -value.data + "元"
            } else {
              return value.data + "元"
            }
          },
          textStyle: {color: '#000'}
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
}
/**图形三配置*/
const chart_three_data = {
  title: {
    text: '奖励/销售额'
  },
  tooltip: {
    show: true,
    trigger: 'axis', // 触发类型, axis: 坐标轴触发
    axisPointer: {
      // 指示器类型  'line' 直线指示器 'shadow' 阴影指示器 'none' 无指示器
      // 'cross' 十字准星指示器 其实是种简写，表示启用两个正交的轴的 axisPointer
      type: 'shadow'
    },
    textStyle: {
      color: '#cdd3ee' // 文字颜色
    },
    formatter: function (params, ticket, callback) {
      // return params[0].name + '<br />' + "已奖励占比: " + (-params[0].value) / (-params[2].value) + "%"
      return "???2222"
    }
  },
  // dataZoom: [                 //Y轴滑动条
  //   {
  //     type: 'slider', //滑动条
  //     show: false,      //开启
  //     yAxisIndex: [0],
  //     right: '93%',  //滑动条位置
  //     start: 1,    //初始化时，滑动条宽度开始标度
  //     end: 100
  //   },   //初始化时，滑动条宽度结束标度 //y轴内置滑动
  //   {
  //     type: 'inside',  //内置滑动，随鼠标滚轮展示
  //     show: false,
  //     yAxisIndex: [0],
  //     start: 0,//初始化时，滑动条宽度开始标度  end: 50  //初始化时，滑动条宽度结束标度　　　　　　　　　　　
  //   }
  // ],
  xAxis: [
    {
      show: true,
      type: 'value',  //这里x轴类型设置为value
      formatter: function (params) {
        if (params < 0) {
          return -params
        } else {
          return params
        }
      },
      splitLine: {
        show: false // 是否显示分隔线。默认数值轴显示
      },
      axisLine: { // 是否显示坐标轴轴线 默认显示
        // symbol: ['arrow', 'none'],
        show: true, // 是否显示坐标轴轴线 默认显示
        lineStyle: { // 坐标轴线线的颜色
          color: '#6e7079'
        }
      },
    }
  ],
  yAxis: [
    {
      type: 'category',  //这里y轴类型设置为category
      axisTick: {show: false},
      axisLine: { // 是否显示坐标轴轴线 默认显示
        // symbol: ['none', 'arrow'],
        show: true, // 是否显示坐标轴轴线 默认显示
        lineStyle: { // 坐标轴线线的颜色
          color: '#6e7079'
        }
      },
      axisLabel: {
        type: 'value',
        show: false, // 是否显示刻度标签 默认显示
        // fontSize: 16, // 文字的字体大小
        // color: '#cdd3ee', // 刻度标签文字的颜色
        // 使用字符串模板，模板变量为刻度默认标签 {value}
        formatter: '{value}'
      },
      splitLine: {
        show: false // 是否显示分隔线。默认数值轴显示
      },
      data: []
    }
  ],
  series: [
    {
      barMaxWidth: 40,
      type: 'bar',
      stack: '总量',  //注意这里也要添加，要不然对不齐
      label: {
        normal: {
          show: true,
          position: 'right',
          formatter: function (params) {
            // return Math.abs(params.value)
            return params.value + "元"
          }  //返回绝对值
        }
      },
      itemStyle: {
        normal: {
          barBorderRadius: [0, 8, 8, 0], // （顺时针左上，右上，右下，左下）
          color: '#fdac9c'
        }
      },
      data: [],
    },
    {
      barMaxWidth: 40,
      type: 'bar',
      stack: '总量',  //注意这里也要添加，要不然对不齐
      label: {
        normal: {
          show: true,
          position: 'left',
          formatter: function (params) {
            return Math.abs(params.value)
            // return ''
          }  //返回绝对值
        }
      },
      itemStyle: {
        normal: {
          color: '#82add8'
        }
      },

      data: [],
    },
    {
      barMaxWidth: 40,
      type: 'bar',
      stack: '总量',  //注意这里也要添加，要不然对不齐
      label: {
        normal: {
          show: false,
          formatter: function (params) {
            // return Math.abs(params.value)
            return ''
          }  //返回绝对值
        }
      },
      itemStyle: {
        normal: {
          barBorderRadius: [8, 0, 0, 8], // （顺时针左上，右上，右下，左下）
          color: '#dbd9dc'
        }
      },
      data: [],
    }
  ]


}

/** 搜索按钮操作 */
function handleQuery() {
  getList();
}
;

function getList() {
  loading.value = true
  let timeObject = {
    startTime: undefined,
    endTime: undefined
  }
  if (queryParams.value.betweenDate.length !== 0) {
    timeObject = {
      startTime: queryParams.value.betweenDate[0],
      endTime: queryParams.value.betweenDate[1]
    }
  }
  /**获取首页的数字*/
  getActivityReportNumbers({...queryParams.value, ...timeObject}).then(res => {
    if (res.code == 200) {
      reportTotalNumber.value = Object.assign(reportTotalNumber.value, res.data)
    }
  })
  /**获取统计图数据*/
  getSalesHistogram({...queryParams.value, ...timeObject}).then(res => {
    if (res.code == 200) {
      if (res.data.length !== 0) {
        innitBarChartData(res.data)
      } else {
        chart_one_data = chart_one_data_none
        chart_two_data = chart_two_data_none
        nextTick(() => {
          chart_one_ref.value.setOption(chart_one_data, true)
          chart_two_ref.value.setOption(chart_two_data, true)
          loading.value = false
        })
      }
    }
  })
  /**获取品牌销量 */
  store.getActivityReportBrandList({...queryParams.value, ...timeObject})
//  获取单品销量
  store.getActivityReportProductList({...queryParams.value, ...timeObject})
//获取区域销售情况
  store.getActivityReportAreaList({...queryParams.value, ...timeObject})
}

let percentageData = ref([])

/**遍历初始化条形统计图展示数据 */
function innitBarChartData(data) {
  //已发放奖金
  let awardAmountArray = []
  //未发放奖励
  let remainingAwardAmountArray = []
  //  任务名称
  let eventNameArray = []
  //  发放比例
  let percentageArray = []
  //  总任务奖金
  let prizePoolArray = []
  //  总销售额
  let saleAmountArray = []
  data.forEach(item => {
    awardAmountArray.push(-item.awardAmount)
    remainingAwardAmountArray.push(-(item.prizePool - item.awardAmount))
    eventNameArray.push(item.eventName)
    percentageArray.push(item.percentage)
    prizePoolArray.push(-item.prizePool)
    saleAmountArray.push(item.saleAmount)
  })
  percentageData.value = percentageArray
  chart_one_data.yAxis.data = eventNameArray
  chart_two_data.yAxis.data = eventNameArray
  // chart_three_data.yAxis.data = eventNameArray
  chart_one_data.series[0].data = saleAmountArray
  // chart_one_data.series[1].data = saleAmountArray
  chart_two_data.series[0].data = awardAmountArray
  chart_two_data.series[1].data = remainingAwardAmountArray
  chart_two_data.series[2].data = prizePoolArray
  //图三
  // chart_three_data.series[0].data = saleAmountArray
  // chart_three_data.series[1].data = awardAmountArray
  // chart_three_data.series[2].data = remainingAwardAmountArray
  nextTick(() => {
    chart_one_ref.value.setOption(chart_one_data, true)
    chart_two_ref.value.setOption(chart_two_data, true)
    // chart_three_ref.value.setOption(chart_three_data, true)
    loading.value = false
  })
}

/**下拉选项初始化*/
function innitSelectOption() {
// 获取区域下拉统计
  getAreaTree({allChild: true}).then(res => {
    if (res.code == 200) {
      options.value = res.data
    }
  })
  getList()
}

innitSelectOption()
</script>
<style scoped lang="scss">
.label::v-deep( .el-form-item__label) {
  color: #606266;
  font-weight: 600;
  width: 70px;
  justify-content: flex-start !important;
}

.outBox::v-deep(.el-loading-spinner) {
  height: 20vh;
  margin-top: 10vh;
}

//选中时样式设置
.rewardList::v-deep(.el-tabs--card>.el-tabs__header .el-tabs__item.is-active) {
  background-color: #ff5940;
  color: #fffeff;
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
  border-left: 1px solid #c9cacf !important;
  margin-left: 10px;
  font-size: 16px;
  font-weight: 800;
  color: #ff5940;
}

//选中时样式设置
.salesBrandAndSingle::v-deep(.el-tabs--card>.el-tabs__header .el-tabs__item.is-active) {
  background-color: #ff5940;
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
  font-size: 16px;
  font-weight: 800;
  color: #ff5940;
}


//vxe-table
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

//===

.outBox {
  display: flex;
  flex-direction: column;
  padding: 20px;

  .desc {
    color: #999;
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    margin-bottom: 30px;
  }

  .statistic {
    margin: 20px 10px;
    border-top: 2px solid #d6dde4;
    padding-top: 20px;

    .totalItem {
      flex: 1;
      width: 150px;
      height: 100px;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .data {
        color: #474747;
        font-weight: 800;
        font-size: 20px;
      }

      .title {
        margin-top: 5px;
        color: #999999;
        font-weight: 600;
        font-size: 16px;
      }
    }
  }

  .barChart {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 20px 10px;
    border: 2px solid #d9dad9;
    background-color: #fafafc;
    border-radius: 8px;

    .chart_two {
      border-right: 2px solid #d9dad9;
    }

    .chart {
      flex: 1;
      //margin: 0 10px;
      height: 750px;
      text-align: center;
    }


  }

  .areaMarket {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

    .area {
      flex: 1;
      border: 2px solid #d9dad9;
      text-align: center;
      border-radius: 5px;
      margin: 0 10px;
    }
  }

  .salesBrandAndSingle {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: space-between;

    .sales {
      flex: 1;
      margin: 0 10px;
      border: 2px solid #d9dad9;
      border-radius: 5px;
    }
  }

  .rewardList {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: space-between;

    .listInfo {
      flex: 1;
      margin: 0 10px;
      border-radius: 5px;

    }


  }
}

</style>


