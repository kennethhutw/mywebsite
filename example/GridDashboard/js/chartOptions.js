var categories = ['Bedok', 'Bukit Merah', 'Geylang', 'Marine Parade', 'Outram', 'Pasir Ris', 'Queenstown', 'Sengkang', 'Tampines'];

 var PolyclinicsOption = {
         title: {
                        text: 'Polyclinics Statistics',
                        textStyle:{
                                color: 'black',
                                    fontSize: '20',
                                },
                                x:'center'
                    },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data:['Waiting Time', 'Consultation Time'],
                textStyle:{
                                color: 'black',
                                    fontSize: '20',
                                },
                                y:'bottom',
                            
            },
            calculable : true,
            xAxis : [
               {
                       type : 'value',
                        axisLabel: {
                            formatter: function (value) {
                                return (Math.abs(value)) + 'hr';
                            },
                            textStyle: {
                                color: 'black',
                                fontSize:16,
                            }                        
                        },
                        axisLine:{onZero:false}
                    }
            ],
            yAxis : [
                {
                    type : 'category',
                    axisTick : {show: false},
                    data : categories,
                    axisLabel: {
                            step: 1,
                            textStyle: {
                                color: 'black',
                                fontSize:16,
                            }                    
                        },
                        axisLine:{onZero:false}
                    
                    
                },
                {
                   type : 'category',
                    axisTick : {show: false},
                    data : categories,
                    axisLabel: {
                            step: 1,
                            textStyle: {
                                color: 'black',
                                fontSize:16,
                            }                    
                        }
                }
            ],
            series : [     
                {
                    name:'Consultation Time',
                    type:'bar',
                    stack: 'Time',
                    barWidth : 10,
                    itemStyle: {normal: {
                        label : {show: true}
                    }},
                    data:[0.3, 0.5, 0.2, 0.8, 1.8, 0.3, 0.2, 0.8, 1.1],
                     markLine : {
                        data : [
                            {type : 'max', name: 'max',itemStyle:{normal:{color:'#dc143c'}}}
                           
                        ]
                    }
                },
                {
                    name:'Waiting Time',
                    type:'bar',
                    stack: 'Time',
                    barWidth : 10,
                    itemStyle: {normal: {
                        label : {show: true, position: 'left'}
                    }},
                    data:[-2.3, -1.5, -2.9, -2, -1, -3, -2.5, -4.2, -2.1],
                     markLine : {
                        data : [
                          
                            {type : 'min', name: 'min',itemStyle:{normal:{color:'#dc143c'}}}
                           
                        ]
                    }
                }
            ]
        };

 var PieOption  = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ]
        }
    ]
};

var LineOption = {
    title: {
        text: '未来一周气温变化',
        subtext: '纯属虚构'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['最高气温','最低气温']
    },
    toolbox: {
        show: true,
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
        }
    },
    xAxis:  {
        type: 'category',
        boundaryGap: false,
        data: ['周一','周二','周三','周四','周五','周六','周日']
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value} °C'
        }
    },
    series: [
        {
            name:'最高气温',
            type:'line',
            data:[11, 11, 15, 13, 12, 13, 10],
            markPoint: {
                data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                ]
            },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'}
                ]
            }
        },
        {
            name:'最低气温',
            type:'line',
            data:[1, -2, 2, 5, 3, 2, 0],
            markPoint: {
                data: [
                    {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                ]
            },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'},
                    [{
                        symbol: 'none',
                        x: '90%',
                        yAxis: 'max'
                    }, {
                        symbol: 'circle',
                        label: {
                            normal: {
                                position: 'start',
                                formatter: '最大值'
                            }
                        },
                        type: 'max',
                        name: '最高点'
                    }]
                ]
            }
        }
    ]
};

