<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-button type="primary" @click="addCate">添加分类</el-button>

      <!-- 表格 -->
      <!-- <el-table :data="catList" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column label="是否有效">
          <el-button type="success" icon="el-icon-check" circle size="mini"></el-button>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.cat_level === '0' ? 'primary' : (scope.row.cat_level === '1'?'success':'warning')"
              disable-transitions
            >{{Number(scope.row.cat_level)+1}}级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </el-table-column>
      </el-table>-->
      <tree-table
        class="treeTable"
        :data="catList"
        :columns="columns"
        :border="true"
        :selectionType="false"
        :expandType="false"
        :showIndex="true"
      >
        <template slot="isok" scope="scope">
          <i
            :style="scope.row.cat_deleted==='true' ? 'color:lightgreen' :'color:red'"
            :class="scope.row.cat_deleted==='true' ? 'el-icon-success':'el-icon-error'"
          ></i>
        </template>
        <template slot="order" scope="scope">
          <!-- <el-tag
            :type="scope.row.cat_level === '0' ? 'primary' : (scope.row.cat_level === '1' ? 'success' : 'warning')"
            disable-transitions
          >{{Number(scope.row.cat_level)+1}}级</el-tag>-->
          <el-tag type="primary" size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-if="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="pageInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateVisible" width="50%" @close="addCateDialogClosed">
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            :options="options"
            expand-trigger="hover"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="conAddCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catList: [],
      pageInfo: {
        pagenum: 1,
        pagesize: 5
      },
      type: [2],
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok"
        },
        {
          prop: "cat_level",
          label: "排序",
          type: "template",
          template: "order"
        },

        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      addCateVisible: false,
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      // 级联选择器分类列表
      options: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true
      },
      // 选中的父级分类的ID数组
      selectedKeys: []
    };
  },
  created() {
    this.getCatList();
  },
  methods: {
    async getCatList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.pageInfo
      });
      // console.log(res);
      this.catList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize;
      this.getCatList();
    },
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage;
      this.getCatList();
    },
    addCate() {
      this.getParentCateList();
      this.addCateVisible = true;
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.type
      });
      console.log(res);
      console.log(res.data);
      this.options = res.data;
    },
    parentCateChanged() {
      console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    async conAddCate() {
      const { data: res } = await this.$http.post(
        "categories",
        this.addCateForm
      );
      console.log(res);
      this.addCateVisible = false;
      this.getCatList();
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
    }
  }
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>