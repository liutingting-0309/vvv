<template>
  <div>
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 角色列表区域 -->
    <el-card>
      <el-button type="primary" @click="addrolesdialogVisible= true">添加角色</el-button>
      <!-- 表单区域 -->
      <template>
        <el-table :data="rolesList" style="width: 100%" stripe border>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row
                v-for="(item1,idx1) in scope.row.children"
                :key="idx1"
                :class="['bdbottom',idx1 === 0?'bdtop':'','vcenter']"
              >
                <!-- 一级权限 -->
                <el-col :span="5">
                  <el-tag
                    type="primary"
                    closable
                    @close="removeRightById(scope.row,item1.id)"
                  >{{ item1.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级、三级权限 -->
                <el-col :span="18">
                  <el-row
                    v-for="(item2,idx2) in item1.children"
                    :key="idx2"
                    :class="[ idx2 === 0?'':'bdtop','vcenter' ]"
                  >
                    <el-col :span="7">
                      <el-tag
                        type="warning"
                        closable
                        @close="removeRightById(scope.row,item2.id)"
                      >{{ item2.authName }}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="17">
                      <el-tag
                        type="success"
                        v-for="(item3,idx3) in item2.children"
                        :key="idx3"
                        closable
                        @close="removeRightById(scope.row,item3.id)"
                      >{{item3.authName }}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column prop="date" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showeditrolesform(scope.row.id)"
              >编辑</el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleterolelist(scope.row.id)"
              >删除</el-button>
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRightDialog(scope.row)"
              >分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addrolesdialogVisible"
      width="50%"
      :before-close="resetaddroleList"
    >
      <el-form ref="addrolesListRef" :model="addrolesList" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="addrolesList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addrolesList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetaddroleList">取 消</el-button>
        <el-button type="primary" @click="addroleList">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色信息 -->
    <el-dialog title="修改角色" :visible.sync="editrolesdialogVisible" width="50%">
      <el-form ref="editrolesListRef" :model="editroleList" label-width="80px">
        <el-form-item label="角色ID">
          <el-input v-model="editroleList.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="editroleList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editroleList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editrolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edittingroleList">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog
      title="提示"
      :visible.sync="SetRightDialogVisible"
      width="50%"
      @close="handlesetRightsClose"
    >
      <el-tree
        :data="setRightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-checked-keys="defKeys"
        default-expand-all
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allowRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addrolesList: {
        roleName: "",
        roleDesc: ""
      },
      addrolesdialogVisible: false,
      editrolesdialogVisible: false,
      editroleList: [],
      SetRightDialogVisible: false,
      setRightList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children"
      },
      defKeys: [],
      roleId: ""
    };
  },
  created() {
    this.getrolesList();
  },
  methods: {
    //获取角色列表
    async getrolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        this.$message.error("获取角色列表失败！");
      }
      this.rolesList = res.data;
    },
    // 添加角色
    async addroleList() {
      const { data: res } = await this.$http.post("roles", {
        roleName: this.addrolesList.roleName,
        roleDesc: this.addrolesList.roleDesc
      });
      if (res.meta.status !== 201) {
        this.$message.error("添加角色失败！");
      } else {
        this.$message.success("添加角色成功！");
        this.$refs.addrolesListRef.resetFields();
        this.addrolesdialogVisible = false;
        this.getrolesList();
      }
    },
    // 取消添加角色,清空输入框
    resetaddroleList() {
      this.addrolesdialogVisible = false;
      //   此处存在bug,清空不了表单内容
      this.$refs.addrolesListRef.resetFields();
    },
    // 显示编辑框，获取角色数据
    async showeditrolesform(id) {
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) {
        this.$message.error("获取角色数据失败！");
      } else {
        this.editroleList = res.data;
        this.editrolesdialogVisible = true;
      }
    },
    // 编辑角色
    async edittingroleList() {
      // const {data:res} = await this.$http.put('roles/'+this.editroleList.roleId,{
      //     roleName:this.editroleList.roleName,
      //     roleDesc:this.editroleList.roleDesc
      // })
      const { data: res } = await this.$http.put(
        "roles/" + this.editroleList.roleId,
        this.editroleList
      );
      if (res.meta.status !== 200) {
        this.$message.error("修改角色信息失败！");
      } else {
        this.$message.success("修改角色信息成功！");
        this.editrolesdialogVisible = false;
        this.getrolesList();
      }
    },
    // 删除角色信息（点击删除后，没有立即刷新列表,函数前加async）
    async deleterolelist(id) {
      this.$confirm("此操作将永久删除该角色信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.delete("roles/" + id);
          this.getrolesList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 根据Id删除对应的权限标签
    async removeRightById(role, rightId) {
      // 弹窗提示用户是否要测试
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(() => {});
      if (confirmResult !== "confirm") {
        this.$message.info("已取消删除！");
      }
      // console.log('确认删除！')
      const { data: res } = await this.$http.delete(
        "roles/" + role.id + "/rights/" + rightId
      );
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error("取消权限失败");
      }
      this.$message.success("取消权限成功！");

      // this.getRolesList()
      role.children = res.data;
    },
    // 分配权限
    async showSetRightDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        this.$message.error("获取权限列表失败！");
      }
      this.setRightList = res.data;
      console.log(this.setRightList);

      // 递归获取三级节点的Id
      this.getLeafKeys(role, this.defKeys);

      this.SetRightDialogVisible = true;
      // this.$message.success('获取权限列表成功！')
    },
    // 关闭分配权限列表
    handlesetRightsClose() {
      this.SetRightDialogVisible = false;
      this.defKeys = [];
    },
    //通过递归的形式，获取角色下所有三级权限ID，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      //如果当前nonde节点不包含children属性，则是三级节点
      if (!node.children) {
        arr.push(node.id);
      }
      node.children.forEach(item => this.getLeafKeys(item, arr));
    },
    //  点击为角色分配权限
    async allowRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      //  console.log(keys)
      const idStr = keys.join(",");

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        this.$message.error("分配权限失败！");
      }
      this.$message.success("分配权限成功！");
      this.getrolesList();
      this.SetRightDialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-table {
  margin-top: 20px;
}
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