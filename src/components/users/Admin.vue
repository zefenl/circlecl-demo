<template>
  <div class="user-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input clearable placeholder="根据管理员手机号进行检索" class="input-with-select" v-model="queryInfo.query" @clear="getAdminListDelay">
            <el-button slot="append" icon="el-icon-search" @click="getAdminListDelay"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="default" class="storeColor" @click="addDialogVisible = true">添加管理员</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="adminList" border stripe>
        <!-- 张开列 -->
        <el-table-column type="expand">
          <template v-slot="slotProps">
            <!-- 一级权限 -->
            <el-row :class="['bd-bottom', 'vertical-center', {'bd-top': i === 0}]" v-for="(item, i) in slotProps.row.hasRolesList" :key="item.id">
              <el-col :span="1">&nbsp;</el-col>
              <el-col :span="4"><el-tag @close="removeRightById(slotProps.row, item)" closable>{{item.name}}</el-tag> <i class="el-icon-caret-right"></i></el-col>
              <el-col :span="18">
                <!-- 二级权限 -->
                <el-row :class="['vertical-center', {'bd-top': k !== 0}]" v-for="(child, k) in item.children" :key="child.id">
                  <el-col :span="5">
                    <el-tag @close="removeRightById(slotProps.row, child)" closable type="success">{{child.name}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                    </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="14"><el-tag @close="removeRightById(slotProps.row, grandson)" closable type="warning" v-for="grandson in child.children" :key="grandson.id">{{grandson.name}}</el-tag></el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="账号" prop="account"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="职位描述" prop="desc"></el-table-column>
        <el-table-column label="操作" width="190">
          <template v-slot="slotProps">
            <!-- 修改用户信息按钮 -->
            <el-tooltip class="item" effect="dark" content="修改管理员信息" placement="top" :enterable="false">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(slotProps.row.id)"></el-button>
            </el-tooltip>
            <!-- 分配权限按钮 -->
            <el-tooltip class="item" effect="dark" content="分配管理员权限" placement="top" :enterable="false">
              <el-button type="info" size="mini" icon="el-icon-setting" @click="showSetRolesDialog(slotProps.row)"></el-button>
            </el-tooltip>
            <!-- 删除用户按钮 -->
            <el-tooltip class="item" effect="dark" content="删除管理员信息" placement="top" :enterable="false">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAdmin(slotProps.row.id)"></el-button>
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
      <!-- 弹出添加管理员对话框 -->
      <el-dialog
        title="添加管理员信息"
        :visible.sync="addDialogVisible"
        @close="addDialogClosed"
        width="30%"
      >
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="账号" prop="account">
            <el-input v-model="addForm.account"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="职位描述" prop="desc">
            <el-input v-model="addForm.desc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" class="storeColor" @click="addAdmin">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 弹出修改用户对话框 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        @close="editDialogClosed"
        width="30%">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
          <el-form-item label="账号" prop="account">
            <el-input v-model="editForm.account" disabled></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="editForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="职位描述" prop="desc">
            <el-input v-model="editForm.desc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" class="storeColor" @click="editAdmin">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 弹出分配权限对话框 -->
      <el-dialog
        title="分配管理员权限"
        :visible.sync="setDialogVisible"
        @close="setDialogClosed"
        node-key="id"
        width="40%">
        <el-tree
          :data="allRoles"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          ref="rolesTree"
          :props="defaultProps">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setDialogVisible = false">取 消</el-button>
          <el-button type="primary" class="storeColor" @click="editRoles">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  data () {
    const checkPassword = (rule, value, cb) => {
      if (value === '') {
        cb()
      } else {
        if (value.length < 6 || value.value.length > 16) {
          cb(new Error('请输入6-16位密码'))
        } else {
          cb()
        }
      }
    }
    return {
      // 查询参数
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 5
      },
      // 用户信息列表
      adminList: [],
      // 总数据量
      total: 0,
      // 控制添加管理员对话框的显示隐藏
      addDialogVisible: false,
      // 控制修改管理员对话框的显示隐藏
      editDialogVisible: false,
      // 控制删除管理员对话框的显示隐藏
      deleteDialogVisible: false,
      // 控制分配管理员权限对话框的显示隐藏
      setDialogVisible: false,
      // 新增管理员对象
      addForm: {
        account: '',
        password: '',
        mobile: '',
        desc: ''
      },
      // 添加管理员表单校验规则
      addFormRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '请输入6-16位密码', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入职位描述', trigger: 'blur' }
        ]
      },
      // 修改管理员对象
      editForm: {},
      // 修改管理员表单校验规则
      editFormRules: {
        password: [
          { validator: checkPassword, message: '请输入6-16位密码', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入职位描述', trigger: 'blur' }
        ]
      },
      // 全部权限列表数据
      allRoles: [],
      // 权限列表的排序规则
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 分配权限默认选中的权限
      defKeys: [],
      // 为谁分配权限
      rowId: '',
      isLoading: false
    }
  },
  created () {
    this.getAdminList()
  },
  methods: {
    // 获取用户列表
    async getAdminList () {
      const { data } = await this.$http.get('/manage/admin', { params: this.queryInfo })
      if (data.code !== 0) return this.$message.error('获取管理员列表数据失败')
      this.adminList = data.result.admins
      this.total = data.result.count
      this.isLoading = false
    },
    async getAdminListDelay () {
      if (this.isLoading) return console.log('禁止重复发送请求')
      this.isLoading = true
      setTimeout(this.getAdminList, 500)
    },
    /* ----------------------------------------------------------------------分页数据事件---------------------------------------------------------------------- */
    // 切换当前显示页数时触发
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getAdminList()
    },
    // 当前页码值发生改变
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getAdminList()
    },
    /* ----------------------------------------------------------------------添加管理员事件---------------------------------------------------------------------- */
    // 监听添加对话框关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加管理员事件
    addAdmin () {
      this.$refs.addFormRef.validate(async valid => {
        // 校验表单
        if (!valid) return this.$message.error('请填写完整的表单')
        // 发送请求
        const { data } = await this.$http.post('/manage/admin/add', this.addForm)
        if (data.code !== 0) return this.$message.error('添加新的管理员失败')
        // 提示
        this.$message.success('添加新的管理员成功')
        // 关闭对话框
        this.addDialogVisible = false
        // 刷新管理员列表
        this.getAdminList()
      })
    },
    /* ----------------------------------------------------------------------修改管理员事件---------------------------------------------------------------------- */
    // 打开修改管理员对话框
    showEditDialog (id) {
      this.getAdminInfo(id)
      this.editForm.id = id
      this.editDialogVisible = true
    },
    // 获取指定管理员的信息
    async getAdminInfo (id) {
      const { data } = await this.$http.get(`/manage/admin/${id}`)
      if (data.code !== 0) return this.$message.error('获取指定管理员信息失败')
      data.result.password = ''
      this.editForm = data.result
    },
    // 监听修改管理员对话框关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改管理员事件
    async editAdmin () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('修改管理员信息失败')
        const { data } = await this.$http.post(`/manage/admin/edit/${this.editForm.id}`, this.editForm)
        if (data.code !== 0) return this.$message.error('添加新的管理员失败')
        // 提示
        this.$message.success('添加新的管理员成功')
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新管理员列表
        this.getAdminList()
      })
    },
    /* ----------------------------------------------------------------------删除管理员事件---------------------------------------------------------------------- */
    async deleteAdmin (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该管理员账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        // 确认删除
        const { data } = await this.$http.delete(`/manage/admin/delete/${id}`)
        if (data.code !== 0) return this.$message.error('删除管理员账号失败')
        this.$message.success('删除管理员账号成功')
        this.getAdminList()
      } else {
        // 取消删除
        this.$message({ type: 'info', message: '已取消删除' })
      }
    },
    /* ----------------------------------------------------------------------权限相关的事件---------------------------------------------------------------------- */
    // 根据id删除对应的权限
    async removeRightById (admin, roles) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        // 确认删除
        const ids = []
        if (roles.children.length > 0) {
          ids.push(roles.id)
          roles.children.forEach(item => {
            ids.push(item.id)
            if (item.children.length > 0) {
              item.children.forEach(child => {
                ids.push(child.id)
              })
            }
          })
        } else {
          ids.push(roles.id)
        }
        const body = {
          id: admin.id,
          roles: JSON.stringify(ids)
        }
        const { data } = await this.$http.post('/manage/roles/delete', body)
        if (data.code !== 0) return this.$message.error('删除管理员权限失败')
        this.$message.success('删除管理员权限成功')
        admin.hasRolesList = data.result
      } else {
        // 取消删除
        this.$message({ type: 'info', message: '已取消删除' })
      }
    },
    // 打开分配权限对话框
    async showSetRolesDialog (row) {
      this.rowId = row.id
      const { data } = await this.$http.get('/manage/roles')
      if (data.code !== 0) return this.$message.error('获取权限列表失败')
      this.$message.success('获取权限列表成功')
      this.allRoles = data.result
      // 获取当前管理员拥有的三级权限数组
      row.hasRolesList.forEach(item => {
        this.getLeafKeys(item, this.defKeys)
      })
      this.setDialogVisible = true
    },
    // 通过递归获取全部三级权限的id
    getLeafKeys (node, arr) {
      if (node.children.length > 0) {
        node.children.forEach(item => {
          this.getLeafKeys(item, arr)
        })
      } else {
        return arr.push(node.id)
      }
    },
    // 监听分配权限对话框关闭事件
    setDialogClosed () {
      this.defKeys = []
    },
    // 确认分配权限
    async editRoles () {
      const keys = [...this.$refs.rolesTree.getCheckedKeys(), ...this.$refs.rolesTree.getHalfCheckedKeys()]
      const roles = JSON.stringify(keys)
      const { data } = await this.$http.post('/manage/roles/edit', { id: this.rowId, roles })
      if (data.code !== 0) return this.$message.error('分配权限失败')
      this.rowId = ''
      this.setDialogVisible = false
      this.$message.success('分配权限成功')
      this.getAdminList()
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
.el-tag {
  margin: 10px;
}
.bd-top {
  border-top: 1px solid #eee;
}
.bd-bottom {
  border-bottom: 1px solid #eee;
}

.vertical-center {
  display: flex;
  align-items: center;
}
/deep/th.el-table__cell {
  background-color: #f5f7fa !important;
}
/deep/.el-dialog {
  min-width: 500px;
}
</style>
