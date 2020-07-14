<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表单区域 -->
    <el-card>
      <!-- 警告语句 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <!-- 选择商品分类布局 -->
      <el-row :gutter="20">
        <el-col :span="5">
          <div class="fenleicontent">
            <span>选择商品分类：</span>
          </div>
        </el-col>
        <el-col :span="19">
          <el-cascader
            v-model="selectedKeys"
            :options="selectedForm"
            :props="selectedProps"
            @change="selectedFormhandleChange"
            collapse-tags
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="attrtabhandleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isdisabled"
            @click="addparamsdialogVisible = true"
          >添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isdisabled"
            @click="addparamsdialogVisible = true"
          >添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
      <el-table :data="attributesForm" style="width: 100%" border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item label="详细信息：">
                <p>{{ props.row.attr_name }}</p>
                <p>{{props.row.attr_write= "manual"?"手工录入":"从列表选择"}}</p>
                <p>{{ props.row.attr_vals}}</p>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="attr_name" :label="isshowparamsor"></el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加动态参数或静态属性弹窗 -->
    <el-dialog
      :title="'添加'+istitle"
      :visible.sync="addparamsdialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        :model="addparamsForm"
        :rules="addparamsFormRules"
        ref="addparamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="istitle+':'" prop="attr_name">
          <el-input v-model="addparamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="btnaddParamsForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 级联父级分类表单数据
      selectedForm: [],
      // v-model双向绑定选中的商品分类id
      selectedKeys: [],
      // 指定prop显示属性
      selectedProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      },
      // 指定默认显示的分类页面
      activeName: "many",
      // 获取的参数列表数据
      attributesForm: [],
      addparamsdialogVisible:false,
      // 添加弹窗的表单数据对象
      addparamsForm:{},
      // 添加动态参数、静态属性的弹框规则
      addparamsFormRules:{
        attr_name: [
            { required: true, message: '内容不能为空！', trigger: 'blur' },
          ],
      }
    };
  },
  created() {
    this.getSelectedForm();
  },
  methods: {
    // 获取的商品分类数据
    async getSelectedForm() {
      const { data: res } = await this.$http.get("categories");
      // console.log(res)
      if (res.meta.status !== 200) return;
      this.selectedForm = res.data;
      // console.log(this.selectedForm)
    },
    // 级联选择框选中项变化，会触发这个函数
     selectedFormhandleChange() {
    this.getAttrForm();
    },
    // tab 被选中时触发
    attrtabhandleClick() {
      this.getAttrForm();
    },
    // 获取参数列表数据
    async getAttrForm() {
     if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        return;
      }
      // 证明选中的是三级分类
      // console.log(this.selectedKeys);
      // 根据所选分类的Id,和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.Cateid}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      // console.log(res);
      this.attributesForm = res.data;
    },
    // 关闭添加弹框时清空选中数据
    handleClose(){
      this.$refs.addparamsFormRef.resetFields()
      this.addparamsdialogVisible = false
    },
    // 提交动态参数还是静态属性方法
    async btnaddParamsForm(){
      const {data:res} = await this.$http.post(`categories/${this.Cateid}/attributes`,
      {
        attr_name:this.addparamsForm.attr_name,
        attr_sel:this.activeName,
        attr_vals:this.attributesForm.attr_vals
      })
      if(res.meta.status !== 201){
        return this.$message.error("添加失败")
      }
      return this.$message.success("添加成功")
      console.log(res)
      // 此处两个语句么有运行不知为啥
      this.getAttrForm();
      this.addparamsdialogVisible = false
    },

  },
  // 计算属性
  computed: {
    // 当前选中的是第三级分类的id
    Cateid() {
      if (this.selectedKeys.length !== 3) return null;
      return this.selectedKeys[2];
    },
    // 添加按钮是否可用
    isdisabled() {
      if (this.selectedKeys.length !== 3) return true;
      return false;
    },
    // 属性显示添加参数还是添加属性
    isshowparamsor() {
      if (this.activeName === "many") {
        return "参数名称";
      }
      return "属性名称";
    },
    // 显示添加动态参数还是静态属性
    istitle(){
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    },
  }
};
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 12px;
}
.el-alert {
  margin-bottom: 12px;
}
.fenleicontent {
  text-align: center;
  font-size: 14px;
  line-height: 39px;
}
.el-tabs {
  margin-top: 12px;
}
.el-table {
  margin-top: 12px;
}
</style>