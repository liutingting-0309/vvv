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
           <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center >
               <el-step title="基本信息"></el-step>
               <el-step title="商品参数"></el-step>
               <el-step title="商品属性"></el-step>
               <el-step title="商品图片"></el-step>
               <el-step title="商品内容"></el-step>
               <el-step title="完成"></el-step>
           </el-steps>
<!--           表单区域-->
           <el-form  :model="AddForm" ref="addFormRef" :rules="addGoodsRules" label-width="80px" :label-position="'top'" >
           <el-tabs v-model="activeIndex" :tab-position="tabPosition" style="height: 550px;" :before-leave="beforeTabLeave" @tab-click="tabClicked">
               <el-tab-pane label="基本信息"name="0">
                   <el-form-item label="商品名称" prop="goods_name">
                       <el-input v-model="AddForm.goods_name"></el-input>
                   </el-form-item>
                   <el-form-item label="商品价格" prop="goods_price">
                       <el-input v-model="AddForm.goods_price"></el-input>
                   </el-form-item>
                   <el-form-item label="商品数量" prop="goods_number">
                       <el-input v-model="AddForm.goods_number"></el-input>
                   </el-form-item>
                   <el-form-item label="商品重量" prop="goods_weight">
                       <el-input v-model="AddForm.goods_weight"></el-input>
                   </el-form-item>
                   <el-form-item label="商品分类" prop="goods_cat">
                       <el-cascader
                               :options="goodsList"
                               :props="cateProps"
                               v-model="AddForm.goods_cat"
                               @change="handleChange"
                               clearable
                               ></el-cascader>
                   </el-form-item>
                </el-tab-pane>
               <el-tab-pane label="商品参数"name="1">
                   <el-form-item v-for="item in manyAttrForm" :label="item.attr_name" :key="item.attr_id">
                       <el-checkbox-group v-model="item.attr_vals">
                           <el-checkbox border :label="item1" v-for="(item1,i) in item.attr_vals" :key="i"></el-checkbox>
                       </el-checkbox-group>
                   </el-form-item>
               </el-tab-pane>
               <el-tab-pane label="商品属性"name="2">
                   <el-form-item v-for="item in onlyAttrForm" :key="item.attr_id" :label="item.attr_name">
                       <el-input v-model="item.attr_vals"></el-input>
                   </el-form-item>
               </el-tab-pane>
               <el-tab-pane label="商品图片"name="3">
                   <el-upload
                           class="upload-demo"
                           :action="uploadUrl"
                           :on-preview="handlePreview"
                           :on-remove="handleRemove"
                           :file-list="fileList"
                           :headers="HeadersObj"
                           :on-success="handleSuccess"
                           list-type="picture">
                       <el-button size="small" type="primary">点击上传</el-button>
                       <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                   </el-upload>
               </el-tab-pane>
               <el-tab-pane label="商品内容"name="4">
                   <quill-editor v-model="AddForm.goods_introduce"></quill-editor>
                   <el-button type="primary" class="addBtn" @click="add()">添加商品</el-button>
               </el-tab-pane>
           </el-tabs>
           </el-form>
       </el-card>
