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
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 添加分类弹框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatedialogVisible"
      @close="handleCloseaddCatedialog"
      width="50%"
    >
      <el-form ref="addCateRef" :model="addCateForm" :rules="addCateFormRules" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <!-- v-model 选中的父级分类的数据列表,必须是数组-->
          <el-cascader
            :key="getCateForm.cat_id"
            v-model="selectedKeys"
            :options="getCateForm"
            :props="cascaderProps"
            @change="parentCatehandleChange"
            clearable
            placeholder="请选择分类"
            filterable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postaddCatepForm">确 定</el-button>
      </span>
    </el-dialog>
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
      catelist: [],
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
      addCatedialogVisible: false,
      getCateForm: [],
      // 指定配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true
      },
      addCateForm: {
        // 将要添加的分类的名称
        cat_pid: 0,
        // 父级分类的Id
        cat_name: "",
        // 分类的等级，默认要添加的事1级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      // 选中的父级分类的数据列表
      selectedKeys: []
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
        this.$message.error("获取商品分类列表失败！");
      } else {
        // 把数据列表，赋值给catelist
        this.catelist = res.data.result;
        // 为总条数赋值
        this.total = res.data.total;
      }
    },
    // 监pagetsize变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCatelist();
    },
    // 监听pagenum改变
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum;
      this.getCatelist();
    },
    // 显示添加分类框
    async showaddCateform() {
      this.getParentCateList();
      this.addCatedialogVisible = true;
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: {
          type: 2
        }
      });
      if (res.meta.status !== 200) {
        this.$http.error("获取父级分类数据失败");
      }
      this.getCateForm = res.data;
      // console.log(this.getCateForm)
    },
    // 选择项发生变化时触发这个函数
    parentCatehandleChange() {
      console.log(this.selectedKeys);
      // 如果selectedKeys数组中的length大于0，则说明有选择父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        //  父级分类的id
        this.addCateForm.cat_pid = 0;
        // 当前分类的等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    // 添加分类信息方法
    postaddCatepForm() {
      this.$refs.addCateRef.validate(async valid => {
        if (!valid) {
          return;
        }
        console.log(this.addCateForm);
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        console.log(res);
        if (res.meta.status !== 201) {
          this.$message.error("添加分类失败！");
        }
        this.$message.success("添加分类成功");
      });
    },
    //监听关闭窗口时，清空分类列表数据
    handleCloseaddCatedialog() {
      this.$refs.addCateRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    }
  }
};
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 12px;
}
.el-button {
  margin-bottom: 12px;
}
</style>