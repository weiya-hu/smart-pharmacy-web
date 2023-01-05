export default {
    title: {
        text: '销售活动占比'
    },
    color: ['#e4e4e6', '#ffab9c'],
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
                color: 'rgba(153, 153, 153, 0.2)',
                width: '1'
            }
        },

        textStyle: {
            // color: '#cdd3ee' // 文字颜色
        },
        // // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式 折线（区域）图、柱状（条形）图、K线图
        // // {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
        formatter: function (value) {
            return value[0].name + '<br />' + "活动销售额: " + value[0].data + '元' + '<br/>' + "日常销售额: " + value[1].data.value + "元" + '<br/>' + "销售总额: " + value[2].data.value + "元" + '<br/>' + "日常占比:" + charts_one_dataRatio.value[value[0].dataIndex].dailyRatio + '<br/>' + "活动占比:" + charts_one_dataRatio.value[value[0].dataIndex].activityRatio
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
            barMaxWidth: 55, // 柱条的最大宽度，不设时自适应
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
            barMaxWidth: 55, // 柱条的最大宽度，不设时自适应
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

            itemStyle: {
                normal: {
                    barBorderRadius: [12, 12, 0, 0], // （顺时针左上，右上，右下，左下）
                }
            },
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
}