<!--        图片放大对话框-->
        <el-dialog
                title="预览图片"
                :visible.sync="previewVisible"
                width="50%"
                :before-close="handlePreviewClose">
            <img :src="previewPath" class="previewStyle">
            <span slot="footer" class="dialog-footer">
    <el-button @click="previewVisible = false">取 消</el-button>
    <el-button type="primary" @click="previewVisible = false">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    export default {
        data(){
          return {
			  tabPosition: 'left',
			  activeIndex: '0',
			  // 添加商品表单数据
			  AddForm: {
				  goods_name: '',
                  //商品所属的分类数组
				  goods_cat: [],
				  goods_price: '',
				  goods_number: '',
				  goods_weight: '',
                  //上传图片的临时路径数组对象
                  pics:[],
				  // 商品的参数数组
				  attrs:[],
                  // 商品的详情描述-富文本内容
                  goods_introduce:'',
			  },
			  //添加商品验证规则
			  addGoodsRules: {
				  goods_name: [
					  {required: true, message: '请输入商品名称', trigger: 'blur'},
				  ],
				  goods_price: [
					  {required: true, message: '请输入商品价格', trigger: 'blur'},
				  ],
				  goods_number: [
					  {required: true, message: '请输入商品数量', trigger: 'blur'},
				  ],
				  goods_weight: [
					  {required: true, message: '请输入商品重量', trigger: 'blur'},
				  ],
			  },
			  // 获取的商品分类
			  goodsList: [],
			  cateProps: {
				  value: 'cat_id',
				  label: 'cat_name',
				  children: 'children',
				  expandTrigger:'hover'
			  },
              //动态属性数据
			  manyAttrForm:[],
              //静态参数数据
			  onlyAttrForm:[],
              // 请求路径
              uploadUrl:'http://127.0.0.1:8888/api/private/v1/upload' ,
              // 图片文件数组
			  fileList:[],
              // 上传图片请求头部
			  HeadersObj: {
				  Authorization: window.sessionStorage.getItem('token')
			  },
              // 图片放大是否显示
			  previewVisible:false,
              // 放大图片的地址
			  previewPath:'',
          }

          },
        created(){
            this.getGoodsList();
			  },
        methods: {
            async getGoodsList(){
                const {data: res} = await this.$http.get('categories')
                if (res.meta.status !== 200) {
                    this.$message.success('获取商品分类失败')
                    return
                }
                this.goodsList = res.data
            },
            //分类级联选择后触发
            handleChange() {
                if(this.AddForm.goods_cat.length !== 3){
                	this.addForm.goods_cat = []
                }
            },
            //tab切换时触发
 			beforeTabLeave(activeName, oldActiveName){
				// console.log('将要离开的tab'+oldActiveName)
				// console.log('将要进入的tab'+activeName)
                if(oldActiveName == 0  &&this.AddForm.goods_cat.length !==3){
                	this.$message.error('请选择商品分类！')
                    return false
                }
			},
            //tab被选中时触发
			async tabClicked() {
				// console.log(this.AddForm.goods_cat)
				if (this.activeIndex == 1) {
					const {data: res} = await this.$http.get(`categories/${this.AddForm.goods_cat[2]}/attributes`, {params: {sel: 'many'}})
					if (res.meta.status !== 200) {
						this.$message.error('获取动态参数列表失败！')
						return
					}
					res.data.forEach(item => {
						item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
					})
					this.manyAttrForm = res.data
				} else if (this.activeIndex == 2) {
					const {data: res} = await this.$http.get(`categories/${this.AddForm.goods_cat[2]}/attributes`, {
						params: {sel: 'only'}
					})
					if (res.meta.status !== 200) {
						this.$message.error('获取静态参数失败')
						return
					}
				    // console.log(res)
				    this.onlyAttrForm =  res.data
				}
			},
            //图片预览函数
			handlePreview(file) {
				console.log(file);
				// this.previewPath = file.response.data.url
                this.previewPath = 'http://127.0.0.1:8888/' + file.response.data.tmp_path
                this.previewVisible = true

            },
            // 移除图片函数
            handleRemove(file) {
				// 1.获取将要删除的图片的临时路径
			    const filePath =  file.response.data.tmp_path
                // 2.从pics数组中，找到这个图片对应的索引值
                const i = this.AddForm.pics.findIndex(x => x.pic === filePath)
                // 3.调用数组的splice方法,把图片信息对象，从pics数组中移除
                this.AddForm.pics.splice(i,1)
                console.log(this.AddForm)
            },
            // 图片上传成功后
			handleSuccess(response){
            	console.log(response)
            //    1.拼接得到一个图片信息对象
                const picInfo = {
            		pic:response.data.tmp_path
                }
            //    2.将图片信息对象，push到Pics数组中
                this.AddForm.pics.push(picInfo)
                console.log(this.AddForm)
			},
            // 监听图片放大框的关闭
			handlePreviewClose(){
            	this.previewVisible =false
            },
            // 添加商品
            add(){
            	this.$refs.addFormRef.validate(async valid => {
            		if(!valid){
            			this.$message.error("请完善表单项")
                        return
            		}
            		// 执行表单的业务逻辑
                    // lodash cloneDeep(obj)
                    //深拷贝AddForm,为了防止将goods_cat从数组改成字符串的时候报错,因为v-model中是需要数组，而上传的时候需要字符串
                    const form = _.cloneDeep(this.AddForm)
                    form.goods_cat = form.goods_cat.join(',')
                    // console.log(form.goods_cat)
                    // 处理动态参数
                    this.manyAttrForm.forEach(item => {
                    	const newInfo = {
                    		attr_id: item.attr_id,
                            attr_value:item.attr_vals.join(' ')
                        }
                        this.AddForm.attrs.push(newInfo)
                    })
                    //处理静态属性
                    this.onlyAttrForm.forEach(item => {
                    	const newInfo = {
                    		attr_id:item.attr_id,
                            attr_value:item.attr_vals
                        }
                        this.AddForm.attrs.push(newInfo)
                    })
                    form.attrs = this.AddForm.attrs
                    //提交要添加的商品
                    const {data:res} = await this.$http.post('goods',form)
                    console.log(res)
                    if(res.meta.status !== 201){
                    	this.$message.error("添加商品失败")
                        return
                    }
            		await this.$router.push('/goods')
                })


            }
        },
    }
</script>

<style lang="less" scoped>
.el-card{
    margin-top:15px;
    padding-bottom: 30px;
}
.el-steps{
    margin-top:18px;
}
.el-tabs{
    margin-top:20px;
}
.el-cascader{
    width:300px;
}
.el-checkbox{
    margin-right:6px;
    margin-top:6px;
}
.previewStyle{
    width:100%;
}
.addBtn{
    margin-top:10px;
}
/*不起作用*/
/*.ql-editor{*/
/*    height:300px !important;*/
/*}*/

</style>