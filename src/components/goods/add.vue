<template>
    <div>
<!--        面包屑区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片区域-->
       <el-card>
           <el-alert
                   title="添加商品信息"
                   type="info"
                   center
                   show-icon :closable="false">
           </el-alert>
<!--           步骤条区域-->
           <el-steps :space="200" :active="1" finish-status="success" align-center>
               <el-step title="基本信息"></el-step>
               <el-step title="商品参数"></el-step>
               <el-step title="商品属性"></el-step>
               <el-step title="商品图片"></el-step>
               <el-step title="商品内容"></el-step>
               <el-step title="完成"></el-step>
           </el-steps>
<!--           表单区域-->
           <el-tabs :tab-position="tabPosition" style="height: 200px;">
               <el-tab-pane label="基本信息">基本信息</el-tab-pane>
               <el-tab-pane label="商品参数">商品参数</el-tab-pane>
               <el-tab-pane label="商品属性">商品属性</el-tab-pane>
               <el-tab-pane label="商品图片">商品图片</el-tab-pane>
               <el-tab-pane label="商品内容">商品内容</el-tab-pane>
           </el-tabs>
       </el-card>
    </div>
</template>

<script>
    export default {
        data(){
          return {
              tabPosition: 'left',
          }
        },
        created() {
        },
        methods:{},
    }
</script>

<style lang="less" scoped>
.el-card{
    margin-top:15px;
}
.el-steps{
    margin-top:18px;
}
.el-tabs{
    margin-top:20px;
}

</style>