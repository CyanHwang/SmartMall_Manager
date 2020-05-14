<template>
  <div style="width:100%;">
    <el-container id="loginBox">
      <el-header class="title">SmartMall 后台登录入口</el-header>
      <el-main>
        <el-form
          :model="model"
          status-icon
          :rules="rules"
          @submit.native.prevent="login('model')"
          ref="model"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              type="text"
              v-model="model.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="model.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit">提交</el-button>
            <el-button @click="model = {}">重置</el-button>
          </el-form-item>
        </el-form>

        <div class="line"></div>

        <div class="registerButton">
          <el-button type="warning" plain @click="$router.push('/sign-up')"
            >还没有账号，注册一个吧...<i
              class="el-icon-arrow-right el-icon--right"
            ></i
          ></el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: {},
      rules: {
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    login(val) {
      this.$refs[val].validate(async (valid) => {
        if (valid) {
          const res = await this.$http.post(`users/sign-in`, this.model);
          if (res.data.success == false) {
            this.$message.error(res.data.message);
            return false;
          }
          localStorage.token = "Bearer " + res.data.token;
          this.$notify({
            title: "成功",
            message: "恭喜，登录成功!",
            type: "success",
          });
          this.$router.push("/");
        } else {
          console.log("请检查输入是否正确");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
#loginBox {
  width: 500px;
  margin: 5% auto;
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 10px;
  animation-name: gif;
  animation-duration: 0.6s;
}

@keyframes gif {
  0% {
    opacity: 0;
    transform: translate(0, -200px);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}

.title {
  color: #08c;
}

.line {
  margin-top: 60px;
  border-top: 1px solid #eeeeee;
}

.registerButton {
  margin-top: 20px;
}
</style>
