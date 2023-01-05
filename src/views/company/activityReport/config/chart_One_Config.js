export const chart_One_DataConfig = {
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
            type: 'shadow',
            shadowStyle: {
                color: 'rgba(255, 170, 157, 0.2)',
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
                color: '#dedede'
            }
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
        name: '销售额',
        type: 'bar',
        stack: '总量',
        itemStyle: {
            normal: {
                color: '#ffaa9d',
                barBorderRadius: [0, 8, 8, 0], // （顺时针左上，右上，右下，左下）
            }
        },
        // barWidth: 50,
        barMaxWidth: 20,
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
export const chart_One_NoneConfig = {
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
export default {
    chart_One_DataConfig,
    chart_One_NoneConfig
}