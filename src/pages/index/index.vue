<!--首页乐库页面-->
<template>
  <div class="index">
    <search></search>
    <banner></banner>
    <icon-menu></icon-menu>
    <recommend></recommend>
    <tab-bar :selected="0"></tab-bar>
  </div>
</template>

<script>
import Search from "../../components/Search";
import Banner from "../../components/Banner";
import IconMenu from "../../components/IconMenu";
import Recommend from "../../components/Recommend";
import TabBar from "../../components/TabBar";
export default {
  components: { Banner, Search, IconMenu, Recommend, TabBar }
};
</script>

<style lang="stylus">
.index
  padding: 108px 0 120px 0
</style>