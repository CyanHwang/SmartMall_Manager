<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        ><a href="javascript:;">商城中心</a></el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ id ? "编辑" : "新增" }}商品</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="line"></div>

    <el-form
      :model="model"
      :rules="rules"
      ref="model"
      @submit.native.prevent="submitForm('model')"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="所属分类" prop="CategoryId">
        <el-select v-model="model.CategoryId" placeholder="请选择商品分类">
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品名称" prop="name">
        <el-input v-model="model.name"></el-input>
      </el-form-item>

      <!-- 查看地址：https://developer.qiniu.com/kodo/manual/1671/region-endpoint -->
      <el-form-item label="缩略图" prop="image">
        <el-upload
          class="avatar-uploader"
          :data="qiniuForm"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          action="https://upload-z1.qiniup.com"
        >
          <img v-if="model.image" :src="model.image" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="单价" prop="price">
        <el-input v-model="model.price"></el-input>
      </el-form-item>

      <el-form-item label="库存" prop="stock">
        <el-input-number v-model="model.stock"></el-input-number>
      </el-form-item>

      <el-form-item label="商品描述" prop="body" class="body_height">
        <vue-editor
          v-model="model.body"
        ></vue-editor>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" native-type="submit">{{
          id ? "确认修改" : "立即创建"
        }}</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import uuidV1 from "uuid/v1";

export default {
  components: {
    VueEditor,
  },
  props: {
    id: "",
  },
  data() {
    return {
      configs: {
        spellChecker: false, // 禁用拼写检查
      },
      model: {},
      qiniuForm: {
        key: "", //文件名称
        token: "",
      },
      categories: [],
      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        CategoryId: [{ required: true, message: "请选择商品分类", trigger: "change" }],
        // image: [{ required: true, message: "请上传缩略图", trigger: "blur" }],
        price: [{ required: true, message: "请输入商品单价", trigger: "blur" }],
        stock: [{ required: true, message: "请输入商品库存", trigger: "blur" }],
        body: [{ required: true, message: "请填写商品描述", trigger: "blur" }],
      },
    };
  },
  methods: {
    async initCategories() {
      const res = await this.$http.get(`categories`);
      this.categories = res.data;
    },

    async initProduct() {
      const res = await this.$http.get(`/products/${this.id}`);
      this.model=res.data
    },

    submitForm(val) {
      this.$refs[val].validate(async (valid) => {
        if (valid) {
          if(!this.id){
            await this.$http.post(`products`, this.model);
          }else{
            await this.$http.put(`products/${this.id}`,this.model)
          }
          this.$notify({
            title: "成功",
            message: `商品 ${this.id?` “${this.model.name}” 修改成功`:`新增商品 ${this.model.name} 成功`}`,
            type: "success",
          });
          this.$router.push('/products');
        } else {
          console.log("检查输入是否有误");
          return false;
        }
      });
    },

    //上传之前
    async beforeUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG或PNG 格式!");
      }

      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }

      //如果验证失败，返回假
      if (isJPG && isLt2M == false) return false;

      //如果验证成功，获取token
      let fileType = file.type == "image/jpeg" ? "jpg" : "png"; //获取扩展名
      let res = await this.$http.get("photos/uploadToken");
      this.qiniuForm = {
        key: `${uuidV1()}.${fileType}`, //散列文件名称
        token: res.data.token,
      };
      return true;
    },

    //上传成功，获取图片地址
    uploadSuccess(res, file) {
      this.model.image = "https://storage.justfor.live/" + res.key;
    },
  },
  created() {
    this.initCategories()
    this.id && this.initProduct();
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.demo-ruleForm {
  margin: 30px 0;
}

.body_height .ql-editor {
  min-height: 300px;
}

.line {
  margin-top: 20px;
  border-top: 1px solid #eeeeee;
}
</style>
