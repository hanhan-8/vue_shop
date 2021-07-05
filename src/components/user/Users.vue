<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 内容区域 -->
    <el-card>
      <el-row :gutter="40">
        <el-col :span="8">
          <el-input
            clearable
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @keyup.enter.native="getUserList"
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userList" border>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormref" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormref" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      formLabelWidth: "120px",
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [{ required: true, message: "请输入手机号码", trigger: "blur" }]
      },
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [{ required: true, message: "请输入手机号码", trigger: "blur" }]
      },
      editForm: {}
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      // console.log(res);
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    async userStateChanged(userInfo) {
      console.log(userInfo);
      console.log(userInfo.mg_state);
      await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
      // userInfo.mg_state = !userInfo.mg_state; 请求失败需要此操作
      this.$message.success("用户更新状态成功");
    },
    addDialogClose() {
      this.$refs.addFormref.resetFields();
    },
    addUser() {
      this.$refs.addFormref.validate(async valid => {
        // console.log(valid);
        if (!valid) return;
        // 预校验成功可以发送真正的请求
        const { data: res } = await this.$http.post("users", this.addForm);
        // console.log(res);
        // if (res.meta.status !== 201) {
        //   return this.$message.success("添加用户失败！");
        // }
        if (res.meta.status == 400) {
          return this.$message.success("用户名已存在！");
        }
        this.$message.success("添加用户成功！");
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    editDialogClose() {
      this.$refs.editFormref.resetFields();
    },
    async showEditDialog(id) {
      // console.log(editUser);
      const { data: res } = await this.$http.get(`users/${id}`);
      // console.log(res);
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editUserInfo() {
      this.$refs.editFormref.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          this.editForm
        );
        console.log(this.editForm);
        this.editDialogVisible = false;
        this.getUserList();
        this.$message.success("更新用户成功");
      });
    },
    async removeUserById(id) {
      const confirmMessage = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmMessage !== "confirm") {
        return this.$message.error("已取消删除");
      }
      const { data: res } = await this.$http.delete(`users/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getUserList();
    }
  }
};
</script>

<style lang="less" scoped>
</style>