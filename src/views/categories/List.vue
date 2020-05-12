<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        ><a href="javascript:;">商城中心</a></el-breadcrumb-item
      >
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="hengxian"></div>

    <el-button
      type="success"
      size="small"
      class="create"
      @click="dialogFormVisible = true"
      >新增分类</el-button
    >

    <el-table
      ref="multipleTable"
      :data="categories"
      style="width: 100%"
      v-loading="loading"
      id="category"
    >
      <el-table-column label="编号" prop="id"></el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="排序" prop="sort">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.sort"
            size="small"
            @change="handleChange(scope.row.id, scope.row.sort)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增分类" :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input-number
            v-model="ruleForm.sort"
            :min="1"
            :max="99"
          ></el-input-number>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >立即创建</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="编辑分类" :visible.sync="dialogFormVisible2">
      <el-form
        :model="category"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="category.name"></el-input>
        </el-form-item>

        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input-number
            v-model="category.sort"
            :min="1"
            :max="99"
          ></el-input-number>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updateForm('ruleForm')"
            >立即创建</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [],
      dialogFormVisible: false,
      dialogFormVisible2: false,
      ruleForm: {
        name: '',
        sort: 99,
      },
      rules: {
        name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
      },
      formLabelWidth: '120px',
      category: {},
      multipleSelection: [],
      loading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    //首页
    async init() {
      this.loading = true
      const res = await this.$http.get(`categories`)
          this.categories = res.data.categories
          this.loading = false
    },

    //新增
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          const res = await this.$http.post(`categories`, this.ruleForm)
              this.$notify({
                title: '成功',
                message: '新增分类成功',
                type: 'success'
              });
              this.ruleForm.name = '';
              this.init()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //表单重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //加载编辑页面
    async handleEdit(index, row) {
      this.dialogFormVisible2 = true;
      //查出当前要编辑的数据
      const res = await this.$http.get(`categories/${row.id}`)
          this.category = res.data.category;
    },
    //执行编辑
    updateForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.$http.put(`categories/${this.category.id}`, this.category)
          this.dialogFormVisible2 = false;
          this.$notify({
            title: '成功',
            message: '编辑分类成功',
            type: 'success'
          });
          this.init();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //排序
    async handleChange(row, sort_value) {
      const res = await this.$http.put(`categories`, {
        id: row,
        sort: sort_value
      })
      this.$message({
        type: 'success',
        message: '改变成功!',
      });
      this.init();
    },
    //删除
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$http.delete(`categories/${row.id}`)
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.init()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

  }
}
</script>

<style>
.create {
  margin: 13px 0;
}

.hengxian {
  margin-top: 20px;
  border-top: 1px solid #eeeeee;
}
</style>
