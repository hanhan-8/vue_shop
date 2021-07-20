<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="queryInfo.query"
            @keyup.enter.native="getGoodsList"
            clearable
            @clear="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
          <!-- <router-link to="/goods/add">添加商品</router-link> -->
        </el-col>
      </el-row>

      <!-- 商品表格 -->
      <el-table border :data="goodsList" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <!-- <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template> -->
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 8
      },
      goodsList: []
    };
  },
  created() {
    this.getGoodsList();
  },

  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      // console.log(res.data);
      this.goodsList = res.data.goods;
      // 格式化时间 方法一
      // for (let i = 0; i < this.goodsList.length; i++) {
      //   // console.log(this.goodsList[i].add_time);
      //   this.goodsList[i].add_time = moment(this.goodsList[i].add_time).format(
      //     "YYYY-MM-DD h:mm:ss"
      //   );
      // }
      // 格式化时间 方法二
      this.goodsList.filter(item => {
        // console.log(item);
        item.add_time = moment(item.add_time).format("YYYY-MM-DD h:mm:ss");
      });
    },
    goAddpage() {
      this.$router.push("/goods/add");
    }
  }
};
</script>

<style>
</style>