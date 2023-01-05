export default {
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
                color: 'rgba(153, 153, 153, 0.2)',
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
        name: '销售额（元）',
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
        name: "单品名称",
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
        barMaxWidth: 55, // 柱条的最大宽度，不设时自适应
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
            barMaxWidth: 55, // 柱条的最大宽度，不设时自适应
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
}