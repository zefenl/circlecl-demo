<template>
  <div class="category-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品库存表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input clearable placeholder="根据商品规格编号进行检索" class="input-with-select" v-model="queryInfo.query" @clear="getSkusListDelay">
            <el-button slot="append" icon="el-icon-search" @click="getSkusListDelay"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="default" class="storeColor">添加库存</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table
        :data="skusList"
        style="width: 100%"
        border
        stripe>
        <el-table-column prop="sku_id" label="商品规格编号" width="50"></el-table-column>
        <el-table-column prop="spu_id" label="商品编号"></el-table-column>
        <el-table-column prop="good_name" label="商品名称"></el-table-column>
        <el-table-column prop="good_pic" label="商品图片" width="100">
          <template v-slot="slotProps">
            <el-image
              style="width: 50px; height: 50px"
              :src="`http://localhost:3000/spu_banner/${slotProps.row.good_pic}`"
              :preview-src-list="[`http://localhost:3000/spu_banner/${slotProps.row.good_pic}`]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="specs" label="规格">
          <template v-slot="slotProps">
            <el-tag v-for="(item, i) in slotProps.row.specs" :key="i">{{item.name + ': ' + item.value}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="old_price" label="旧价格" width="80"></el-table-column>
        <el-table-column prop="new_price" label="打折后价格" width="80"></el-table-column>
        <el-table-column prop="inventory" label="剩余库存" width="80"></el-table-column>
        <el-table-column>
          <template v-slot="slotProps">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(slotProps.row.sku_id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSkuInfo(slotProps.row.sku_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[3, 5, 7, 10]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!-- 修改对话框 -->
      <el-dialog
        title="修改商品库存信息"
        :visible.sync="editDialogVisible"
        width="30%"
        :before-close="editHandleClose">
        <el-form ref="editFormRef" :rules="editFormRules" :model="editForm"  label-width="130px">
          <el-form-item label="商品旧价格" prop="old_price">
            <el-input v-model.number="editForm.old_price"></el-input>
          </el-form-item>
          <el-form-item label="商品新价格" prop="new_price">
            <el-input v-model.number="editForm.new_price"></el-input>
          </el-form-item>
          <el-form-item label="商品剩余库存" prop="inventory">
            <el-input v-model.number="editForm.inventory"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data () {
    return {
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 3
      },
      skusList: [],
      // 总数据量
      total: 0,
      // 获取要修改的分类对象
      editForm: {},
      editDialogVisible: false,
      editFormRules: {
        old_price: [
          { required: true, message: '价格不能为空', trigger: 'blur' },
          { type: 'number', message: '价格必须为数值', trigger: 'blur' }
        ],
        new_price: [
          { required: true, message: '价格不能为空', trigger: 'blur' },
          { type: 'number', message: '价格必须为数值', trigger: 'blur' }
        ],
        inventory: [
          { required: true, message: '价格不能为空', trigger: 'blur' },
          { type: 'number', message: '价格必须为数值', trigger: 'blur' }
        ]
      },
      isLoading: false
    }
  },
  created () {
    this.getSkusList()
  },
  methods: {
    async getSkusList () {
      const { data } = await this.$http.get('/manage/skus', { params: this.queryInfo })
      if (data.code !== 0) return this.$message.error(data.msg)
      this.skusList = data.result.skusList
      this.total = data.result.count
    },
    async getSkusListDelay () {
      if (this.isLoading) return console.log('禁止重复发送请求')
      this.isLoading = true
      setTimeout(this.getSkusList, 1000)
    },
    // 监听当前分页大小改变事件
    handleSizeChange (newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.getSkusList()
    },
    // 监听当前页码发生改变事件
    handleCurrentChange (newPageNum) {
      this.queryInfo.pageNum = newPageNum
      this.getSkusList()
    },
    // 根据id删除商品
    deleteSkuInfo (id) {
      this.$confirm('此操作将永久删除该商品库存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await this.$http.delete(`/manage/sku/${id}`)
        if (data.code !== 0) return this.$message.error('删除商品库存失败')
        this.$message.success('删除商品库存成功')
        this.queryInfo = {
          query: '',
          pageNum: 1,
          pageSize: 3
        }
        this.getSkusList()
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    // 监听修改对话框关闭事件
    editHandleClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 显示修改对话框
    async showEdit (id) {
      const { data } = await this.$http.get(`/manage/sku/${id}`)
      if (data.code !== 0) return this.$message.error(data.msg)
      this.editForm = data.result
      this.editDialogVisible = true
    },
    // 提交修改事件
    editSubmit () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写正确的表单')
        const { data } = await this.$http.post(`/manage/sku/${this.editForm.sku_id}`, this.editForm)
        if (data.code !== 0) return this.$message.error(data.msg)
        this.$message.success('修改商品库存信息成功')
        this.getSkusList()
        this.editDialogVisible = false
      })
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
