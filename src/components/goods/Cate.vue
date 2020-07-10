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
      <el-row>
        <el-col :span="8">
          <el-button type="primary" @click="showaddCateform">添加分类</el-button>
        </el-col>
      </el-row>
      <!--表格区域  -->
      <tree-table
        :data="catelist"
        :columns="columns"
        show-index
        index-text="#"
        tree-type
        border
        :selection-type="false"
        :expand-type="false"
      >
      <!-- 分类名称列 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted  === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序列 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作列-->
        <template slot="operate">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="5"
          :page-sizes="[5, 10, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div> -->
    </el-card>
    <!-- 添加分类弹框 -->
    <!-- <el-dialog
  title="添加分类"
  :visible.sync="addCatedialogVisible"
  width="50%">
  <el-form ref="addCateRef" :model="addCateForm" :rules="addCateFormRules" label-width="100px">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类"> -->
    <!-- options用来指定数据源 -->
    <!-- props用来指定配置对象 -->
    <!-- v-model 选中的父级分类的数据列表,必须是数组-->
      <!-- <el-cascader
    v-model="selectedKeys"
    :options="getCateForm"
    :props="cascaderProps"
    @change="addCatehandleChange"></el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCatedialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCatedialogVisible = false">确 定</el-button>
  </span>
</el-dialog> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 请求商品分类数据的参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表，默认为空
      catelist:[],
      total: 0,
      columns: [
        { label: "分类名称", prop: "cat_name" },
        {
          label: "是否有效",
          prop: "cat_deleted",
          // 将当前列定义为模板列
          type: "template",
          // 当前这一列使用模板名称
          template: "isok"
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "operate"
        }
      ],
      addCatedialogVisible:false,
      getCateForm:[],
      // 指定配置对象
      cascaderProps:[{
        value:cat_pid,
        label:cat_name,
        children:'children'
      }],
      addCateForm:{
        // cat_pid:0,
        // cat_name:'',9
        // cat_level:0
      },
      addCateFormRules:[],
      // 选中的父级分类的数据列表
      selectedKeys:[],
    };
  },
  created() {
    this.getCatelist();
    // this.getParentCateList() 
  },
  methods: {
    // 获取商品分类列表数据
    async getCatelist() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类列表失败！");
      }
      // 把数据列表，赋值给catelist
      this.catelist = res.data;
      console.log(this.catelist);
      // 为总条数赋值
      // this.total = res.data.total;
      // console.log(this.total);
    },
    // 监pagetsize变化
    // handleSizeChange(newSize){
    //   this.queryInfo.pagesize = newSize
    //   this.getCatelist()
    // },
    // 监听pagenum改变
    // handleCurrentChange(newPagenum){
    //   this.queryInfo.pagenum = newPagenum
    //   this.getCatelist()
    // },
    // 显示添加分类框
    async showaddCateform(){
      this.getParentCateList() 
      this.addCatedialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList(){
     const {data:res} = await this.$http.get('categories',{params:{
        type: 2,
        pagenum:5,
        pagesize:1
      }})
      console.log('看看父级分类')
      this.getCateForm = res.data
      console.log(this.getCateForm)
   
    },
    addCatehandleChange(){
      
    },
  }
};
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 12px;
}
.tree-table {
  margin-top: 12px;
}
</style>