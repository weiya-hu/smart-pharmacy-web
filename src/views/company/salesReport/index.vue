<template>
  <div class="outBox">
    <!--    搜索区域-->
    <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
      <el-form-item label="任务时间" prop="name">
        <el-date-picker v-model="queryParams.betweenDates" type="daterange" clearable @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-form-item label="快捷时间" prop="name">
          <el-radio-group v-model="queryParams.fastTime">
            <el-radio :label="1">昨日</el-radio>
            <el-radio :label="2">本周</el-radio>
            <el-radio :label="3">本月</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="区域" prop="name">
          <el-select v-model="queryParams.regionFilter" placeholder="请选择要查看的区域" clearable>
            <el-option label="大区" value="shanghai"/>
            <el-option label="片区" value="beijing"/>
          </el-select>
        </el-form-item>
        <el-form-item label="品类" prop="name">
          <el-select v-model="queryParams.productTypeFilter" placeholder="请选择要查看的品类" clearable>
            <el-option v-for="(item,index) in productTypeOption" :key="index" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="name">
          <el-select v-model="queryParams.brandFilter" placeholder="请选择要查看的品牌" clearable>
            <el-option v-for="(item,index) in brandOption" :key="index" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字" prop="name">
          <el-input v-model="queryParams.keyWords" placeholder="请输入商品名称|商品ID"></el-input>
        </el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--    总数统计-->
    <div class="totalStatistics">
      <div class="totalItem">
        <div>销售总额(元)</div>
        <div>500000</div>
      </div>
      <div class="totalItem">
        <div>激励活动销售额(元)</div>
        <div>320000</div>
      </div>

      <div class="totalItem">
        <div>动销店铺(家)</div>
        <div>2323</div>
      </div>
      <div class="totalItem">
        <div>动销品牌(个)</div>
        <div>1532</div>
      </div>
      <div class="totalItem">
        <div>动销商品(个/套)</div>
        <div>328.30</div>
      </div>

    </div>
    <!--    统计图展示-->
    <div class="chartShow">
      <el-tabs
          v-model="activeName"
          type="card"
          class="demo-tabs"
      >
        <el-tab-pane label="销售活动占比" name="first">
          <div class="itemChart">
            <scaleChart ref="charts_one_instance" :registeredLegendEvent="legendEvent" :dataOption="chart_one_Option">
            </scaleChart>
          </div>
        </el-tab-pane>
        <el-tab-pane label="动销店铺占比" name="second">
          <div class="itemChart">
            <columnChart :size="twoChartSize" :dataOption="chart_two_Option"></columnChart>
          </div>
        </el-tab-pane>
        <el-tab-pane label="动销品牌占比" name="third">
          <!--          <columnChart></columnChart>-->
        </el-tab-pane>
        <el-tab-pane label="动销单品占比" name="fourth">
          <!--          <columnChart></columnChart>-->
        </el-tab-pane>
      </el-tabs>

    </div>
    <!--    区域统计表-->
    <div class="areaStatistical">
      <el-tabs
          v-model="areaName"
          type="card"
          class="demo-tabs"
          @tab-click="handleClick"
      >
        <el-tab-pane label="地区" name="first">
          <div class="tableList">
            <pagevxeContent :contentTableConfig="allAreaTableConfig"
                            :storeConfig="contentTableSalesReport"></pagevxeContent>
          </div>
        </el-tab-pane>
        <el-tab-pane label="省级片区" name="second">
          <div class="tableList">
            <pagevxeContent :contentTableConfig="allAreaTableConfig"
                            :storeConfig="contentTableSalesReport"></pagevxeContent>
          </div>
        </el-tab-pane>
        <el-tab-pane label="市级片区" name="third">
          <div class="tableList">
            <pagevxeContent :contentTableConfig="allAreaTableConfig"
                            :storeConfig="contentTableSalesReport"></pagevxeContent>
          </div>
        </el-tab-pane>
        <el-tab-pane label="门店激励" name="fourth">
          <div class="tableList">
            <pagevxeContent :contentTableConfig="allAreaTableConfig"
                            :storeConfig="contentTableSalesReport"></pagevxeContent>
          </div>
        </el-tab-pane>
        <el-tab-pane label="品牌" name="five">
          <div class="tableList">
            <pagevxeContent :contentTableConfig="allAreaTableConfig"
                            :storeConfig="contentTableSalesReport"></pagevxeContent>
          </div>
        </el-tab-pane>
        <el-tab-pane label="单品" name="six">
          <div class="tableList">
            <pagevxeContent :contentTableConfig="allAreaTableConfig"
                            :storeConfig="contentTableSalesReport"></pagevxeContent>
          </div>
        </el-tab-pane>
      </el-tabs>


    </div>

  </div>
