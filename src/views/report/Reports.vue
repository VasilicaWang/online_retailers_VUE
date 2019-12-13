<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb separator="/">
      <BreadcrumbItem to="/">主页</BreadcrumbItem>
      <BreadcrumbItem to="/components/breadcrumb">数据统计</BreadcrumbItem>
      <BreadcrumbItem>数据报表</BreadcrumbItem>
    </Breadcrumb>
    <!-- 绘制图表 -- echarts使用 -->
    <Card>
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 800px;height:400px;color: #fff;"></div>
    </Card>
  </div>
</template>

<script>
import { getData } from '../../api/report.js'
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data () {
    return {
      options: {
        title: {
          text: '玩家来源',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#000'
            }
          }
        },
        // 配置顶部legend字体颜色
        legend: {
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        series: [
          {
            itemStyle: {
              normal: {
                color: '#9c27b082', // 图例的icon图标颜色
                lineStyle: {
                  color: '#9c27b082' // 折线的颜色
                }
              }
            }
          },
          {
            itemStyle: {
              normal: {
                color: '#03a9f478', // 图例的icon图标颜色
                lineStyle: {
                  color: '#03a9f478' // 折线的颜色
                }
              }
            }
          },
          {
            itemStyle: {
              normal: {
                color: '#ffeb3b75', // 图例的icon图标颜色
                lineStyle: {
                  color: '#ffeb3b75' // 折线的颜色
                }
              }
            }
          },
          {
            itemStyle: {
              normal: {
                color: '#50ff5787', // 图例的icon图标颜色
                lineStyle: {
                  color: '#50ff5787' // 折线的颜色
                }
              }
            }
          },
          {
            itemStyle: {
              normal: {
                color: '#ff000070', // 图例的icon图标颜色
                lineStyle: {
                  color: '#ff000070' // 折线的颜色
                }
              }
            }
          }
        ],
        xAxis: [
          {
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#fff' // y轴的颜色
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#fff' // y轴的颜色
              }
            }
          }
        ]
      }
    }
  },
  async mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    // 指定图表的配置项和数据
    // 获取图表数据
    const { data: res } = await getData()
    console.log(res)
    const chartData = _.merge(res.data, this.options)

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(chartData)
  }
}
</script>

<style lang="less" scoped>
.ivu-card-body {
  background-color: #fff !important;
}
canvas {
  color: #fff !important;
}
</style>
