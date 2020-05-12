<template>
  <div>
    <el-container>
      <el-header class="login">后台登录入口</el-header>
      <el-main>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>

        <div class="hengxian"></div>

        <div class="register">
          <router-link to="/user/register">
            <el-button type="warning" plain>还没有账号，注册一个吧...<i class="el-icon-arrow-right el-icon--right"></i></el-button>
          </router-link>
        </div>
      </el-main>
    </el-container>
  </div>
</template>


<script>
  export default {
    data() {
      return {
        ruleForm: {
          username: '',
          password: '',
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
          ],
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`http://localhost:3000/admin/users/login`, this.ruleForm).then(res => {
              if(res.data.success == false){
                this.$message.error(res.data.message);
                return false;
              }
              this.$notify({
                title: '成功',
                message: '恭喜，登录成功!',
                type: 'success'
              });
              this.$router.push({name: 'Home'})
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
