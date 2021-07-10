<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/1.jpg" alt />
      </div>
      <!-- 登录表单 -->
      <el-form
        ref="ruleForm"
        :model="loginForm"
        :rules="rules"
        label-width="0px"
        class="login_form"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-s-custom"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button @click="login" type="primary">登录</el-button>
          <el-button @click="resetForm('ruleForm')" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
      // console.log(this.$refs);
    },
    login() {
      this.$refs.ruleForm.validate(async valid => {
        // console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status !== 200)
          return this.$message.error("登录失败，请输入正确的用户名或密码");
        this.$message.success("登录成功");
        // console.log(res);
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
      // let params = this.$qs.stringify({
      //   username: this.loginForm.username,
      //   password: this.loginForm.password
      // });
      // axios({
      //   url: "http://timemeetyou.com:8889/api/private/v1/",
      //   methods: "post",
      //   params: {},
      //   headers: { "Content-Type": "application/x-www-form-urlencoded" }
      // }).then(res => {
      //   console.log(res.data);
      //   if (res.data.meta.status !== 200)
      //     return this.$message.error("登录失败");
      //   this.$message.success("登录成功");
      // });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: rgb(234, 177, 248);
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(rgb(192, 248, 252)),
    to(rgb(240, 166, 250))
  );
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 130px;
      width: 130px;
      box-shadow: 0 0 10px #ddd;
      border-radius: 100%;
      img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0 20px;
    }
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>