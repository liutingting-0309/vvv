<template>
    <div>
<!--        面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片部分-->
        <el-card class="box-card">
<!--            搜索框，添加按钮部分-->
            <el-row>
                <el-col :span="6">
                    <el-input v-model="queryInfo.query" placeholder="请输入内容" class="input-with-select" clearable @clear="getGoodsList">
                    <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button></el-input>
                </el-col>
                <el-col :span="7"> <el-button type="primary" @click="addGoods">添加商品</el-button></el-col>
            </el-row>
<!--            列表区域-->
            <el-table :data="goodList"  style="width: 100%" stripe  border>
                <el-table-column label="#" type="index" ></el-table-column>
                <el-table-column prop="goods_name" label="商品名称" ></el-table-column>
                <el-table-column prop="goods_price" label="商品价格(元）" ></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" ></el-table-column>
                <el-table-column prop="add_time" label="创建时间" >
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column  label="操作" >
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit"  size="mini" ></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGood(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
<!--            分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 20, 30]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>

        </el-card>
<!--        添加商品弹框-->
<!--        <el-dialog-->
<!--                title="添加商品"-->
<!--                :visible.sync="addGoodsDialogVisible"-->
<!--                width="50%"-->
<!--                :before-close="handleaddgoodsdialogClose">-->
<!--&lt;!&ndash;            表单区域&ndash;&gt;-->
<!--            <el-form :model="addGoodsRuleForm" :rules="addGoodsRules" ref="addGoodsRuleForm" label-width="100px" class="demo-ruleForm">-->
<!--                <el-form-item label="商品名称" prop="goods_name">-->
<!--                    <el-input v-model="addGoodsRuleForm.goods_name"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="分类列表" prop="goods_cat">-->
<!--                    <el-input v-model="addGoodsRuleForm.goods_cat"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="价格(元）" prop="goods_price">-->
<!--                    <el-input v-model="addGoodsRuleForm.goods_price"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="数量" prop="goods_number">-->
<!--                    <el-input v-model="addGoodsRuleForm.goods_number"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="重量" prop="goods_weight">-->
<!--                    <el-input v-model="addGoodsRuleForm.goods_weight"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="介绍" prop="goods_introduce">-->
<!--                    <el-input v-model="addGoodsRuleForm.goods_introduce"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="商品图片" prop="pics">-->
<!--                    <el-input v-model="addGoodsRuleForm.pics"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="商品参数" prop="attrs">-->
<!--                    <el-input v-model="addGoodsRuleForm.attrs"></el-input>-->
<!--                </el-form-item>-->
<!--            </el-form>-->
<!--            <span slot="footer" class="dialog-footer">-->
<!--    <el-button @click="addGoodsDialogVisible = false">取 消</el-button>-->
<!--    <el-button type="primary" @click="addGoodsDialogVisible = false">确 定</el-button>-->
<!--  </span>-->
<!--        </el-dialog>-->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 5
                },
                goodList: [],
                total: 0,
                // 添加商品是否隐藏
                addGoodsDialogVisible: false,
                // 添加商品表单数据
                addGoodsRuleForm: {
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
            this.getGoodsList()
        },
        methods: {
            // 获取商品列表数据
            async getGoodsList() {
                const {data: res} = await this.$http.get('goods', {
                    params: this.queryInfo
                });
                this.goodList = res.data.goods;
                this.total = res.data.total;
            },

            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getGoodsList()
            },
            handleCurrentChange(newNum) {
                this.queryInfo.pagenum = newNum
                this.getGoodsList()
            },
            //跳转添加商品页
            addGoods(){
                this.$router.push('/goods/add')
            },
            //删除商品
            async deleteGood(id) {
                const confirmResult = await
                this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult !== 'confirm') {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                }else{
                    const {data:res} = await this.$http.delete(`goods/${id}`)
                    if (res.meta.status !== 200) {
                        this.$message.error("删除失败！")
                        return
                    }
                    this.$message.success('删除成功！')
                    this.getGoodsList()
                }

            },
        }
    }

</script>

<style lang="less" scoped>
.box-card{
    margin-top:15px;
}
.el-col{
    margin-right:15px;
}
.el-table{
    margin-top:15px;
}
</style>