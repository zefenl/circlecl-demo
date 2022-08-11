<template>
  <div class="category-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">分类管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 添加分类区域 -->
      <el-button type="primary" size="default" class="storeColor" @click="showAddDialog">添加分类</el-button>
      <!-- 列表区域 -->
      <el-table
        :data="categoryList"
        style="width: 100%"
        border
        stripe
        row-key="id"
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template v-slot="slotProps">
            <i class="el-icon-success" v-if="slotProps.row.status === 1" style="color: lightgreen;"></i>
            <i class="el-icon-error" v-else style="color: red;"></i>
          </template>
        </el-table-column>
        <el-table-column prop="picture" label="图片">
          <template v-slot="slotProps">
            <el-image
              v-if="slotProps.row.level === 2"
              style="width: 50px; height: 50px"
              :src="`http://localhost:3000/category/${slotProps.row.picture}`"
              :preview-src-list="[`http://localhost:3000/category/${slotProps.row.picture}`]">
            </el-image>
            <el-image v-else style="height: 50px">
              <div slot="error" class="image-slot vertical-center">
                <i class="el-icon-picture-outline" style="font-size: 50px;"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="等级">
          <template v-slot="slotProps">
            <el-tag :type="slotProps.row.level === 1 ? 'primary' : 'success'">{{slotProps.row.level === 1 ? '一级' : '二级'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column>
          <template v-slot="slotProps">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(slotProps.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteCategory(slotProps.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类对话框"
        :visible.sync="addDialogVisible"
        @close="addDialogClosed"
        width="40%">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="分类级别" prop="level">
            <el-select v-model="addForm.level" placeholder="分类等级">
              <el-option label="一级" :value="1"></el-option>
              <el-option label="二级" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <div v-show="addForm.level === 2">
            <el-form-item label="父级分类" prop="parent">
              <el-select v-model="addForm.parent" placeholder="请选择所属分类">
                <el-option v-for="cate in categoryFirstList" :key="cate.id" :label="cate.categoryName" :value="cate.categoryId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分类图片" prop="picture">
              <el-upload
                ref="addCategory"
                drag
                :multiple="false"
                :auto-upload="false"
                :http-request="addCategory"
                :on-error="uploadError"
                :on-change="uploadChange"
                action=""
                >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2m</div>
              </el-upload>
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="triggerAddCategory">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改对话框 -->
      <el-dialog
        title="添加分类对话框"
        :visible.sync="editDialogVisible"
        @close="editDialogClosed"
        width="40%">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <div v-show="editForm.level === 2">
            <el-form-item label="父级分类" prop="parent">
              <el-select v-model="editForm.parent" placeholder="请选择所属分类">
                <el-option v-for="cate in categoryFirstList" :key="cate.categoryId" :label="cate.categoryName" :value="cate.categoryId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分类图片" prop="picture">
              <el-upload
                ref="uploadCategory"
                drag
                :multiple="false"
                :auto-upload="false"
                :http-request="editCategory"
                :on-error="uploadError"
                :on-change="uploadChange"
                action=""
                >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2m</div>
              </el-upload>
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="triggerEditCategory">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Category',
  data () {
    return {
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 1
      },
      // 分类列表
      categoryList: [],
      // 全部一级分类列表
      categoryFirstList: [],
      // 总数据量
      total: 0,
      // 控制添加对话框的显示隐藏
      addDialogVisible: false,
      addForm: {
        name: '',
        level: 1,
        parent: 1
      },
      addFormRules: {
        name: [
          { required: true, message: '分类名称必填', trigger: 'blur' }
        ]
      },
      isUpload: false,
      // 获取要修改的分类对象
      editForm: {},
      editDialogVisible: false
    }
  },
  created () {
    this.getCategoryList()
  },
  watch: {
  },
  methods: {
    // 获取分类列表
    async getCategoryList () {
      const { data } = await this.$http.get('/manage/category/first', { params: this.queryInfo })
      if (data.code !== 0) return this.$message.error('获取分类列表数据失败')
      this.categoryList = data.result.categories
      this.total = data.result.count
    },
    // 监听当前分页大小改变事件
    handleSizeChange (newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.getCategoryList()
    },
    // 监听当前页码发生改变事件
    handleCurrentChange (newPageNum) {
      this.queryInfo.pageNum = newPageNum
      this.getCategoryList()
    },
    /* ------------------------------------------------------------------添加对话框相关事件------------------------------------------------------------------------------------- */
    // 监听添加对话框关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 文件上传失败时触发
    uploadError () {
      this.$message.error('文件上传失败')
    },
    // 监听文件上传事件的改变
    uploadChange (file) {
      if (file) {
        this.isUpload = true
      } else {
        this.isUpload = false
      }
    },
    // 确认添加分类事件
    async addCategory (file) {
      const fd = new FormData()
      fd.append('picture', file.file)
      fd.append('name', this.addForm.name)
      fd.append('level', this.addForm.level)
      fd.append('parent', this.addForm.parent)
      const { data } = await this.$http.post('/manage/category/add', fd)
      if (data.code !== 0) return this.$message.error('添加分类失败')
      this.$message.success('添加分类成功')
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
      this.getCategoryList()
    },
    // 获取全部一级分类列表
    async getCategoryInfo () {
      const { data } = await this.$http.get('/manage/category/first/all')
      if (data.code !== 0) return this.$message.error('获取一级分类数据失败')
      this.categoryFirstList = data.result
    },
    // 打开添加分类对话框事件
    async showAddDialog () {
      this.addDialogVisible = true
      this.getCategoryInfo()
    },
    // 触发文件上传事件,提交表单,若有图片则触发图片上传事件addCategory
    async triggerAddCategory () {
      // 一级分类不用上传图片
      if (this.addForm.level === 1) {
        const { data } = await this.$http.post('/manage/category/add', { name: this.addForm.name, level: this.addForm.level })
        if (data.code !== 0) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.addDialogVisible = false
        this.$refs.addFormRef.resetFields()
        this.getCategoryList()
      } else {
        // 二级分类需要上传图片
        if (!this.isUpload) return this.$message.error('请上传二级分类图片')
        this.$refs.addCategory.submit()
      }
    },
    /* ------------------------------------------------------------------编辑对话框相关事件------------------------------------------------------------------------------------- */
    // 打开编辑对话框
    async showEditDialog (row) {
      this.editDialogVisible = true
      this.getCategoryInfo()
      // 获取指定分类信息
      const { data } = await this.$http.get(`/manage/category/one/${row.id}`)
      if (data.code !== 0) return this.$message.error('获取指定分类失败')
      this.editForm = data.result
      // this.editForm.parent = this.categoryFirstList[this.categoryFirstList.findIndex(item => item.categoryId === Number(data.result.parent))].categoryName
    },
    // 编辑对话框关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 手动提交文件事件
    async editCategory (file) {
      const fd = new FormData()
      fd.append('picture', file.file)
      fd.append('name', this.editForm.name)
      fd.append('level', this.editForm.level)
      fd.append('parent', this.editForm.parent)
      const { data } = await this.$http.post(`/manage/category/edit/${this.editForm.id}`, fd)
      if (data.code !== 0) return this.$message.error(data.msg)
      this.$message.success('修改分类成功')
      this.editDialogVisible = false
      this.isUpload = false
      this.$refs.editFormRef.resetFields()
      this.getCategoryList()
    },
    async triggerEditCategory () {
      if (this.editForm.level === 1) {
        const { data } = await this.$http.post(`/manage/category/edit/${this.editForm.id}`, { name: this.editForm.name })
        if (data.code !== 0) return this.$message.error(data.msg)
        this.$message.success('修改分类成功')
        this.editDialogVisible = false
        this.isUpload = false
        this.$refs.editFormRef.resetFields()
        this.getCategoryList()
      } else {
        // 有修改图片,需要触发图片上传事件
        if (this.isUpload) {
          this.$refs.uploadCategory.submit()
        } else {
          const { data } = await this.$http.post(`/manage/category/edit/${this.editForm.id}`, this.editForm)
          if (data.code !== 0) return this.$message.error(data.msg)
          this.$message.success('修改分类成功')
          this.editDialogVisible = false
          this.isUpload = false
          this.$refs.editFormRef.resetFields()
          this.getCategoryList()
        }
      }
    },
    /* ------------------------------------------------------------------------删除相关事件------------------------------------------------------------------------------------- */
    async deleteCategory (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该管理员账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        // 确认删除
        const { data } = await this.$http.delete(`/manage/category/delete/${id}`)
        if (data.code !== 0) return this.$message.error('删除分类失败')
        this.$message.success('删除分类成功')
        this.getCategoryList()
      } else {
        // 取消删除
        this.$message({ type: 'info', message: '已取消删除' })
      }
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
</style>
