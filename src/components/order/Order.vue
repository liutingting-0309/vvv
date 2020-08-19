<template>
    <div>
<!--        面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
<!--       卡片区域-->
        <el-card>
<!--            搜索框，添加按钮部分-->
            <el-row>
                <el-col :span="6">
                    <el-input v-model="queryInfo.query" placeholder="请输入内容" class="input-with-select" clearable @clear="getOrderlist">
                        <el-button slot="append" icon="el-icon-search" @click="getOrderlist"></el-button></el-input>
                </el-col>
            </el-row>
            <!--                表格区域-->
                <el-table :data="orderForm" style="width: 100%" border>
                    <el-table-column type="index" label="#" ></el-table-column>
                    <el-table-column prop="order_number" label="订单编号" width="270"></el-table-column>
                    <el-table-column prop="order_price" label="订单价格" width="100" ></el-table-column>
                    <el-table-column prop="pay_status" label="是否付款" width="100">
                        <template slot-scope="scope" >
                            <el-tag v-if="scope.row.pay_status === '1'" type="success">已付款</el-tag>
                            <el-tag v-else type="danger" >未付款</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
                    <el-table-column  label="下单时间" width="200">
                        <template slot-scope="scope">
                            {{scope.row.update_time | dateFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column  label="操作" >
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
                            <el-button type="success" icon="el-icon-location" size="mini"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
<!--            分页部分-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 20, 50]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
    	data(){
    		return {
    			// 参数
				queryInfo: {
				    query:'',
                    pagenum:1,
                    pagesize:5,
                    user_id:'',
                    pay_status:'',
                    is_send:'',
                    order_fapiao_title:'',
                    order_fapiao_company:'',
                    order_fapiao_content:'',
                    consignee_addr:''
                },
                // 总条数
                total:0,
                // 订单数据列表
                orderForm:[],
            }
        },
        created() {
			this.getOrderlist()
		},
		methods:{
    		//获取订单数据列表
			async getOrderlist(){
				const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
                if(res.meta.status !== 200){
                	this.$message.error('获取订单数据列表失败')
                    return
                }
                this.orderForm = res.data.goods
                console.log(this.orderForm)
                this.total =res.data.total
            },
            // 监听每页数量变化
			handleSizeChange(newSize){
				this.queryInfo.pagesize = newSize
				this.getOrderlist()
            },
            //监听页码变化
			handleCurrentChange(newNum){
				this.queryInfo.pagenum = newNum
				this.getOrderlist()
			},
            // 修改订单数据

        },

    }
</script>
<style lang="less" scoped>
.el-card{
    margin-top: 15px;
}
.el-table{
    margin-top:15px;
    margin-bottom: 15px;
}
</style>
