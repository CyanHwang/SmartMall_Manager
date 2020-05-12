<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="javascript:;">商城中心</a></el-breadcrumb-item>
      <el-breadcrumb-item>新增商品</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="hengxian"></div>

    <el-form :model="product" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="product.categoryId" placeholder="请选择商品分类">
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品名称" prop="name">
        <el-input v-model="product.name"></el-input>
      </el-form-item>

      <!--七牛云的上传地址，根据自己所在地区选择，我这里是华东区-->
      <!--查看地址：https://developer.qiniu.com/kodo/manual/1671/region-endpoint-->
      <el-form-item label="缩略图" prop="image">
        <el-upload
          class="avatar-uploader"
          :data="qiniuForm"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          action="https://storage.justfor.live"
        >
          <img v-if="product.image" :src="product.image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="单价" prop="price">
        <el-input v-model="product.price"></el-input>
      </el-form-item>

      <el-form-item label="库存" prop="stock">
        <el-input v-model="product.stock"></el-input>
      </el-form-item>

      <el-form-item label="商品描述" prop="body" class="body_height">
        <markdown-editor v-model="product.body" ref="markdownEditor"></markdown-editor>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import 'simplemde/dist/simplemde.min.css'
  import {markdownEditor} from 'vue-simplemde'

  const uuidV1 = require('uuid/v1');

  export default {
    components: {
      markdownEditor
    },
    data() {
      return {
        configs: {
          spellChecker: false // 禁用拼写检查
        },
        product: {
          name: '',
          image: '',
          body: '',
          price: '',
          stock: '',
          categoryId: ''
        },
        qiniuForm: {
          key: '', //文件名称
          token: ''
        },
        categories: [],
        rules: {
          name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
          ],
          categoryId: [
            {required: true, message: '请选择商品分类', trigger: 'change'}
          ],
          image: [
            {required: true, message: '请上传缩略图', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入商品单价', trigger: 'blur'},
          ],
          stock: [
            {required: true, message: '请输入商品库存', trigger: 'blur'},
          ],
          body: [
            {required: true, message: '请填写商品描述', trigger: 'blur'}
          ]
        },
      };
    },
    created() {
      this.init()
    },
    methods: {
      async init(){
        const res = await this.$http.get(`categories`)
        this.categories = res.data.categories;
      },
      async submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            await this.$http.post(`products`, this.product)
                this.$notify({
                  title: '成功',
                  message: '新增商品成功',
                  type: 'success'
                });
                this.$router.push({name: 'Product'})
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      //上传之前
      async beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
        }

        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }

        //如果验证失败，返回假
        if(isJPG && isLt2M == false) return false;

        //如果验证成功，获取token
        let fileType = file.type == 'image/jpeg' ? 'jpg' : 'png'; //获取扩展名
        let res = await this.axios.get('photos/uploadToken')
        this.qiniuForm = {
          key: `${uuidV1()}.${fileType}`, //文件名称
          token: res.data.data.token
        }
        return true;
      },

      //上传成功，获取图片地址
      uploadSuccess(res, file) {
        this.product.image = 'https://storage.justfor.live/' + res.key
      },
    }
  }
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
    border-color: #409EFF;
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

  .hengxian {
    margin-top: 20px;
    border-top: 1px solid #eeeeee;
  }
</style>
