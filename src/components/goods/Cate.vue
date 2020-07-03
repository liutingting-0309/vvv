<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加按钮 -->
      <el-button type="primary">添加分类</el-button>

      <!--表格区域  -->
      <!-- <el-table :data="tableData" style="width: 100%"> -->
      <el-table  style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="date" label="分类名称" width="180"></el-table-column>
        <el-table-column prop="name" label="是否有效" width="180"></el-table-column>
        <el-table-column prop="address" label="排序"></el-table-column>
        <el-table-column prop="address" label="操作">

        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
</style>