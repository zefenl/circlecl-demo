<template>
  <div class="container">
    <div class="top">
      <!-- 商品数量 -->
      <el-card class="box-card">
        <div class="item">
          <div class="goods"></div>
          <div class="hr"></div>
          <span>商品总数量：{{goodsCount}} 件</span>
        </div>
      </el-card>
      <!-- 订单数量 -->
      <el-card class="box-card">
        <div class="item">
          <div class="orders"></div>
          <div class="hr"></div>
          <span>订单总数量：{{orderCount}} 单</span>
        </div>
      </el-card>
      <!-- 统计 -->
      <el-card class="box-card">
        <div class="total-list">
          <div class="users">
            <div class="header">用户总数量</div>
            <div class="body">
              <p>{{users}} <span>人</span></p>
              <div class="percentage">
                <span
                  >周环比 12%<svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-arrow-up-filling"></use></svg
                ></span>
                <span
                  >日环比 12%<svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-arrow-down-filling"></use></svg
                ></span>
              </div>
            </div>
          </div>
          <div class="sales">
            <div class="header">销售总金额</div>
            <div class="body">
              <p>{{saleTotal}} <span>元</span></p>
              <div class="percentage">
                <span
                  >周环比 12%<svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-arrow-up-filling"></use></svg
                ></span>
                <span
                  >日环比 12%<svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-arrow-down-filling"></use></svg
                ></span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="bottom">
      <el-card class="box-card sale-cart">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="年度销售额统计" name="sale">
            <div class="sale"></div>
            <span class="company">单位/元</span>
          </el-tab-pane>
          <el-tab-pane label="各地区用户统计" name="users">
            <div class="users-total"></div>
            <span class="company">单位/人</span>
          </el-tab-pane>
        </el-tabs>
        <!-- 轮播图 -->
        <div class="rotation">
          <div
            class="rotation-body"
            ref="rotationRef"
            @mouseenter="pause"
            @mouseleave="start"
          >
            <div v-for="(item, i) in banner" :key="i + Math.random()">
              <div class="rotation-item">
                <span class="time ellipsis">{{ item.create_time | timeFormat(item.create_time) }}</span>
                <span class="username ellipsis">用户{{item.name}}</span>
                <span class="goods ellipsis">购买了{{item.title}}</span>
              </div>
              <div class="rotation-item">
                <span class="time ellipsis">{{ item.create_time | timeFormat(item.create_time) }}</span>
                <span class="username ellipsis">用户{{item.name}}</span>
                <span class="goods ellipsis">购买了{{item.title}}</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'Graphical',
  data () {
    return {
      // 商品统计
      goodsOption: {
        title: {
          text: '商品数量分布',
          left: 'right'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '40%',
            center: ['70%', '65%'],
            data: [
              { value: 15, name: '家居百货' },
              { value: 10, name: '礼品' },
              { value: 10, name: '玩具' },
              { value: 0, name: '办公文教' },
              { value: 0, name: '食品' },
              { value: 0, name: '运动休闲' },
              { value: 5, name: '数码电脑' },
              { value: 0, name: '家用电器' },
              { value: 0, name: '建筑建材' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      // 订单统计
      ordersOption: {
        // 标题组件
        title: {
          text: '订单状态',
          left: 'left'
        },
        // 提示框组件
        tooltip: {
          // 鼠标经过时的提示框
          trigger: 'item',
          // 格式化提示内容
          // a表示series系列图表名称
          // b表示series数据名称data里面的name
          // c表示series数据值data里面的value
          // d表示当前数据/总数据比例
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        // 控制图表
        series: [
          {
            name: '订单状态分布',
            // 图标类型
            type: 'pie',
            // 图表大小,内圈和外圈大小
            radius: [10, 70],
            // 图显示表位置
            center: ['60%', '50%'],
            // radius半径模式,area面积模式
            roseType: 'radius',
            data: [
              { value: 30, name: '待付款' },
              { value: 28, name: '待发货' },
              { value: 26, name: '待收货' },
              { value: 24, name: '待评价' },
              { value: 22, name: '已完成' },
              { value: 5, name: '已取消' }
            ]
          }
        ]
      },
      // 销售额统计
      saleOption: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          right: '10%',
          top: '5%',
          data: ['预期销售额', '实际销售额']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '0%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '预期销售额',
            type: 'line',
            stack: 'Total',
            data: [300, 232, 301, 334, 190, 530, 610, 120, 232, 181, 114, 290, 330]
          },
          {
            name: '实际销售额',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 34, 290, 330, 310, 132, 101, 134, 90, 230, 210]
          }
        ]
      },
      rotationTime: null,
      activeName: 'sale',
      banner: [],
      saleTotal: 10000,
      users: 0,
      goodsCount: 0,
      orderCount: 0
    }
  },
  created () {
    this.getECharts()
  },
  mounted () {
    // 3. 基于准备好的dom，初始化echarts实例
    const goodsChart = echarts.init(document.querySelector('.goods'))
    this.goodsOption && goodsChart.setOption(this.goodsOption)
    const ordersChart = echarts.init(document.querySelector('.orders'))
    this.ordersOption && ordersChart.setOption(this.ordersOption)
    const saleChart = echarts.init(document.querySelector('.sale'))
    this.saleOption && saleChart.setOption(this.saleOption)
    this.showUserChart()
    // 图表自适应
    window.addEventListener('resize', function () {
      saleChart.resize()
    })
    // 开启轮播定时器
    const rotationBody = document.querySelector('.rotation-body')
    const rotationItem = document.querySelectorAll('.rotation-item')
    for (let i = 0; i < rotationItem.length; i++) {
      const clone = rotationItem[i].cloneNode(true)
      rotationBody.append(clone)
    }
    // 轮播图滚动
    this.rotationTime = setInterval(this.rotationFun, 50)
  },
  beforeDestroy () {
    clearInterval(this.rotationTime)
    this.rotationTime = null
  },
  filters: {
    timeFormat (originVal) {
      const time = Date.now() - originVal
      const days = Math.floor(time / (24 * 3600 * 1000))
      const leave1 = time % (24 * 3600 * 1000)// 计算天数后剩余的毫秒数
      const hours = Math.floor(leave1 / (3600 * 1000))
      const leave2 = leave1 % (3600 * 1000)// 计算小时数后剩余的毫秒数
      const minutes = Math.floor(leave2 / (60 * 1000))
      const leave3 = leave2 % (60 * 1000)// 计算分钟数后剩余的毫秒数
      const seconds = Math.round(leave3 / 1000)
      if (days > 0) {
        return days + '天前'
      } else if (hours) {
        return hours + '小时前'
      } else if (minutes) {
        return minutes + '分钟前'
      } else {
        return seconds + '秒前'
      }
    }
  },
  methods: {
    // 获取数据
    async getECharts () {
      const { data } = await this.$http.get('/manage/echarts')
      if (data.code !== 0) return this.$message.error('获取图表数据失败')
      this.goodsOption.series.data = data.result.goods
      this.saleOption.series.data = data.result.orders
      this.banner = data.result.banner
      this.users = data.result.users
      this.saleTotal = data.result.totalPay
      this.goodsCount = data.result.goods.reduce((p, c) => p + c.value, 0)
      this.orderCount = data.result.orders.reduce((p, c) => p + c.value, 0)
    },
    // 定时器轮播图
    rotationFun () {
      this.$refs.rotationRef.style.top = this.$refs.rotationRef.offsetTop - 1 + 'px'
      if (this.$refs.rotationRef.offsetTop <= -400) {
        this.$refs.rotationRef.style.top = '0px'
      }
    },
    // 显示用户图表
    showUserChart () {
      const usersChart = echarts.init(document.querySelector('.users-total'))
      // 列表x轴的对象
      const dataAxis = ['北\n京', '天\n津', '上\n海', '重\n庆', '新\n疆 ', '西\n藏', '宁\n夏', '内\n蒙\n古', '广\n西', '黑\n龙\n江', '吉\n林', '辽\n宁', '河\n北', '山\n东', '江\n苏', '安\n徽', '浙\n江', '福\n建', '广\n东', '海\n南', '云\n南', '贵\n州', '四\n川', '湖\n南', '湖\n北', '河\n南', '山\n西', '陕\n西', '青\n海', '江\n西', '台\n湾', '香\n港', '澳\n门']
      // 列表数据对象
      const data = [100, 210, 224, 553, 342, 633, 642, 220, 182, 191, 234, 235, 632, 352, 290, 330, 290, 330, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220]
      // 配置对象
      const userOption = {
        xAxis: {
          data: dataAxis,
          axisLabel: {
            inside: true,
            color: '#fff'
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999'
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          {
            type: 'bar',
            showBackground: true,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' }
                ])
              }
            },
            data: data
          }
        ]
      }
      const zoomSize = 6
      // 单击放大
      usersChart.on('click', function (params) {
        usersChart.dispatchAction({
          type: 'dataZoom',
          startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
          endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
        })
      })
      // 双击缩小
      usersChart.on('dblclick', function (params) {
        usersChart.dispatchAction({
          type: 'dataZoom',
          startValue: dataAxis[0],
          endValue: dataAxis[data.length - 1]
        })
      })
      // 初始化对象
      userOption && usersChart.setOption(userOption)
      window.addEventListener('resize', function () {
        usersChart.resize()
      })
    },
    // 暂停轮播图
    pause () {
      clearInterval(this.rotationTime)
      this.rotationTime = null
    },
    // 重新启动轮播图
    start () {
      clearInterval(this.rotationTime)
      this.rotationTime = setInterval(this.rotationFun, 50)
    },
    // 切换tab栏
    handleClick (tab, event) {
      if (this.activeName === 'users') {
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 单行文字换行
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.box-card {
  width: 450px;
  box-sizing: border-box;
}
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.hr {
  border-top: 1px solid #e8e8e8;
  margin: 10px 0;
}
// 右上角总统计
.total-list {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .users {
    border-bottom: 1px solid #ccc;
  }
  .sale {
    margin-top: 20px;
  }
  .body {
    height: 100px;
    display: flex;
    justify-content: space-around;
    p {
      font-size: 30px;
    }
    span {
      font-size: 14px;
      color: #aaa;
    }
    .percentage {
      display: flex;
      align-items: center;
      align-content: space-around;
      justify-content: space-evenly;
      flex-direction: column;
    }
  }
}
// 上方三个小表样式
.top {
  height: 300px;
  width: 100%;
  min-width: 1250px;
  display: flex;
  justify-content: space-around;
  .goods {
    width: 400px;
    height: 210px;
  }
  .orders {
    width: 400px;
    height: 210px;
  }
}
// 下方图表和滚动轮播图
.bottom {
  display: flex;
  justify-content: space-between;
  .sale-cart {
    position: relative;
    margin-top: 20px;
    height: 500px;
    width: 100%;
    // 销售额单位
    .company {
      position: absolute;
      left: 6%;
      font-size: 14px;
      top: 7%;
    }
    // 控制左右两列
    /deep/.el-card__body {
      display: flex !important;
      justify-content: space-between !important;
    }
    .sale,
    .users-total {
      height: 400px;
      width: 800px;
      min-width: 500px;
    }
    @media screen and (max-width: 1180px) {
      .sale,
      .users-total {
        width: 400px;
      }
    }
    .rotation {
      height: 450px;
      min-width: 400px;
      overflow: hidden;
      position: relative;
      margin-top: 10px;
      .rotation-body {
        position: absolute;
        left: 0;
        top: 0px;
        width: 100%;
      }
      .rotation-item {
        display: flex;
        justify-content: space-around;
        text-align: center;
        height: 40px;
        width: 100%;
        line-height: 40px;
        .username,
        .time {
          flex: 1;
        }
        .goods {
          flex: 2;
        }
        &:hover {
          background-color: #f2f1f6;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
