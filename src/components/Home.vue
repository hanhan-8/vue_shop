<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/1.jpg" alt />
        <span>我的商店管理系统</span>
      </div>
      <el-button type="info" @click="out">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="rgb(88, 120, 132)"
          text-color="#fff"
          active-text-color="rgb(173, 221, 253)"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i class="el-icon-s-cooperation"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="'/'+subItem.path+''"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="getpath('/'+subItem.path+'')"
            >
              <template slot="title">
                <i class="el-icon-s-order"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      isCollapse: false,
      activePath: ""
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    out() {
      window.sessionStorage.clear("token");
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      this.menulist = res.data;
      // console.log(this.$http);
      // console.log(res);
      // console.log(res.data[0].children[0].authName);
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    getpath(path) {
      window.sessionStorage.setItem("activePath", path);
      this.activePath = path;
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-container {
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(83, 120, 153);
    color: #fff;
    font-size: 20px;
    div {
      img {
        height: 60px;
        width: 60px;
        border-radius: 50%;
        vertical-align: middle;
        box-shadow: 0 0 10px #ddd;
        margin-right: 10px;
      }
    }
    .el-button {
      height: 40px;
    }
  }

  .el-container {
    .el-aside {
      background-color: rgb(110, 138, 156);
      .toggle-button {
        background-color: rgb(63, 136, 158);
        font-size: 14px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
      }
      .el-menu {
        font-weight: 500;
        border-right: none;
      }
    }

    .el-main {
      background-color: rgb(203, 229, 253);
    }
  }
}
</style>