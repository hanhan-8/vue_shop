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
      <el-button type="primary">添加角色</el-button>
      <el-table :data="roleList" border style="width: 100%" stripe>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', index === 0 ? 'bdtop' : '','vcenter']"
              v-for="(item,index) in scope.row.children"
              :key="index"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[index2 === 0 ? '' : 'bdtop','vcenter']"
                  v-for="(item2,index2) in item.children"
                  :key="index2"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3,index3) in item2.children"
                      :key="index3"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row.children}}</pre> -->
          </template>
        </el-table-column>
        <!-- 内容 -->
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogVisible" @close="setRightClosed">
      <el-tree
        ref="treeRef"
        :data="rightList"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRight()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      dialogVisible: false,
      rightList: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      type: "tree",
      defKeys: [],
      // 当前即将分配权限的角色id,哪里有去哪里定义
      roleId: ""
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get(`roles`);
      // console.log(res);
      this.roleList = res.data;
    },
    async removeRightById(role, rightId) {
      const conmess = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (conmess !== "confirm") {
        return this.$message.error("已取消删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      console.log(res);
      // this.getRoleList();
      role.children = res.data;
    },
    async showSetDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get(`rights/${this.type}`);
      this.rightList = res.data;
      // console.log(res);
      // 通过递归获取三级节点id
      this.getLeafKeys(role, this.defKeys);
      // console.log(role);
      // console.log(this.defKeys);
      this.dialogVisible = true;
    },
    // 通过递归获取三级权限id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getLeafKeys(item, arr));
    },
    setRightClosed() {
      this.defKeys = [];
    },
    async setRight() {
      this.dialogVisible = false;
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      // console.log(keys);
      const idStr = keys.join(",");
      // console.log(idStr);

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      this.$message.success("分配权限成功");
      // console.log(res);
      this.getRoleList();
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>