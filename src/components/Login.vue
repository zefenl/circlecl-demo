<template>
  <div class="login_container">
    <div class="login_box">
      <div class="titile"><h3>百货商城后台管理系统</h3></div>
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 表单区域 -->
      <div class="login_form">
        <!-- model:双向绑定表单的数据对象 -->
        <!-- rules表单校验规则 -->
        <!-- ref表单对象 -->
        <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
          <!-- 账号 -->
          <el-form-item prop="account">
            <el-input v-model="loginForm.account" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item class="btns">
            <el-button class="storeColor" type="primary" size="small" @click="login">登录</el-button>
            <el-button type="info" size="small" @click="resetLoginForm">重置按钮</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      // 表单绑定对象
      loginForm: {
        account: 'admin',
        password: '123456'
      },
      // 表单验证规则对象
      loginFormRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮,重置表单内容
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 点击登录按钮,登录系统
    login () {
      // 校验表单
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return false
        const { data } = await this.$http.post('/manage/login', this.loginForm)
        if (data.code !== 0) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', data.result.token)
        window.sessionStorage.setItem('name', data.result.account)
        window.sessionStorage.setItem('activePath', '/' + 'graphical')
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .titile {
    position: absolute;
    left: 50%;
    top: 22%;
    transform: translateX(-50%);
  }
  .login_box {
    position: absolute;
    width: 450px;
    height: 320px;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
  }
  .avatar_box {
    position: absolute;
    height: 130px;
    width: 130px;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form {
    position: absolute;
    width: 100%;
    padding: 0 20px;
    bottom: 0;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
.storeColor {
  background-color: #27ba9b;
}
.storeColor:hover {
  background-color: #27ba9b;
  opacity: 0.8;
}
/deep/.el-input__inner:focus {
  border: 1px solid #27ba9b!important;
}
</style>
