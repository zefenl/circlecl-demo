<template>
  <div class="user-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input clearable placeholder="根据用户手机号进行检索" class="input-with-select" v-model="queryInfo.query" @clear="getUserListDelay">
            <el-button slot="append" icon="el-icon-search" @click="getUserListDelay"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="default" class="storeColor" @click="openAddDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="账号" prop="account"></el-table-column>
        <el-table-column label="昵称" prop="nickname"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="头像">
          <template v-slot="slotProps">
            <img :src="`http://localhost:3000/user/${slotProps.row.avatar}`" alt="">
          </template>
        </el-table-column>
        <el-table-column label="性别" prop="gender" width="50"></el-table-column>
        <el-table-column label="生日" prop="birthday">
          <template v-slot="slotProps">
            {{ slotProps.row.birthday | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="地区" prop="fullLocation"></el-table-column>
        <el-table-column label="操作" width="190">
          <template v-slot="slotProps">
            <!-- 修改用户信息按钮 -->
            <el-tooltip class="item" effect="dark" content="修改用户信息" placement="top" :enterable="false">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEidtDialog(slotProps.row.user_id)"></el-button>
            </el-tooltip>
            <!-- 查看用户地址按钮 -->
            <el-tooltip class="item" effect="dark" content="查看用户地址信息" placement="top" :enterable="false">
              <el-button type="info" size="mini" icon="el-icon-setting" @click="showAddressDialog(slotProps.row.user_id)"></el-button>
            </el-tooltip>
            <!-- 删除用户按钮 -->
            <el-tooltip class="item" effect="dark" content="删除用户信息" placement="top" :enterable="false">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteUser(slotProps.row.user_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[2, 5, 7, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!-- 弹出添加用户对话框 -->
      <el-dialog
        title="添加用户信息"
        :visible.sync="addDialogVisible"
        @close="addDialogClosed"
        width="30%">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
          <el-form-item label="头像">
            <el-upload
              ref="uploadAvatar"
              drag
              :multiple="false"
              :auto-upload="false"
              :http-request="addUser"
              :on-error="uploadError"
              :on-change="uploadChange"
              action=""
              >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2m</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="账号" prop="account">
            <el-input v-model="addForm.account"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="nickname">
            <el-input v-model="addForm.nickname"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio v-model="addForm.gender" label="男">男</el-radio>
            <el-radio v-model="addForm.gender" label="女">女</el-radio>
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker
              v-model="addForm.birthday"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="地区" prop="fullLocation">
            <el-cascader
            v-model="addForm.fullLocation"
            :options="fullLocations"
            :props="{ expandTrigger: 'hover', value: 'name', label: 'name', children: 'areaList' }"></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" class="storeColor" @click="triggerAddUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 弹出修改用户对话框 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        @close="editDialogClosed"
        width="30%">
        <el-form :model="editForm" :rules="addFormRules" ref="editFormRef">
          <el-form-item label="头像">
            <el-upload
              ref="uploadEditAvatar"
              drag
              :multiple="false"
              :auto-upload="false"
              :http-request="editUser"
              :on-error="uploadError"
              :on-change="uploadChange"
              action=""
              >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2m</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="账号" prop="account">
            <el-input v-model="editForm.account" disabled></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="editForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="nickname">
            <el-input v-model="editForm.nickname"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio v-model="editForm.gender" label="男">男</el-radio>
            <el-radio v-model="editForm.gender" label="女">女</el-radio>
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker
              v-model="editForm.birthday"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="地区" prop="fullLocation">
            <el-cascader
            v-model="editForm.fullLocation"
            :options="fullLocations"
            :props="{ expandTrigger: 'hover', value: 'name', label: 'name', children: 'areaList' }"></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" class="storeColor" @click="triggerEditUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    return {
      // 查询参数
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 5
      },
      // 用户信息列表
      userList: [],
      // 总数据量
      total: 0,
      // 控制添加用户对话框的显示隐藏
      addDialogVisible: false,
      // 控制修改用户对话框的显示隐藏
      editDialogVisible: false,
      // 控制删除用户对话框的显示隐藏
      deleteDialogVisible: false,
      // 新增用户对象
      addForm: {
        account: '',
        password: '',
        nickname: '',
        mobile: '12345678910',
        gender: '男',
        birthday: '',
        fullLocation: []
      },
      // 添加用户表单校验规则
      addFormRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        birthday: [
          { required: true, message: '请选中生日', trigger: 'blur' }
        ],
        fullLocation: [
          { type: 'array', required: true, message: '请选择分类', trigger: 'blur' }
        ]
      },
      // 地区
      fullLocations: [],
      // 判断文件是否上传成功
      isUpload: false,
      // 修改用户对象
      editForm: {},
      isLoading: false
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      const { data } = await this.$http.get('/manage/users', { params: this.queryInfo })
      if (data.code !== 0) return this.$message.error(data.msg)
      this.userList = data.result.users
      this.total = data.result.count
      this.isLoading = false
    },
    async getUserListDelay () {
      if (this.isLoading) return console.log('禁止重复发送请求')
      this.isLoading = true
      setTimeout(this.getUserList, 1000)
    },
    // 获取地区数据
    async getArea () {
      const { data } = await this.$http.get('http://localhost:3000/public/area.json')
      this.fullLocations = data
    },
    /* ----------------------------------------------------------------------分页数据事件---------------------------------------------------------------------- */
    // 切换当前显示页数时触发
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    // 当前页码值发生改变
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getUserList()
    },
    /* ----------------------------------------------------------------------添加用户事件---------------------------------------------------------------------- */
    // 打开添加用户对话框
    openAddDialog () {
      this.addDialogVisible = true
      this.getArea()
    },
    // 监听添加用户对话框关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 触发添加用户点击事件
    triggerAddUser () {
      if (this.isUpload) {
        this.$refs.uploadAvatar.submit()
      } else {
        this.$message.error('请上传头像')
      }
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
    // 添加用户
    addUser (file) {
      this.$refs.addFormRef.validate(async valid => {
        // 校验表单内容
        if (!valid) return this.$message.error('请填写完整表单内容')
        if (!file) return this.$message.error('请添加头像')
        const fd = new FormData()
        fd.append('avatar', file.file)
        fd.append('account', this.addForm.account)
        fd.append('password', this.addForm.password)
        fd.append('nickname', this.addForm.nickname)
        fd.append('mobile', this.addForm.mobile)
        fd.append('gender', this.addForm.gender)
        fd.append('birthday', this.addForm.birthday)
        fd.append('fullLocation', this.addForm.fullLocation)
        // 发送请求
        const { data } = await this.$http.post('/manage/users/create', fd)
        if (data.code !== 0) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        // 关闭对话框
        this.addDialogVisible = false
        // 清空文件上传列表
        this.$refs.uploadAvatar.clearFiles()
        this.isUpload = false
        // 重新加载数据
        this.getUserList()
      })
    },
    /* ----------------------------------------------------------------------修改用户事件---------------------------------------------------------------------- */
    // 获取要修改的用户信息
    async showEidtDialog (userId) {
      this.editDialogVisible = true
      this.getArea()
      const { data } = await this.$http.get(`/manage/users/${userId}`)
      if (data.code !== 0) return this.$message.error('获取指定用户信息失败')
      this.editForm = data.result
      this.editForm.password = ''
      this.editForm.fullLocation = data.result.fullLocation.split(',')
      this.editForm.userId = userId
    },
    // 监听要修改的对话框关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 触发修改事件信息
    async triggerEditUser () {
      // 有上传文件
      if (this.isUpload) {
        this.$refs.uploadEditAvatar.submit()
      } else {
        // 没有上传文件,直接将表单内容上传
        if (this.editForm.password === '') {
          delete this.editForm.password
        }
        if (this.editForm.password === '') {
          delete this.editForm.fullLocation
        }
        try {
          const { data } = await this.$http.post(`/manage/users/edit/${this.editForm.userId}`, this.editForm)
          if (data.code !== 0) return this.$message.error('修改用户信息失败')
          this.$message.success('修改用户信息成功')
          // 关闭对话框
          this.editDialogVisible = false
          // 重新加载数据
          this.getUserList()
        } catch (error) {
          this.$message.error('请求参数出现错误')
        }
      }
    },
    // 手动触发文件上传事件
    async editUser (file) {
      // 校验表单内容
      const fd = new FormData()
      fd.append('avatar', file.file)
      fd.append('account', this.editForm.account)
      fd.append('password', this.editForm.password)
      fd.append('nickname', this.editForm.nickname)
      fd.append('mobile', this.editForm.mobile)
      fd.append('gender', this.editForm.gender)
      fd.append('birthday', this.editForm.birthday)
      fd.append('fullLocation', this.editForm.fullLocation)
      // 发送请求
      try {
        const { data } = await this.$http.post(`/manage/users/edit/${this.editForm.userId}`, fd)
        if (data.code !== 0) return this.$message.error('修改用户信息失败')
        this.$message.success('修改用户信息成功')
        // 关闭对话框
        this.editDialogVisible = false
        // 清空文件上传列表
        this.$refs.uploadEditAvatar.clearFiles()
        this.isUpload = false
        // 重新加载数据
        this.getUserList()
      } catch (error) {
        this.$message.error('修改用户信息失败')
      }
    },
    /* ----------------------------------------------------------------------删除用户事件---------------------------------------------------------------------- */
    // 根据id删除用户
    async deleteUser (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        // 确认删除
        const { data } = await this.$http.delete(`/manage/users/delete/${id}`)
        if (data.code !== 0) return this.$message.error('删除用户失败')
        this.$message.success('删除用户成功')
        this.getUserList()
      } else {
        // 取消删除
        this.$message({ type: 'info', message: '已取消删除' })
      }
    },
    /* ----------------------------------------------------------------------查看用户地址事件---------------------------------------------------------------------- */
    async showAddressDialog (id) {
      const { data } = await this.$http.get(`/manage/users/address/${id}`)
      if (data.code !== 0) return this.$message.error('获取用户地址信息失败')
      this.$message.success('获取用户地址信息成功')
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  img {
    height: 70px;
    display: block;
    margin: 0 auto;
  }
}
/deep/.el-input__inner:focus {
  border: 1px solid #27ba9b!important;
}
/deep/th.el-table__cell {
  background-color: #f5f7fa !important;
}
/deep/.el-dialog {
  min-width: 500px;
}

</style>
