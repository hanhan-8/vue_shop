<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert title="注意：只允许为三级分类设置相关参数" type="warning" show-icon :closable="false"></el-alert>
      <span>请选择商品分类：</span>
      <el-cascader
        :options="cateList"
        :props="cateProps"
        v-model="selectedKeys"
        @change="handleChange"
        clearable
      ></el-cascader>
      <!-- 导航标签 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加参数</el-button>
          <!-- 表格部分 -->
          <el-table :data="manyTableDate" border style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand" width="50">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index" width="50"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加属性</el-button>
          <!-- 表格部分 -->
          <el-table :data="onlyTableDate" border style="width: 100%">
            <el-table-column type="expand" width="50">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index" width="50"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      activeName: "many",
      cateList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      },
      selectedKeys: [],
      // paramsList: [],
      manyTableDate: [],
      onlyTableDate: [],
      // paramsInfo: {
      //   cat_id: "",
      //   sel: this.activeName
      // }
      addDialogVisible: false,
      addForm: {
        attr_name: ""
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur"
          }
        ]
      },
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getCatList();
  },
  methods: {
    async getCatList() {
      const { data: res } = await this.$http.get("categories");
      console.log(res);
      this.cateList = res.data;
    },
    handleChange() {
      this.getParamsDate();
    },
    handleTabClick() {
      // console.log(this.activeName);
      this.getParamsDate();
    },
    // 获取参数列表数据
    async getParamsDate() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        this.manyTableDate = [];
        this.onlyTableDate = [];
        return;
      }
      // console.log(this.selectedKeys);
      const { data: res } = await this.$http.get(
        `categories/${this.catId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      // 把参数下的可选项的字符串改为数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        item.inputVisible = false;
        item.inputValue = "";
      });

      console.log(res.data);
      // this.paramsList = res.data;
      if (this.activeName === "many") {
        this.manyTableDate = res.data;
      } else {
        this.onlyTableDate = res.data;
      }
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    async deleteParams(attr_id) {
      const { data: res } = await this.$http.delete(
        `categories/${this.catId}/attributes/${attr_id}`
      );
      console.log(res);
      this.getParamsDate();
    },
    // 文本框失去焦点或按下enter都会触发
    async handleInputConfirm(row) {
      row.inputVisible = false;
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      // 发起请求，保存数据
      const { data: res } = await this.$http.put(
        `categories/${this.catId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      this.$message.success("修改参数成功");
    },
    showInput(roww) {
      roww.inputVisible = true;
      // $nextTick是当页面元素被重新渲染之后，才会执行回调函数中的代码
      // 让文本框自动获得焦点 第二个$refs是为了获取原生input对象
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
        // console.log(this.$refs);
        // console.log(this.$refs.saveTagInput);
        // console.log(this.$refs.saveTagInput.$refs);
        // console.log(this.$refs.saveTagInput.$refs.input);
        // console.log(this.$refs.saveTagInput.$refs.input.focus);
      });
    },
    // 删除参数可选项
    async handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      const { data: res } = await this.$http.put(
        `categories/${this.catId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      this.$message.success("修改参数成功");
      console.log(res);
    }
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true;
      }
      return false;
    },
    catId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2];
      }
      return null;
    },
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-alert {
  margin-bottom: 15px;
}
.el-tabs {
  margin-top: 15px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>