</template>

<script setup>
import {reactive, toRefs} from "vue";
import {contentTableSalesReport} from '@/views/Company/salesReport/config/storeConfig.js'
import {allAreaTableConfig} from '@/views/Company/salesReport/config/allAreaConfig.js'
import {
  getBrandOption,
  getProductTypeOption,
} from "@/api/activeTask/taskBI.js"
import scaleChart from '@/components/scale-Chart/scale-Chart.vue'
import * as echarts from "echarts";
import columnChart from "@/components/column-Chart/column-Chart.vue"
import pagevxeContent from "@/components/page-vxeContent/page-vxeContent.vue";

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    betweenDates: [],
    fastTime: 1,
    regionFilter: [],
    productTypeFilter: [],
    brandFilter: [],
    keyWords: '',
  }
});
//tabs
let activeName = ref('first')
let areaName = ref('first')
//品牌选项
let brandOption = ref([])
//品类选项
let productTypeOption = ref([])
const {queryParams} = toRefs(data)
//比例图一
const charts_one_instance = ref()
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
//图一基本配置
const chart_one_Option = ref({
  color: ['#e4e4e6', '#ffab9c'],
  // 设置图表的位置
  grid: {
    x: 60, // 左间距
    y: 80, // 上间距
    x2: 60, // 右间距
    y2: 40, // 下间距
    containLabel: true // grid 区域是否包含坐标轴的刻度标签, 常用于『防止标签溢出』的场景
  },
  // 提示框组件
  tooltip: {
    trigger: 'axis', // 触发类型, axis: 坐标轴触发
    axisPointer: {
      // 指示器类型  'line' 直线指示器 'shadow' 阴影指示器 'none' 无指示器
      // 'cross' 十字准星指示器 其实是种简写，表示启用两个正交的轴的 axisPointer
      type: 'shadow'
    },

    textStyle: {
      color: '#cdd3ee' // 文字颜色
    },
    // // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式 折线（区域）图、柱状（条形）图、K线图
    // // {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
    formatter: '{b}日<br />{a0}: {c0}%<br />{a1}: {c1}%<br />'
  },
  // 图例组件
  legend: {
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
        formatter: '{value}日'
      },
      // 类目数据，在类目轴（type: 'category'）中有效
      data: ['6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7', '6.8', '6.9']
    }
  ],
  // 系列列表
  series: [
    {
      type: 'bar', // 系列类型
      name: '活动', // 系列名称, 用于tooltip的显示, legend 的图例筛选
      // 数据堆叠，同个类目轴上系列配置相同的stack值后，后一个系列的值会在前一个系列的值上相加
      stack: '总量',
      barMaxWidth: 55, // 柱条的最大宽度，不设时自适应
      // 图形上的文本标签
      label: {
        show: true,
        // 标签的位置 left right bottom top inside  // 绝对的像素值 position: [10, 10]
        // 相对的百分比 position: ['50%', '50%']
        position: 'inside',
        formatter: '{a}:{c}%',
        textStyle: {
          fontWeight: "bolder",
          fontSize: '12',
          color: "#fff"
        }
      },

      data: [40, 70, 80, 90, 55, 70] // 系列中的数据内容数组
    },
    {
      type: 'bar', // 系列类型
      name: '日常', // 系列名称, 用于tooltip的显示, legend 的图例筛选
      // 数据堆叠，同个类目轴上系列配置相同的stack值后，后一个系列的值会在前一个系列的值上相加
      stack: '总量',
      barMaxWidth: 55, // 柱条的最大宽度，不设时自适应
      // 图形上的文本标签
      label: {
        show: true,
        // 标签的位置 left right bottom top inside  // 绝对的像素值 position: [10, 10]
        // 相对的百分比
        position: 'inside',
        formatter: '{a}:{c}%',
        textStyle: {
          fontWeight: "bolder",
          fontSize: '12',
          color: "#fff"
        }
      },

      itemStyle: {
        normal: {
          barBorderRadius: [12, 12, 0, 0], // （顺时针左上，右上，右下，左下）
        }
      },
      data: [60, 30, 20, 10, 45, 30] // 系列中的数据内容数组
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
          textStyle: {color: '#000'}
        }
      },
      itemStyle: {
        normal: {
          color: 'rgba(128, 128, 128, 0)'      // 柱状图颜色设为透明
        }
      },
      data: ["20", '30', "40", "50", "60", "70"]
    }
  ]
})
//比例图二
const twoChartSize = {
  width: '90vw',
  height: '50vh'
}
const chart_two_Option = {
      color: ['#8fd5f3'],
      grid: {
        x: 60, // 左间距
        y: 80, // 上间距
        x2: 60, // 右间距
        y2: 40, // 下间距
        containLabel: true // grid 区域是否包含坐标轴的刻度标签, 常用于『防止标签溢出』的场景
      },
      // tooltip: {
      //   trigger: 'axis', // 触发类型, axis: 坐标轴触发
      //   axisPointer: {
      //     // 指示器类型  'line' 直线指示器 'shadow' 阴影指示器 'none' 无指示器
      //     // 'cross' 十字准星指示器 其实是种简写，表示启用两个正交的轴的 axisPointer
      //     type: 'none'
      //   },
      //   textStyle: {
      //     color: '#cdd3ee' // 文字颜色
      //   },
      //   // // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式 折线（区域）图、柱状（条形）图、K线图
      //   // // {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
      //   formatter: '{b}<br />{a0}: {c0}%'
      // },
      title: {
        text: '销售额'
      },
      legend: {
        data: ['销量']
      },
      xAxis: {
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
          formatter: '{value}'
        },
      },
      yAxis: {
        type: "category",
        axisTick: {
          show: false // 是否显示坐标轴刻度 默认显示
        },
        axisLine: { // 是否显示坐标轴轴线 默认显示
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
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
      },
      series: [{
        name: '销量',
        type: 'bar',
        stack: '总量',
        label: {
          show: true,
          // 标签的位置 left right bottom top inside  // 绝对的像素值 position: [10, 10]
          // 相对的百分比 position: ['50%', '50%']
          position: 'inside',
          formatter: '{c}',
          textStyle: {
            fontWeight: "bolder",
            fontSize: '12',
            color: "#fff"
          }
        },
        data: [5, 20, 36, 10, 10, 20]
      },
        {
          name: '总数',    // 总数显示，生成一个总数的柱状图，将颜色设为透明，
          type: 'bar',     // label将位置设备内部底部，造成一个总数显示在
          stack: '总量',    // 柱状图上方的假象
          label: {
            normal: {
              show: true,
              position: 'insideLeft',
              formatter: '{c}元',         // 显示的总数
              textStyle: {color: '#000'}
            }
          },
          itemStyle: {
            normal: {
              color: 'rgba(128, 128, 128, 0)'      // 柱状图颜色设为透明
            }
          },

          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    }
;
//下拉选项初始化
const innitSelectOption = function () {
  getBrandOption().then(res => {
    if (res.code == 200) {
      brandOption.value = res.data
    }
  })
  getProductTypeOption().then(res => {
    if (res.code == 200) {
      productTypeOption.value = res.data
    }
  })
}
// innitSelectOption()
</script>

<style scoped lang="scss">
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

.outBox {
  display: flex;
  flex-direction: column;
  padding: 40px;

  .totalStatistics {
    margin-top: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

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

  .chartShow {
    margin-top: 40px;
    border: 1px solid #d9dad9;
    padding: 10px;

    .itemChart {
      width: 90vw;
      height: 50vh;
    }
  }

  .areaStatistical {
    border: 1px solid #d9dad9;
    margin-top: 40px;

    .tableList {
      height: 40vh;
    }
  }
}
</style>

