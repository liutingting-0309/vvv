<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img class="home-logo" src="../assets/logo.png" alt="电商后台管理系统logo" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          default-active="2"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item index="1-4-1">
                <template slot="title">
              <i class="el-icon-location"></i>
              <span>选项一</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
</template>

<script>
export default {
    created(){
        this.getMenusList();
    },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
     getMenusList(){
        const result =  this.$http.get("menus");
        console.log(result);
    },
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  // background-color: #373d41;
  background-color: yellow;
  color: #fff;
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;

    img {
      width: 66px;
      height: 100%;
    }
    span {
      margin-left: 10px;
    }
  }

  .el-button {
    margin: 10px 0;
  }
}

.el-aside {
  // background-color: #333744;
  background-color: pink;
  color: #fff;
}

.el-main {
  background-color: #eaedf1;
}
</style>