<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        ><a href="javascript:;">商城中心</a></el-breadcrumb-item
      >
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="hengxian"></div>

    <el-row class="sousuo">
      <el-col :span="8">
        <div class="controls">
          <router-link to="/product/create">
            <el-button type="success" size="small" class="create"
              >新增商品</el-button
            >
          </router-link>
          <el-button
            type="danger"
            size="small"
            class="unfold"
            @click="handleDeleteMultiple"
          >
            <i class="el-icon-delete"></i><span>删除</span>
          </el-button>
          <el-button
            type="primary"
            size="small"
            class="unfold"
            @click="exportExcel()"
            >导出商品</el-button
          >
        </div>
      </el-col>

      <el-col :span="16" class="name_s">
        <el-form :inline="true" class="search">
          <el-form-item label="所有分类">
            <el-select
              v-model="search.categoryId"
              filterable
              placeholder="请选择"
              size="medium"
            >
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="名称">
            <el-input size="medium" v-model="keyword"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="warning"
              size="medium"
              @click="handerSearch"
              icon="el-icon-search"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-table
      :data="products"
      ref="multipleTable"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      id="product"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="编号" prop="id" width="50"></el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="缩略图">
        <template slot-scope="scope" prop="image">
          <img :src="scope.row.image" alt="" class="thumb" />
        </template>
      </el-table-column>
      <el-table-column label="所属分类" prop="categoryId">
        <template slot-scope="scope">
          <el-button type="success" size="small" plain>{{
            scope.row.Category.name
          }}</el-button>
        </template>
      </el-table-column>

      <el-table-column label="单价" prop="price"></el-table-column>
      <el-table-column label="已售" prop="sale"></el-table-column>
      <el-table-column label="库存" prop="stock"></el-table-column>

      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">{{
          scope.row.createdAt | edit_date
        }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <router-link
            :to="{ name: 'product_edit', params: { id: scope.row.id } }"
          >
            <el-button size="mini" type="primary">编辑</el-button>
          </router-link>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="block el-pagination" style="margin-top: 50px;">
      <span class="el-pagination__total" style="margin-left: 20px;"
        >共 {{ page.total }} 条数据</span
      >
      <el-pagination
        background
        layout="prev, pager, next"
        :total="page.total"
        :page-size="page.pageSize"
        @current-change="handleCurrentChange"
        :current-page.sync="page.currentPage"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";

export default {
  data() {
    return {
      products: [],
      categories: [],
      search: {
        categoryId: "",
      },
      page: {
        total: 0,
        pageSize: 0,
        currentPage: 1,
        num: 1,
      },
      keyword: "",
      multipleSelection: [],
    };
  },
  created() {
    this.init();
  },
  filters: {
    edit_date: function(val) {
      return val.substring(0, 10);
    },
  },
  methods: {
    handerSearch() {
      this.init();
    },
    handleCurrentChange(val) {
      this.page.num = val;
      this.init();
    },
    //首页
    async init() {
      const res = await this.$http.get(
        `products?currentPage=${this.page.num}&keyword=${this.keyword}&categoryId=${this.search.categoryId}`
      );
      this.products = res.data.products;
      this.page.total = res.data.pagination.total;
      this.page.pageSize = res.data.pagination.pageSize;

      //所有分类
      const res = await this.$http.get(`categories`);
      this.categories = res.data.categories;
    },

    //导出
    exportExcel() {
      this.$confirm("确定要导出该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          /* generate workbook object from table */
          var wb = XLSX.utils.table_to_book(document.querySelector("#product"));
          /* get binary string as output */
          var wbout = XLSX.write(wb, {
            bookType: "xlsx",
            bookSST: true,
            type: "array",
          });
          try {
            FileSaver.saveAs(
              new Blob([wbout], { type: "application/octet-stream" }),
              "files.xlsx"
            );
          } catch (e) {
            if (typeof console !== "undefined") console.log(e, wbout);
          }
          this.$message({
            type: "success",
            message: "恭喜，导出成功!",
          });
          return wbout;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消导出",
          });
        });
    },

    //删除单条
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.$http.delete(`products/${row.id}`)
          await this.$message({
                type: "success",
                message: "删除成功!",
              });
          this.init();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //多选删除
    handleDeleteMultiple() {
      if (this.multipleSelection.length == 0) {
        this.$message.error("您至少要选中一条记录~");
        return false;
      }

      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then( async () => {
          const checked_id = this.multipleSelection.map((item) => {
            return item.id;
          });
          await this.$http.post(`products/delete_checked`, {
              checked_id: checked_id,
            })
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.init();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.create {
  margin: 13px 0;
}

.hengxian {
  margin-top: 20px;
  border-top: 1px solid #eeeeee;
}

.thumb {
  width: 80px;
  height: 40px;
}

.name_s {
  margin-top: 15px;
}

.el-icon-check {
  color: #5eb95e;
  font-weight: bold;
  cursor: pointer;
}

.el-icon-close {
  color: red;
  font-weight: bold;
  cursor: pointer;
}

.show_notice {
  text-decoration: none;
  color: #08c;
}
</style>
