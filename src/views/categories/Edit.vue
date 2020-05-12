<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="javascript:;">商城中心</a></el-breadcrumb-item>
      <el-breadcrumb-item>新增分类</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="hengxian"></div>

    <el-form :model="category" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="名称" prop="name">
        <el-input v-model="category.name"></el-input>
      </el-form-item>

      <el-form-item label="排序">
        <el-input-number v-model="category.sort" :min="1" :max="99"></el-input-number>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        category: {
          name: '',
          sort: 99,
        },
        rules: {
          name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
        }
      };
    },
    methods: {
      async submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const res = await this.$http.post(`categories`, this.category)
                this.$notify({
                  title: '成功',
                  message: '新增分类成功',
                  type: 'success'
                });
                this.$router.push('/categories')
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    }
  }
</script>

<style>
  .demo-ruleForm {
    margin: 30px 0;
  }

  .hengxian {
    margin-top: 20px;
    border-top: 1px solid #eeeeee;
  }
</style>
