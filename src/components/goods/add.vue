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
           <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
               <el-step title="基本信息"></el-step>
               <el-step title="商品参数"></el-step>
               <el-step title="商品属性"></el-step>
               <el-step title="商品图片"></el-step>
               <el-step title="商品内容"></el-step>
               <el-step title="完成"></el-step>
           </el-steps>
<!--           表单区域-->
           <el-form ref="form" :model="AddForm" :rules="addGoodsRules" label-width="80px" :label-position="'top'">
           <el-tabs v-model="activeIndex" :tab-position="tabPosition" style="height: 200px;" >
               <el-tab-pane label="基本信息"name="0">
                   <el-form-item label="商品名称" prop="goods_name">
                       <el-input v-model="AddForm.goods_name"></el-input>
                   </el-form-item>
                   <el-form-item label="分类列表" prop="goods_cat">
                       <el-input v-model="AddForm.goods_cat"></el-input>
                   </el-form-item>
                   <el-form-item label="价格(元）" prop="goods_price">
                       <el-input v-model="AddForm.goods_price"></el-input>
                   </el-form-item>
                   <el-form-item label="数量" prop="goods_number">
                       <el-input v-model="AddForm.goods_number"></el-input>
                   </el-form-item>
                   <el-form-item label="重量" prop="goods_weight">
                       <el-input v-model="AddForm.goods_weight"></el-input>
                   </el-form-item>
                   <el-form-item label="介绍" prop="goods_introduce">
                       <el-input v-model="AddForm.goods_introduce"></el-input>
                   </el-form-item>
                   <el-form-item label="商品图片" prop="pics">
                       <el-input v-model="AddForm.pics"></el-input>
                   </el-form-item>
                   <el-form-item label="商品参数" prop="attrs">
                       <el-input v-model="AddForm.attrs"></el-input>
                   </el-form-item>
                </el-tab-pane>
               <el-tab-pane label="商品参数"name="1">商品参数</el-tab-pane>
               <el-tab-pane label="商品属性"name="2">商品属性</el-tab-pane>
               <el-tab-pane label="商品图片"name="3">商品图片</el-tab-pane>
               <el-tab-pane label="商品内容"name="4">商品内容</el-tab-pane>
           </el-tabs>
           </el-form>
       </el-card>
    </div>
</template>

<script>
    export default {
        data(){
          return {
              tabPosition: 'left',
              activeIndex: '0',
			  // 添加商品表单数据
			  AddForm: {
				  goods_name: '',
				  goods_cat: '',
				  goods_price: '',
				  goods_number: '',
				  goods_weight: '',
				  goods_introduce: '',
				  pics: {},
				  attrs: []
			  },
              //添加商品验证规则
              addGoodsRules: {
                  goods_name: [
                      {required: true, message: '请输入活动名称', trigger: 'blur'},
                      {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                  ],
                  goods_cat: [
                      {required: true, message: '请输入活动名称', trigger: 'blur'},
                      {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                  ],
                  goods_price: [
                      {required: true, message: '请输入活动名称', trigger: 'blur'},
                      {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                  ],
                  goods_number: [
                      {required: true, message: '请输入活动名称', trigger: 'blur'},
                      {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                  ],
                  goods_weight: [
                      {required: true, message: '请输入活动名称', trigger: 'blur'},
                      {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                  ],

              },
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
    height:400px;
}

</style>