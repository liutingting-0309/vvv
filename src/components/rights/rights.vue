<template>
  <!--面包屑导航-->
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-input placeholder="请输入内容" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <template>
        <el-table :data="rightForm" style="width: 100%" stripe border>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="authName" label="权限名称"></el-table-column>
          <el-table-column prop="path" label="路径"></el-table-column>
          <el-table-column prop="level" label="权限层级">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level == 0">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.level == 1">二级</el-tag>
              <el-tag type="warning" v-else>三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightForm: []
    };
  },
  created() {
    this.getrightsForm();
  },
  methods: {
    async getrightsForm() {
      const { data: res } = await this.$http.get("rights/list");

      if (res.meta.status !== 200) {
        this.$message.error("获取权限列表失败!");
      }
      this.rightForm = res.data;
      this.$message.success("获取权限列表成功！");
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