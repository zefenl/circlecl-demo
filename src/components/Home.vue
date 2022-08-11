<template>
  <el-container class="home-container">
    <!-- 页面头部 -->
    <el-header>
      <div class="logo">
        <span>百货商城后台管理系统</span>
      </div>
      <el-button class="storeColor" type="primary" size="medium" @click="logout"
        >退出</el-button
      >
    </el-header>
    <el-container>
      <!-- 页面侧边栏 -->
      <el-aside width="200px">
        <!-- 头像区域 -->
        <div class="demo-basic--circle">
          <div class="block"><img src="../assets/logo.png" alt="" /></div>
          <div class="sub-title">欢迎您:{{manageName}}</div>
        </div>
        <!-- 菜单栏区域 -->
        <div class="toggle-button">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#27ba9b"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-menu-item index="/graphical" @click="saveNavState('graphical')">
            <i class="iconfont icon-baobiao"></i>
            <span slot="title">可视化列表</span>
          </el-menu-item>
          <!-- 一级菜单 -->
          <el-submenu :index="''+item.id" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="menuIconList[item.id]"></i>
              <span>{{ item.name}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + child.path" v-for="child in item.children" :key="child.id" @click="saveNavState(child.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{child.name}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="/txmap" @click="saveNavState('txmap')">
            <i class="iconfont icon-baobiao"></i>
            <span slot="title">腾讯地图</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 页面底部 -->
        <el-footer>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { addAsyncRouter } from '@/router/asyncRouter'
export default {
  name: 'Home',
  data () {
    return {
      // 菜单栏列表数据
      menuList: [],
      // 菜单栏列表字体图标
      menuIconList: {
        1: 'iconfont icon-users',
        4: 'iconfont icon-category',
        6: 'iconfont icon-goodsfill',
        9: 'iconfont icon-dingdan'
      },
      // 是否折叠菜单栏列表
      isCollapse: false,
      // 默认的激活选项
      activePath: '/graphical',
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      name: 'xxx',
      manageName: window.sessionStorage.getItem('name')
    }
  },
  created () {
    this.getMenList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出登录
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取菜单栏列表
    async getMenList () {
      const { data } = await this.$http.get('/manage/menus')
      if (data.code !== 0) return this.$message.error('获取菜单栏列表数据失败')
      this.menuList = data.result
      const menusRouter = []
      this.menuList.forEach(item => {
        item.children.forEach(rou => {
          menusRouter.push(rou.path)
        })
      })
      addAsyncRouter(menusRouter)
    },
    // 点击菜单栏选项将path路径存储到sessionstorage中
    saveNavState (path) {
      window.sessionStorage.setItem('activePath', '/' + path)
      this.activePath = '/' + path
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  .logo {
    height: 100%;
    display: flex;
    border-radius: 50%;
    justify-content: space-between;
    align-items: center;
    img {
      height: 100%;
    }
  }
}
.el-aside {
  background-color: #333744;
  .demo-basic--circle {
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    .block {
      opacity: 0.7;
      margin-bottom: 5px;
    }
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
  }
  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-menu {
    border-right: 0;
  }
  .iconfont {
    margin-right: 5px;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  width: 100%;
  height: 100%;
}

</style>
