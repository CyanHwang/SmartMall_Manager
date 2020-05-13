<template>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <div class="menu_icon"><i class="el-icon-loading"></i> SmartMall</div>
    <el-submenu index="1">
      <template slot="title">Cyan Hwang</template>
      <el-menu-item index="1">退出</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<style scoped>
.el-menu-demo{
  display: flex;
  justify-content: space-around;
}

.menu_icon {
  width: 200px;
  color: #d3dce6;
  font-size: 30px;
  flex:1;
  margin-left:30px;
}
</style>
