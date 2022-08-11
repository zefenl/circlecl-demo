<template>
  <div class="addgood-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>修改商品信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤图区域 -->
      <el-steps :space="300" :active="activeStep - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品规格"></el-step>
        <el-step title="商品库存"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签页区域 -->
      <el-form :model="addForm" ref="addFormRef" :rules="AddRules" label-position="top">
        <el-tabs tab-position="left" v-model="activeStep" :before-leave="beforeTabLeave" @tab-click="tabClick">
          <el-tab-pane  label="基本信息" name="0">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="desc">
              <el-input v-model="addForm.desc"></el-input>
            </el-form-item>
            <el-form-item label="品牌名称" prop="brand">
              <el-input v-model="addForm.brand"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="category">
              <el-cascader
                prop="category"
                v-model="addForm.category"
                :options="categoryList"
                @change="handleChange"
                :props="{ expandTrigger: 'hover', value: 'id', label: 'name', children: 'children' }"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品规格" name="1">
            <!-- 添加规格按钮 -->
            <el-row :gutter="10">
              <el-col :span="7"><el-input placeholder="请输入要添加商品规格名称" v-model="specName" clearable> </el-input></el-col>
              <el-col :span="5"><el-button type="primary" size="default" class="storeColor" @click="addSpecName">添加</el-button></el-col>
            </el-row>
            <!-- 查看规格列表 -->
            <el-table :data="addForm.specs" style="width: 100%" border stripe>
              <el-table-column type="expand">
                <template v-slot="slotProps">
                  {{slotProps.row}}
                  <el-row>
                    <el-col :span="1">&nbsp;</el-col>
                    <el-col :span="23">
                      <el-tag v-for="(value, i) in slotProps.row.values" :key="i" closable @close="handleClose(slotProps.row.values, value)">{{value}}</el-tag>
                      <el-input
                        class="input-new-tag"
                        v-if="slotProps.row.inputVisible"
                        v-model="slotProps.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(slotProps.row)"
                        @blur="handleInputConfirm(slotProps.row)"
                      >
                      </el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="showInput(slotProps.row)">+ New Tag</el-button>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column prop="name" label="规格名称"></el-table-column>
              <el-table-column label="操作">
                <template v-slot="slotProps">
                  <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditSpecsDialog(slotProps.row)">编辑</el-button>
                  <el-button type="delete" icon="el-icon-delete" size="mini" @click="deleteSpec(slotProps.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="商品库存" name="2">
            <el-table :data="addForm.skus" style="width: 100%" border stripe>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column label="规格名称" prop="category">
                <template v-slot="slotProps">
                  <el-tag><span v-for="(item,i) in slotProps.row.specs" :key="i">{{item.name + ': ' + item.value + ' ' }}</span></el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" prop="oldPrice" width="80">
                <template v-slot="slotProps">
                  <el-button type="danger" size="small" @click="deleteSkus(slotProps.row)">删除</el-button>
                </template>
              </el-table-column>
              <el-table-column label="价格" prop="oldPrice">
                <template v-slot="slotProps">
                  <el-input type="number" clearable placeholder="请输入价格" v-model="slotProps.row.oldPrice"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="打折后的价格" prop="newPrice">
                <template v-slot="slotProps">
                  <el-input type="number" clearable placeholder="请输入打折价格" v-model="slotProps.row.newPrice"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="剩余库存" prop="inventory">
                <template v-slot="slotProps">
                  <el-input type="number" clearable placeholder="请输入剩余库存量" v-model="slotProps.row.inventory"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="3">
            <el-row :gutter="10">
              <el-col :span="4"><el-input clearable placeholder="请添加商品属性名称" v-model="addAttrForm.name"></el-input></el-col>
              <el-col :span="4"><el-input clearable placeholder="请添加商品属性的值" v-model="addAttrForm.value"></el-input></el-col>
              <el-col :span="4"><el-button type="primary" size="default" class="storeColor" @click="addAttr">添加商品属性</el-button></el-col>
            </el-row>
            <el-table :data="addForm.attribute" style="width: 100%" border stripe>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column label="属性名称" prop="name"></el-table-column>
              <el-table-column label="属性的值" prop="value"></el-table-column>
              <el-table-column label="操作">
                <template v-slot="slotProps">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditAttrDialog(slotProps.row)">编辑</el-button>
                  <el-button type="delete" icon="el-icon-delete" size="mini" @click="deleteAttr(slotProps.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="商品轮播图片" name="4">
            <div class="pic-container">
              <el-upload
                ref="uploadGoodPic"
                drag
                :multiple="false"
                :auto-upload="false"
                :on-error="uploadError"
                :on-change="uploadPicChange"
                action=""
                >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">请上传商品图片</div>
              </el-upload>
              <el-upload
                ref="uploadGoodPicRotation"
                drag
                :multiple="true"
                :auto-upload="false"
                :on-error="uploadError"
                :on-change="uploadRotationChange"
                action=""
                >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">请上传商品轮播图的图片</div>
              </el-upload>
            </div>

          </el-tab-pane>
          <el-tab-pane label="商品详情介绍图片" name="5">
            <el-upload
              ref="uploadPicInfo"
              drag
              :multiple="true"
              :auto-upload="false"
              :on-error="uploadError"
              :on-change="changePicInfoUpload"
              action=""
              >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">请上传商品详情介绍图片</div>
            </el-upload>
            <div class="btn-center">
              <el-button @click="editGoods" class="mt" type="primary" siz="medium">修改商品</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 修改规格名称对话框 -->
      <el-dialog
        title="修改规格信息"
        :visible.sync="editSpecDialogVisible"
        width="30%"
        :before-close="editSpecHandleClose">
        <el-form ref="form" label-width="80px" ret="editSpecRef">
          <el-form-item label="规格名称">
            <el-input v-model="editSpecName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editSpecDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSpec">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改属性信息对话框 -->
      <el-dialog
        title="修改规格信息"
        :visible.sync="editAttrDialogVisible"
        width="30%"
        :before-close="editAttrHandleClose">
        <el-form ref="form" label-width="80px" ret="editAttrRef">
          <el-form-item label="规格名称">
            <el-input v-model="editAttrForm.name"></el-input>
          </el-form-item>
          <el-form-item label="规格值">
            <el-input v-model="editAttrForm.value"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editAttrDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAttr">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AddGood',
  data () {
    return {
      // 当前激活的tabs栏
      activeStep: '0',
      // 修改商品的数据对象
      addForm: {
        name: '',
        desc: '',
        brand: '',
        category: [],
        specs: [],
        attribute: []
      },
      // 表单的校验规则
      AddRules: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入商品的描述信息', trigger: 'blur' }],
        brand: [{ required: true, message: '请输入商品的品牌名称', trigger: 'blur' }],
        category: [{ required: true, message: '请选择商品所属分类', trigger: 'blur' }]
      },
      // 商品的分类列表
      categoryList: [],
      // 要添加的规格名称
      specName: '',
      // 修改规格信息的对话框
      editSpecDialogVisible: false,
      // 修改属性信息的对话框
      editAttrDialogVisible: false,
      // 修改绑定的值
      editSpecName: '',
      // 要被修改的值
      editSpecNameBefore: '',
      // 添加属性对象
      addAttrForm: {
        name: '',
        value: ''
      },
      // 修改属性对象
      editAttrForm: {
        name: '',
        value: ''
      },
      // 要被修改的属性名称
      editAttrBefore: '',
      // 商品图片
      file: {},
      // 商品轮播图
      files: [],
      id: 1000,
      // 是否需要计算笛卡尔积
      isRender: false,
      filesInfoList: []
    }
  },
  created () {
    this.getCategoryList()
    this.getGoodInfo()
  },
  methods: {
    // 获取商品分类列表数据
    async getCategoryList () {
      const { data } = await this.$http.get('/manage/category/all')
      if (data.code !== 0) return this.$message.error('获取分类列表数据失败')
      this.categoryList = data.result
    },
    async getGoodInfo () {
      const id = this.$route.params.id
      const { data } = await this.$http.get(`/manage/good/${id}`)
      if (data.code !== 0) return this.$message.error('获取商品详细数据失败')
      this.addForm = data.result[0]
      this.addForm.category = [this.addForm.category1_id, this.addForm.category2_id]
      this.addForm.skus = this.addForm.skus.map(item => ({
        id: item.sku_id,
        oldPrice: item.old_price,
        newPrice: item.new_price,
        inventory: item.inventory,
        specs: item.specs
      }))
      this.addForm.specs = this.addForm.specs.map(ele => ({
        name: ele.name,
        values: ele.values,
        inputVisible: false,
        inputValue: ''
      }))
      this.addForm.attribute = []
      this.addForm.attr.map(item => {
        Object.keys(item).forEach(key => {
          this.addForm.attribute.push({
            name: key,
            value: item[key]
          })
        })
      })
    },
    // 级联选择器改变事件
    handleChange () {
    },
    // 标签切换前的钩子
    beforeTabLeave (activeName, oldName) {
      if (oldName === '0' && this.addForm.category.length < 2) {
        this.$message.error('请选择商品所属分类')
        return false
      } else if (oldName === '1' && this.addForm.specs.length === 0) {
        this.$message.error('请添加商品规格信息')
        return false
      }
    },
    // 标签点击时的钩子
    tabClick () {
      // 笛卡尔积求出规格列表
      if (this.activeStep === '2') {
        if (this.isRender) {
          // 取出所有规格参数,二维数组
          const oldPrice = this.addForm.skus[0].oldPrice
          const newPrice = this.addForm.skus[0].newPrice
          const inventory = this.addForm.skus[0].inventory
          this.addForm.skus = []
          const arr = this.addForm.specs.map(item => item.values)
          const names = this.addForm.specs.map(item => item.name)
          const set = Array.prototype.reduce.call(arr, function (a, b) {
            var ret = []
            a.forEach(function (itema) {
              b.forEach(function (itemb) {
                ret.push(itema.concat([itemb]))
              })
            })
            return ret
          }, [[]])
          set.forEach((item, i) => {
            this.addForm.skus.push({
              id: this.id,
              oldPrice: oldPrice,
              newPrice: newPrice,
              inventory: inventory,
              specs: names.map((ele, i) => ({ name: ele, value: item[i] }))
            })
            this.id++
          })
          this.isRender = false
        }
      } else if (this.activeStep === '3') {
        this.addForm.attribute = []
        this.addForm.attribute.push({ name: '商品名称', value: this.addForm.name })
      }
    },
    /* ----------------------------------------------------------------规格属性相关事件------------------------------------------------------------------------------------------- */
    // 添加商品规格名称
    addSpecName () {
      if (this.specName === '') return this.$message.error('不允许添加空规格名称')
      let flag = true
      for (let i = 0; i < this.addForm.specs.length; i++) {
        if (this.addForm.specs[i].name === this.specName) {
          flag = false
          this.$message.error('该规格名称已经存在')
          break
        }
      }
      if (flag) {
        this.addForm.specs.push({ name: this.specName, values: [], inputVisible: false, inputValue: '' })
        this.specName = ''
      }
      this.isRender = true
    },
    // 监听修改商品规格信息对话框关闭
    editSpecHandleClose () {
      this.$refs.editSpecRef.resetFields()
    },
    // 打开修改规格对话框
    showEditSpecsDialog (row) {
      this.editSpecDialogVisible = true
      this.editSpecName = row.name
      this.editSpecNameBefore = row.name
    },
    // 确认修改规格事件
    editSpec () {
      // 查找要被修改的值
      const index = this.addForm.specs.findIndex(item => item.name === this.editSpecNameBefore)
      // 查找要修改的值是否存在
      const isHas = this.addForm.specs.findIndex(item => item.name === this.editSpecName)
      if (isHas !== -1) return this.$message.error('要修改的规格已经存在')
      this.addForm.specs[index].name = this.editSpecName
      this.isRender = true
      this.editSpecDialogVisible = false
    },
    // 删除规格
    deleteSpec (row) {
      this.$confirm('此操作将永久删除该规格, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.addForm.specs.findIndex(item => item.name === row.name)
        this.addForm.specs.splice(index, 1)
        this.$message({ type: 'success', message: '删除成功!' })
        this.isRender = true
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    // 新增规格属性的值,失去焦点或按下回车都会触发
    handleInputConfirm (row) {
      if (row.inputValue.trim() !== '') {
        const index = row.values.findIndex(item => item === row.inputValue)
        if (index !== -1) {
          this.$message.error('该规格的值已经存在')
        } else {
          row.values.push(row.inputValue.trim())
        }
      }
      this.isRender = true
      row.inputVisible = false
      row.inputValue = ''
    },
    // 显示新增规格属性的值的输入框
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除商品规格的值
    handleClose (values, value) {
      values.forEach((item, i) => {
        if (item === value) {
          values.splice(i, 1)
        }
      })
      this.isRender = true
    },
    /* ----------------------------------------------------------------商品属性相关事件------------------------------------------------------------------------------------------- */
    // 打开编辑属性对话框按钮
    showEditAttrDialog (row) {
      this.editAttrDialogVisible = true
      this.editAttrBefore = row.name
      this.editAttrForm.name = row.name
      this.editAttrForm.value = row.value
    },
    // 监听编辑属性对话框关闭事件
    editAttrHandleClose () {
      this.$refs.editAttrRef.resetFields()
    },
    // 往表格插入商品属性数据
    addAttr () {
      // 判断是否存在相同的属性名
      const index = this.addForm.attribute.findIndex(item => item.name === this.addAttrForm.name)
      if (index !== -1) return this.$message.error('该商品属性已经存在')
      this.addForm.attribute.push({ name: this.addAttrForm.name, value: this.addAttrForm.value })
      this.addForm.name = ''
      this.addForm.value = ''
    },
    // 修改商品属性数据
    editAttr () {
      const index = this.addForm.attribute.findIndex(item => item.name === this.editAttrBefore)
      const isHas = this.addForm.attribute.findIndex(item => item.name === this.editAttrForm.name)
      if (this.editAttrBefore === this.editAttrForm.name) {
        this.addForm.attribute[index].value = this.editAttrForm.value
      } else {
        if (isHas !== -1) return this.$message.error('要修改的商品属性已经存在')
        this.addForm.attribute[index].name = this.editAttrForm.name
        this.addForm.attribute[index].value = this.editAttrForm.value
      }
      this.editAttrDialogVisible = false
    },
    // 删除商品属性数据
    deleteAttr (row) {
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.addForm.attribute.findIndex(item => item.name === row.name)
        this.addForm.attribute.splice(index, 1)
        this.$message({ type: 'success', message: '删除成功!' })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    // 图片上传失败回调
    uploadError () {
      this.$message.error('图片上传失败')
    },
    // 保存上传的图片信息
    uploadPicChange (file) {
      this.file = file
    },
    // 保存上传的图片的轮播图信息
    uploadRotationChange (file, fileList) {
      this.files = fileList
    },
    // 修改商品信息
    async editGoods () {
      const fd = new FormData()
      // 处理图片
      if (JSON.stringify(this.file) !== '{}') {
        fd.append('pic', this.file.raw)
      }
      if (this.files.length > 0) {
        this.files.forEach(item => {
          fd.append('main_pic', item.raw)
        })
      }
      if (this.filesInfoList.length > 0) {
        this.filesInfoList.forEach(item => {
          fd.append('pic_info', item.raw)
        })
      }
      const specs = this.addForm.specs.map(item => ({ [item.name]: item.values }))
      const attribute = this.addForm.attribute.map(item => ({ [item.name]: item.value }))
      fd.append('name', this.addForm.name)
      fd.append('desc', this.addForm.desc)
      fd.append('brand', this.addForm.brand)
      fd.append('category1_id', this.addForm.category[0])
      fd.append('category2_id', this.addForm.category[1])
      fd.append('specs', JSON.stringify(specs))
      fd.append('attr', JSON.stringify(attribute))
      fd.append('skus', JSON.stringify(this.addForm.skus))
      const { data } = await this.$http.post(`/manage/good/update/${this.$route.params.id}`, fd)
      if (data.code !== 0) return this.$message.error(data.msg)
      this.$message.success('修改商品成功')
      this.$router.push('/spu')
    },
    // 接收上传的图片保存到fileList列表中
    changeUpload (file, fileList) {
      this.fileList = fileList
    },
    changePicInfoUpload (file, fileList) {
      this.filesInfoList = fileList
    },
    // 删除不必要的商品规格
    deleteSkus (row) {
      const index = this.addForm.skus.findIndex(item => item.id === row.id)
      this.addForm.skus.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
  justify-content: center;
}
.el-step__title {
  font-size: 13px;
}
.el-tag {
  margin-right: 10px;
}
.input-new-tag {
  width: 120px;
}
.mt {
  margin-top: 15px;
}
.pic-container {
  display: flex;
  justify-content: space-around;
}
.btn-center {
  display: flex;
  justify-content: space-around;
}
</style>
