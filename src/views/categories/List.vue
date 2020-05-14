<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        ><a href="javascript:;">商城中心</a></el-breadcrumb-item
      >
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="line"></div>

    <el-button
      type="success"
      size="small"
      class="create"
      @click="
        dialogFormVisible = true;
        model = {};
        isEdit = false;
      "
      >新增分类</el-button
    >

    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column label="编号" prop="id" width="50"></el-table-column>
      <el-table-column label="名称" prop="name" width="200"></el-table-column>
      <el-table-column label="排序" prop="sort" width="100">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.sort"
            size="small"
            @change="handleChange(scope.$index, scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" style="">
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

    <el-dialog
      :title="isEdit ? '编辑分类' : '创建分类'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="model"
        :rules="rules"
        ref="model"
        label-width="100px"
        class="demo-ruleForm"
        @submit.native.prevent="submitForm('model')"
      >
        <el-form-item label="名称" prop="name">
          <el-input style="width:60%" v-model="model.name"></el-input>
        </el-form-item>

        <el-form-item label="排序">
          <el-input-number
            v-model="model.sort"
            :min="1"
            :max="99"
          ></el-input-number>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit">{{
            isEdit ? "确认修改" : "立即创建"
          }}</el-button>
          <el-button @click="model = {}">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      model: {},
      rules: {
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      multipleSelection: [],
      loading: false,
      isEdit: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.loading = true;
      const res = await this.$http.get(`categories`);
      this.tableData = res.data;
      this.loading = false;
    },

    submitForm(val) {
      this.$refs[val].validate(async (valid) => {
        if (valid) {
          if (!this.isEdit) {
            const res = await this.$http.post(`categories`, this.model);
          } else {
            const res = await this.$http.put(
              `categories/${this.model.id}`,
              this.model
            );
          }
          this.dialogFormVisible = false;
          this.$notify({
            title: "成功",
            message: `${this.isEdit ? "修改成功" : "创建成功"}`,
            type: "success",
          });
          this.init();
        } else {
          console.log("检查输入是否有误");
          return false;
        }
      });
    },

    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.isEdit = true;
      this.model = row;
    },


    async handleChange(index, row) {
      await this.$http.put(`categories`, {
        id: row.id,
        sort: row.sort,
      });
      this.$message({
        type: "success",
        message: "改变成功!",
      });
      this.init();
    },

    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$http.delete(`categories/${row.id}`);
          this.$message({
            type: "success",
            message: `删除“${row.name}”成功！`,
          });
          // this.tableData.splice(index,1);
          this.init()
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除。",
          });
        });
    },
  },
};
</script>

<style>
.el-table .cell{
  text-align: center;
}
.create {
  margin: 13px 0;
}

.line {
  margin-top: 20px;
  border-top: 1px solid #eeeeee;
}
</style>
