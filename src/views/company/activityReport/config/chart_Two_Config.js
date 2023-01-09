 let chart_Two_DataConfig = {
    color: ['#81AFD5'],
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
            type: 'shadow',
            shadowStyle: {
                color: 'rgba(160, 202, 236, 0.2)',
                width: '1'
            }
        },
        textStyle: {
            // color: '#cdd3ee' // 文字颜色
        },
        // // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式 折线（区域）图、柱状（条形）图、K线图
        // // {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
        // formatter: '{b}<br />{a0}:{c0}:{c1}'
        formatter: function (params, ticket, callback) {
            return params[0].name + '<br />' + "已奖励占比: " + ((-params[0].value) / (-params[2].value) * 100).toFixed(2) + "%" + '<br/>' + "已奖励金额: " + (-params[0].value) + "元"
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
                color: '#dedede'
            }
        },
        axisTick: {
            show: false // 是否显示坐标轴刻度 默认显示
        },
        axisLabel: {
            show: true, // 是否显示刻度标签 默认显示
            fontSize: 14, // 文字的字体大小
            color: '#6e7079', // 刻度标签文字的颜色
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
                color: '#dedede'
            },

        },

        axisLabel: {
            type: 'value',
            show: true, // 是否显示刻度标签 默认显示
            fontSize: 14, // 文字的字体大小
            color: '#6e7079', // 刻度标签文字的颜色
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
        name: '已奖励',
        type: 'bar',
        stack: '总量',
        // barWidth: 50,
        barMaxWidth: 20,
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
                // barBorderRadius: [8, 0, 0, 8], // （顺时针左上，右上，右下，左下）
                color: '#7fafd8'
            },
        },
        data: [0,]
    },
        {
            name: '奖励剩余',
            type: 'bar',
            stack: '总量',
            // barWidth: 50,
            barMaxWidth: 20,
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
                    color: '#81AFD5'
                }
            },
            data: []
        },
        {
            name: '总数',    // 总数显示，生成一个总数的柱状图，将颜色设为透明，
            type: 'bar',     // label将位置设备内部底部，造成一个总数显示在
            stack: '总量',    // 柱状图上方的假象
            barMaxWidth: 20,
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
 let chart_Two_NoneConfig = {
    title: {
        text: '暂无数据',
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
                color: '#dedede'
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
export  {
    chart_Two_DataConfig,
    chart_Two_NoneConfig
}