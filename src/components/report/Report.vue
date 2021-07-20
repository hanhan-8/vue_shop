<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- echarts -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  },
  created() {
    // this.getReportList();
  },
  async mounted() {
    var myChart = echarts.init(document.getElementById("main"));
    const { data: res } = await this.$http.get("reports/type/1");
    // console.log(res);
    // console.log(res.data.series[0].areaStyle.normal);
    res.data.series.forEach(item => {
      // console.log(item.areaStyle.normal);
      delete item.areaStyle.normal;
    });
    // myChart.setOption(res.data);
    // myChart.setOption(this.options);
    const result = Object.assign(this.options, res.data);
    // console.log(result);

    myChart.setOption(result);
  },
  methods: {
    // async getReportList() {
    //   const { data: res } = await this.$http.get("reports/type/1");
    //   console.log(res);
    // }
  }
};
</script>

<style lang="less" scoped>
</style>