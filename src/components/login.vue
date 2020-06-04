<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="头像" />
      </div>
      <!-- 登录表单区域 -->
      <el-form :model="loginForm" :rules="loginFormrules" ref="loginForm" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input  v-model="loginForm.password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!-- 提交、重置 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
          <el-button type="info" @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginFormrules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods:{
    submitForm(formName) {
        // console.log(this)
        this.$refs.loginForm.validate(async valid => {
            if(!valid)return;
            const { data:res } =await this.$http.post("login",this.loginForm);
           if(res.meta.status !== 200){
             console.log(res);
             return this.$message.error('登录失败！')
           }else{
             this.$message.success("登录成功！")

             window.sessionStorage.setItem("token",res.data.token);
             this.$router.push("/home");
           }
        });
    },
    resetForm(formName){
        this.$refs.loginForm.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  padding: 0 20px;
  margin-top: 90px;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>