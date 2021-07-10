<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 表格内容 -->
    <el-card>
      <el-table :data="rightList" border style="width: 100%" stripe>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.level === '0' ? 'primary' : (scope.row.level === '1'?'success':'warning')"
              disable-transitions
            >{{Number(scope.row.level)+1}}级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {
        type: "list"
      },
      rightList: []
    };
  },
  created() {
    this.getRightList();
  },
  methods: {
    async getRightList() {
      const { data: res } = await this.$http.get(`rights/${this.info.type}`, {
        params: this.info
      });
      console.log(res);
      this.rightList = res.data;
    }
  }
};
</script>

<style>
</style>