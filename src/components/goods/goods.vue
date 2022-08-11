<template>
  <div class="goods-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input clearable placeholder="根据商品名称进行检索" class="input-with-select" v-model="queryInfo.query" @clear="delayFn">
            <el-button slot="append" icon="el-icon-search" @click="delayFn"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="default" class="storeColor" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table
        :data="goodsList"
        style="width: 100%"
        border
        stripe>
        <el-table-column prop="spu_id" label="商品编号"></el-table-column>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column prop="desc" label="商品描述"></el-table-column>
        <el-table-column prop="status" label="商品状态">
          <template v-slot="slotProps">
            <el-tag type="success" v-if="slotProps.row.status === 0">上架中</el-tag>
            <el-tag type="danger" v-else-if="slotProps.row.status === 1">下架中</el-tag>
            <el-tag type="warning" v-else>审核中</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="category1_id" label="一级分类">
          <template v-slot="slotProps">
            {{ categoryList[categoryList.findIndex(item => item.id === slotProps.row.category1_id)].name }}
          </template>
        </el-table-column>
        <el-table-column prop="category2_id" label="二级分类">
          <template v-slot="slotProps">
            {{ categoryList[categoryList.findIndex(item => item.id === slotProps.row.category1_id)].children[[categoryList[categoryList.findIndex(item => item.id === slotProps.row.category1_id)].children.findIndex(item => item.id === slotProps.row.category2_id)]].name }}
          </template>
        </el-table-column>
        <el-table-column prop="pic" label="图片">
          <template v-slot="slotProps">
            <img :src="`http://localhost:3000/public/spu_banner/${slotProps.row.pic}`" alt="">
            <!-- <el-image
              style="width: 50px; height: 50px"
              :src="`http://localhost:3000:3000/public/spu_goods/${slotProps.row.pic}`"
              :preview-src-list="[`http://localhost:3000:3000/public/spu_goods/${slotProps.row.pic}`]">
            </el-image> -->
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template v-slot="slotProps">{{ slotProps.row.create_time | dataFormat }}</template>
        </el-table-column>
        <el-table-column width="180">
          <template v-slot="slotProps">
            <el-tooltip class="item" effect="dark" content="编辑商品" placement="top">
              <el-button size="small" type="primary" icon="el-icon-edit" @click="goEditPage(slotProps.row.spu_id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="审核" placement="top">
              <el-button size="small" type="warning" icon="el-icon-s-tools" @click="editGoodStatus(slotProps.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除商品" placement="top">
              <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteGoods(slotProps.row.spu_id)"></el-button>
            </el-tooltip>
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
      <!-- 审核区域 -->
      <el-dialog
        title="审核商品状态"
        :visible.sync="editDialogVisible"
        width="30%">
        <el-radio v-model="status" :label="0">上架</el-radio>
        <el-radio v-model="status" :label="1">下架</el-radio>
        <el-radio v-model="status" :label="2">审核</el-radio>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editStatus">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { throttle } from '../../utils/index'
export default {
  name: 'Goods',
  data () {
    return {
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 5
      },
      // 分类列表
      categoryList: [],
      // 商品列表数据
      goodsList: [],
      // 总数据量
      total: 0,
      status: 1,
      editDialogVisible: false,
      editStatusById: '',
      delayFn: () => {}
    }
  },
  created () {
    this.getCategoryList()
    this.getGoodsList()
  },
  mounted () {
    this.delayFn = throttle(this.getGoodsList, 500)
  },
  methods: {
    // 获取分类列表
    async getCategoryList () {
      const { data } = await this.$http.get('/manage/category/all')
      if (data.code !== 0) return this.$message.error('获取分类列表数据失败')
      this.categoryList = data.result
    },
    async getGoodsList () {
      const { data } = await this.$http.get('/manage/goods', { params: this.queryInfo })
      if (data.code !== 0) return this.$message.error('获取商品列表数据失败')
      this.goodsList = data.result.goodsList
      this.total = data.result.count
    },
    // 监听当前分页大小改变事件
    handleSizeChange (newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.getGoodsList()
    },
    // 监听当前页码发生改变事件
    handleCurrentChange (newPageNum) {
      this.queryInfo.pageNum = newPageNum
      this.getGoodsList()
    },
    // 根据id删除商品
    deleteGoods (id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await this.$http.delete(`/manage/good/delete?spu_id=${id}`)
        if (data.code !== 0) return this.$message.error('删除商品失败')
        this.$message.success('删除商品成功')
        this.queryInfo = {
          query: '',
          pageNum: 1,
          pageSize: 5
        }
        this.getGoodsList()
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    // 跳转到添加商品
    goAddPage () {
      this.$router.push('/spu/add')
    },
    goEditPage (id) {
      this.$router.push({ path: `/spu/edit/${id}` })
    },
    // 打开审核商品对话框
    editGoodStatus (row) {
      this.status = row.status
      this.editStatusById = row.spu_id
      this.editDialogVisible = true
    },
    // 确认修改商品状态
    async editStatus () {
      const { data } = await this.$http.post('/manage/good/status', { id: this.editStatusById, status: this.status })
      if (data.code !== 0) return this.$message.error(data.msg)
      this.$message.success('审核商品成功')
      this.getGoodsList()
      this.editDialogVisible = false
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
.el-table img {
  height: 70px;
  display: block;
  margin: 0 auto;
}
</style>
