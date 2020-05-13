<template>
  <div>
    <h1 style="font-size:30px;margin:0 0 10px 30px">欢迎！</h1>
    <el-alert
      class="home_desc"
      title="SmartMall后台管理系统"
      type="success"
      :closable="false"
      description="这是一个基于Node.js + ElementUI使用接口开发模式开发的一套后台管理系统。主要业务用于扫码购物的各个模块，如：商品管理、分类管理、用户管理等。本次系统还在不断完善中，敬请期待...."
      show-icon
    >
    </el-alert>
    <el-alert
      title="辅助工具和资料"
      type="warning"
      description="1、VS Code 2、Ubuntu\Nginx部署 3、api接口测试软件postman"
      :closable="false"
      show-icon
    >
    </el-alert>
  </div>
</template>
