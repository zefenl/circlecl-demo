<template>
  <div class="category-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input clearable placeholder="根据订单编号进行检索" class="input-with-select" v-model="queryInfo.query" @clear="delayFn">
            <el-button slot="append" icon="el-icon-search" @click="delayFn"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table
        :data="orderList"
        style="width: 100%"
        border
        stripe>
        <el-table-column prop="order_id" label="订单编号" width="130"></el-table-column>
        <el-table-column prop="payment" label="支付金额" width="80"></el-table-column>
        <el-table-column prop="post_fee" label="邮费" width="80"></el-table-column>
        <el-table-column prop="status" label="支付状态">
          <template v-slot="slotProps">
            <el-tag v-if="slotProps.row.status == 1" type="danger" effect="dark">未付款</el-tag>
            <el-tag v-else-if="slotProps.row.status == 2" type="success" effect="dark">待发货</el-tag>
            <el-tag v-else-if="slotProps.row.status == 3" type="warning" effect="dark">已发货</el-tag>
            <el-tag v-else-if="slotProps.row.status == 4" type="info" effect="dark">待评价</el-tag>
            <el-tag v-else-if="slotProps.row.status == 5" effect="dark">已取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="订单创建时间" width="200">
          <template v-slot="slotProps">
            {{ slotProps.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="buyer_message" label="买家留言" width="80"></el-table-column>
        <el-table-column prop="receiver_area_name" label="收货地址" width="300"></el-table-column>
        <el-table-column prop="receiver_mobile" label="收货人手机号"  width="120"></el-table-column>
        <el-table-column prop="ereceiver_name" label="收货人姓名"></el-table-column>
        <el-table-column prop="shipping_name" label="快递名称"></el-table-column>
        <el-table-column prop="shipping_code" label="快递单号"  width="140"></el-table-column>
        <el-table-column prop="invoice_type" label="发票类型">
          <template v-slot="slotProps">
            <el-tag v-if="slotProps.row.invoice_type == 0" type="info">普通发票</el-tag>
            <el-tag v-else-if="slotProps.row.invoice_type == 1" type="success">电子发票</el-tag>
            <el-tag v-else type="warning">增值税发票</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template v-slot="slotProps">
            <el-button type="text" size="small" @click="seeOrderInfo(slotProps.row.order_id)">查看</el-button>
            <el-button type="text" size="small" @click="editOrderInfo(slotProps.row.order_id)">编辑</el-button>
            <el-button type="text" size="small" @click="deliverOrderInfo(slotProps.row.order_id)">发货</el-button>
            <el-button type="text" size="small" @click="deleteOrderById(slotProps.row.order_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[5, 7, 10]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!-- 查看订单详情对话框 -->
      <el-dialog title="查看订单详细信息" :visible.sync="seeDialogVisible" width="50%">
        <el-table :data="orderInfo" style="width: 100%" border stripe show-summary>
          <el-table-column prop="title" label="商品名称"></el-table-column>
          <el-table-column prop="attrs_text" label="商品规格"></el-table-column>
          <el-table-column prop="count" label="购买数量" width="60"></el-table-column>
          <el-table-column prop="price" label="购买单价" width="80"></el-table-column>
          <el-table-column prop="total_price" label="总价格" width="80"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="seeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="seeDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改对话框 -->
      <el-dialog title="修改订单数据" :visible.sync="editDialogVisible" @close="editHandleClose" width="25%">
        <el-form ref="editFormRef" :rules="editFormRules" :model="editForm"  label-width="130px">
          <el-form-item label="收货人姓名" prop="ereceiver_name">
            <el-input v-model="editForm.ereceiver_name"></el-input>
          </el-form-item>
          <el-form-item label="收货人手机号" prop="receiver_mobile">
            <el-input v-model="editForm.receiver_mobile"></el-input>
          </el-form-item>
          <el-form-item label="买家留言" prop="buyer_message">
            <el-input v-model="editForm.buyer_message"></el-input>
          </el-form-item>
          <el-form-item label="地区" prop="fullLocation">
            <el-cascader
            v-model="editForm.fullLocation"
            :options="fullLocations"
            :props="{ expandTrigger: 'hover', value: 'name', label: 'name', children: 'areaList' }"></el-cascader>
          </el-form-item>
          <el-form-item label="收货地址" prop="receiver_area_name">
            <el-input v-model="editForm.receiver_area_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editOrderSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 发货 -->
      <el-dialog title="商品发货信息" :visible.sync="deliverDialogVisible" @close="deliverHandleClose" width="25%">
        <el-form ref="deliverFormRef" :rules="deliverFormRules" :model="deliverForm"  label-width="130px">
          <el-form-item label="快递名称" prop="shipping_name">
            <el-select v-model="deliverForm.shipping_name" placeholder="请选择快递单位">
              <el-option label="顺丰" value="顺丰"></el-option>
              <el-option label="邮政" value="邮政"></el-option>
              <el-option label="京东" value="京东"></el-option>
              <el-option label="申通" value="申通"></el-option>
              <el-option label="韵达" value="韵达"></el-option>
              <el-option label="中通" value="中通"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="快递编号" prop="shipping_code">
            <el-input v-model="deliverForm.shipping_code"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deliverDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="deliveSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { throttle } from '../../utils'
export default {
  name: 'Order',
  data () {
    return {
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 5
      },
      orderList: [],
      // 总数据量
      total: 0,
      orderInfo: [],
      seeDialogVisible: false,
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        ereceiver_name: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
        receiver_mobile: [{ required: true, message: '请输入收货人手机号', trigger: 'blur' }],
        fullLocation: [{ type: 'array', required: true, message: '请选择收货地区', trigger: 'change' }],
        receiver_area_name: [{ required: true, message: '请输入详细收货地址', trigger: 'blur' }]
      },
      fullLocations: [],
      deliverDialogVisible: false,
      deliverFormRules: {
        shipping_name: [{ required: true, message: '请选择快递单位', trigger: 'blur' }],
        shipping_code: [
          { required: true, message: '请输入快递单号', trigger: 'blur' },
          { min: 12, max: 12, message: '请输入12位快递单号', trigger: 'blur' }
        ]
      },
      deliverForm: {
        shipping_name: '',
        shipping_code: ''
      },
      delayFn: () => {}
    }
  },
  created () {
    this.getOrderList()
  },
  mounted () {
    this.delayFn = throttle(this.getGoodsList, 500)
  },
  methods: {
    // 获取订单列表
    async getOrderList () {
      const { data } = await this.$http.get('/manage/order', { params: this.queryInfo })
      if (data.code !== 0) return this.$message.error(data.msg)
      this.orderList = data.result.orders
      this.total = data.result.count
      this.isLoading = false
    },
    // 监听当前分页大小改变事件
    handleSizeChange (newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.getOrderList()
    },
    // 监听当前页码发生改变事件
    handleCurrentChange (newPageNum) {
      this.queryInfo.pageNum = newPageNum
      this.getOrderList()
    },
    // 根据id删除商品
    deleteOrderById (id) {
      this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await this.$http.delete(`/manage/order/${id}`)
        if (data.code !== 0) return this.$message.error('删除订单失败')
        this.$message.success('删除订单成功')
        this.queryInfo = {
          query: '',
          pageNum: 1,
          pageSize: 3
        }
        this.getOrderList()
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    // 查看订单详情
    async seeOrderInfo (id) {
      const { data } = await this.$http.get(`/manage/orderitem/${id}`)
      if (data.code !== 0) return this.$message.error(data.msg)
      this.orderInfo = data.result
      this.seeDialogVisible = true
    },
    // 监听修改对话框的关闭
    editHandleClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 打开修改对话框
    async editOrderInfo (id) {
      this.getArea()
      const { data } = await this.$http.get(`/manage/order/${id}`)
      if (data.code !== 0) return this.$message.error(data.msg)
      this.editForm = data.result
      const areaArr = data.result.receiver_area_name.split(',')
      this.editForm.receiver_area_name = areaArr.pop()
      this.editForm.fullLocation = areaArr
      this.editDialogVisible = true
    },
    // 获取地区数据
    async getArea () {
      const { data } = await this.$http.get('http://localhost:3000/public/area.json')
      this.fullLocations = data
    },
    // 提交修改订单数据
    editOrderSubmit () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写完完整的表单')
        this.editForm.receiver_area_name = this.editForm.fullLocation.join(',') + this.editForm.receiver_area_name
        const { data } = await this.$http.post(`/manage/order/${this.editForm.order_id}`, this.editForm)
        if (data.code !== 0) return this.$message.error(data.msg)
        this.$message.success('修改订单信息成功')
        this.getOrderList()
        this.editDialogVisible = false
      })
    },
    // 监听发货对话框关闭事件
    deliverHandleClose () {
      this.$refs.deliverFormRef.resetFields()
    },
    // 订单发货
    deliveSubmit () {
      this.$refs.deliverFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写完整的表单')
        const { data } = await this.$http.post(`/manage/order/deliver/${this.deliverForm.order_id}`, this.deliverForm)
        if (data.code !== 0) return this.$message.error(data.msg)
        this.$message.success('订单发货成功')
        this.getOrderList()
        this.deliverDialogVisible = false
      })
    },
    // 打开发货对话框
    deliverOrderInfo (id) {
      this.deliverForm.order_id = id
      this.deliverDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
/deep/th.el-table__cell {
  background-color: #f5f7fa !important;
}
/deep/.el-dialog {
  min-width: 500px;
}
.vertical-center {
  display: flex;
  align-items: center;
}
.el-tag {
  margin-right: 8px;
}
</style>
