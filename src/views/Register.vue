<template>
  <div style="width:100%">
    <el-container id="registerBox">
      <el-header class="title">欢迎注册</el-header>
      <el-main>
        <el-form
          :model="model"
          status-icon
          :rules="rules"
          @submit.native.prevent="register('model')"
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

          <el-form-item label="密码" prop="check_password">
            <el-input
              type="password"
              v-model="model.check_password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit">提交</el-button>
            <el-button @click="model = {}">重置</el-button>
          </el-form-item>
        </el-form>

        <div class="line"></div>

        <div class="loginButton">
          <el-button
            type="warning"
            plain
            @click="$router.push('/sign-in')"
            icon="el-icon-arrow-left"
            >已有账号，去登录吧...</el-button
          >
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.model.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      model: {},
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        check_password: [{ validator: validatePass, trigger: "blur" }],
      },
    };
  },
  methods: {
    register(val) {
      this.$refs[val].validate(async (valid) => {
        if (valid) {
          const res = await this.$http.post(`users/sign-up`, this.model);
          if (res.data.success == false) {
            this.$message.error(res.data.message);
            return false;
          }
          localStorage.token = "Bearer " + res.data.token;
          this.$notify({
            title: "成功",
            message: "恭喜，注册成功，已为您自动登录！",
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
#registerBox {
  width: 500px;
  margin: 5% auto;
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 10px;
  animation-name: gif;
  animation-duration: .6s;
}

@keyframes gif {
  0% {
    opacity: 0;
    transform: translate(0, 200px);
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

.loginButton {
  margin-top: 20px;
}
</style>
