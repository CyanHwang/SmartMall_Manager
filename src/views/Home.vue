<template>
  <el-container>
    <el-header>
      <AdminHeader></AdminHeader>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <Aside></Aside>
      </el-aside>
      <el-main class="animate_fix">
        <transition name="fade">
          <router-view :key="$route.path" />
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from "../components/Aside.vue";
import AdminHeader from "../components/Header.vue";

export default {
  name: "App",
  components: {
    Aside,
    AdminHeader,
  },
  data() {
    return {};
  },
};
</script>

<style>
.el-header {
  line-height: 60px;
  padding: 0!important;
}
.el-main {
  background-color: #fff;
  color: #333;
}
.el-aside {
  height: 88vh;
  text-align: center;
  background-color: rgb(84, 92, 100);
}

</style>
