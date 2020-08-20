<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img class="home-logo" src="../images/meishaonv.jpg" alt="电商后台管理系统logo" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="collpseflag ?'64px':'200px'">
        <div class="togglebtn" @click="toggleCollpse">|||</div>
        <el-menu
          default-active="2"
          background-color="pink"
          text-color="#fff"
          active-text-color="red"
          :unique-opened="true"
          :collapse="collpseflag"
          :collapse-transition="false"
          router
        >
        <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id" >
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+ittem.path" v-for="ittem in item.children" :key="ittem.id">
                <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{ ittem.authName }}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->                                  
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
export default {
  data() {
      return {
        // 左侧菜单栏数据
        menulist:[],
        icons:{
          125:'el-icon-user-solid',
          103:'el-icon-s-tools',
          101:'el-icon-s-goods',
          102:'el-icon-s-order',
          145:'el-icon-s-data'
        },
        collpseflag:false,
      }
  },
  created(){
      this.getMenusList();
    },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
     async getMenusList(){
        const { data:res } = await this.$http.get("menus");
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menulist = res.data

    },
    toggleCollpse(){
      this.collpseflag = !this.collpseflag;
    }
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
  .togglebtn{
    height:25px;
    background-color:pink;
    text-align: center;
    letter-spacing: 2px;
    cursor: pointer;
  }
}


.el-main {
  background-color: #eaedf1;
}
</style>