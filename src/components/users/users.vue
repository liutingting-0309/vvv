<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="queryList.query" placeholder="请输入内容" clearable @clear="getusersList">
            <el-button slot="append" icon="el-icon-search" @click="getusersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="usersList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="用户状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStatusChanged(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
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
              @click="showdeleteDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showallotdialog(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 页码区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryList.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户弹窗 -->
    <el-dialog title="添加用户信息" :visible.sync="dialogVisible" width="70%">
      <span>
        <el-form
          :model="addusersForm"
          :rules="addusersFormRules"
          ref="addusersFormRef"
          label-width="100px"
        >
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="addusersForm.username"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
            <el-input v-model="addusersForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addusersForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addusersForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canceladdusersList">取 消</el-button>
        <el-button type="primary" @click="addusersList()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户弹窗 -->
    <el-dialog title="修改用户信息" :visible.sync="editdialogVisible" width="70%">
      <span>
        <el-form
          :model="editusersForm"
          :rules="addusersFormRules"
          ref="editusersFormRef"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editusersForm.username" disabled></el-input>
          </el-form-item>
          <!-- <el-form-item label="角色名称" prop="role_id">
            <el-input v-model="editusersForm.role_id"></el-input>
          </el-form-item>-->
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editusersForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editusersForm.email"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editusersList()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="allotdialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>
          选择当前角色：
          <el-select v-model="selectedRoleId" placeholder="请选择当前角色">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/;
      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
    // 验证手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[3456789]\d{9}$/;
      if (regMobile.test(value)) {
        // 有效的手机号
        return callback();
      }
      callback(new Error("请输入正确的手机号"));
    };
    return {
      queryList: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      usersList: [],
      total: 0,
      dialogVisible: false,
      addusersForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addusersFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15个字符", trigger: "blur" }
        ],
        email: [
          { message: "请输入邮箱", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 6 到 15个字符", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { message: "请输入手机号", trigger: "blur" },
          { max: 11, message: "请输入11位号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ],
        role_id: [
          { message: "请输入管理员名称", trigger: "blur" },
          { max: 1, message: "请输入正确Id", trigger: "blur" }
        ]
      },
      editdialogVisible: false,
      editusersForm: [],
      allotdialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      selectedRoleId: ""
    };
  },
  created() {
    this.getusersList();
  },
  methods: {
    async getusersList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryList
      });
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败！");
      }
      this.usersList = res.data.users;
      this.total = res.data.total;
    },
    // 监听获取新的页面数据
    handleSizeChange(newSize) {
      this.queryList.pagesize = newSize;
      this.getusersList();
    },
    // 监听获取新的页面条数
    handleCurrentChange(newPage) {
      this.queryList.pagenum = newPage;
      this.getusersList();
    },
    // 修改用户状态
    async userStatusChanged(userinfo) {
      // console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        this.$message.error("状态修改失败！");
      }
      this.getusersList();
      this.$message.success("状态修改成功！");
    },
    // 添加用户信息
    addusersList() {
      this.$refs.addusersFormRef.validate(async valid => {
        if (!valid) return;
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post("users", this.addusersForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败！");
        }
        this.$message.success("添加用户成功！");
        this.dialogVisible = false;
        this.$refs.addusersFormRef.resetFields();
        this.getusersList();
      });
    },
    // 取消添加用户信息
    canceladdusersList() {
      this.dialogVisible = false;
      this.$refs.addusersFormRef.resetFields();
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        this.$message.error("查询用户信息失败");
      }
      this.editusersForm = res.data;
      this.editdialogVisible = true;
    },

    // 修改用户信息
    editusersList() {
      this.$refs.editusersFormRef.validate(async value => {
        if (!value) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editusersForm.id,
          {
            email: this.editusersForm.email,
            mobile: this.editusersForm.mobile
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("更新用户信息失败！");
        }
        // 关闭对话框
        this.editdialogVisible = false;
        this.getusersList();
        this.$message.success("更新用户信息成功！");
      });
    },
    // 删除用户信息
    async showdeleteDialog(id) {
      this.$confirm("此操作将永久删除该用户信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.delete("users/" + id);
          this.getusersList();
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
    // 分配权限
    async showallotdialog(userInfo) {
      this.userInfo = userInfo;

      // 在展示对话框之前，获取所有角色的列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        this.$message.error("获取角色列表失败！");
      }
      this.rolesList = res.data;
      console.log(res);
      this.allotdialogVisible = !this.allotdialogVisible;
    },
    // 点击按钮，分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        this.$message.error("请选择要分配的角色！");
      }

      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      );
      if (res.meta.status !== 200) {
        this.$message.error("更新角色失败！");
      }
      this.$message.success("更新角色成功！");
      this.getusersList();
      this.allotdialogVisible = false;
    },
    // 监听分配角色窗口关闭时，清空下拉框
    setRoleDialogClosed() {
      this.selectedRoleId = "";
      this.userInfo = {};
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
</style>