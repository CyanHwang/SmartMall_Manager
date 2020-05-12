<template>
  <div>
    <el-container>
      <el-header class="login">欢迎注册</el-header>
      <el-main>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="check_password">
            <el-input type="password" v-model="ruleForm.check_password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>

        <div class="hengxian"></div>

        <div class="register">
          <router-link to="/user/login">
            <el-button type="warning" plain icon="el-icon-arrow-left">已有账号，去登录吧...</el-button>
          </router-link>
        </div>
      </el-main>
    </el-container>
  </div>
</template>


<script>
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          username: '',
          password: '',
          check_password: '',
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
          ],
          check_password: [
            { validator: validatePass, trigger: 'blur' }
          ],
        },
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`http://localhost:3000/admin/users/register`, this.ruleForm).then(res => {
              if(res.data.success == false){
                this.$message.error(res.data.message);
                return false;
              }
              this.$notify({
                title: '成功',
                message: '恭喜，注册成功!',
                type: 'success'
              });
              this.$router.push({name: 'Login'})
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style>
  .login {
    color: #08c;
  }

  .hengxian {
    margin-top: 60px;
    border-top: 1px solid #eeeeee;
  }

  .register {
    margin-top: 20px;
  }

  .register a {
    text-decoration: none;
  }

</style>
