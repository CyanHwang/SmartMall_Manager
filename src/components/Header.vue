<template>
    <el-menu index="0" class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <div class="menu_icon">
            <i class="el-icon-loading"></i> SmartMall
        </div>
        <el-submenu index="1">
            <template slot="title">Cyan Hwang</template>
            <el-menu-item index="1">退出</el-menu-item>
        </el-submenu>
    </el-menu>
</template>

<script>
    export default {
        data() {
            return {
            };
        },

    }
</script>

<style scoped>
    .el-menu--horizontal > .el-submenu {
        float: right;
    }

    .menu_icon {
        float: left;
        width: 200px;
        color: #D3DCE6;
        text-align: center;
        font-size: 30px
    }
</style>
