<template>

<el-menu default-active="home"  @select="handleSelect" >
        <el-menu-item index="home">
          <el-icon><home-filled /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="mode">
          <el-icon><icon-menu /></el-icon>
          <span>文档模式</span>
        </el-menu-item>
        <el-menu-item index="tab">
          <el-icon><document /></el-icon>
          <span>Tab示例</span>
        </el-menu-item>
        <el-menu-item index="readonly">
          <el-icon><icon-menu /></el-icon>
          <span>只读文档</span>
        </el-menu-item>
        <el-menu-item index="cmd">
          <el-icon><icon-menu /></el-icon>
          <span>文档命令</span>
        </el-menu-item>
        <el-menu-item index="data">
          <el-icon><document /></el-icon>
          <span>数据绑定</span>
        </el-menu-item>
        <el-menu-item index="dataTable">
          <el-icon><document /></el-icon>
          <span>数据表格</span>
        </el-menu-item>
        <el-menu-item index="save">
          <el-icon><icon-menu /></el-icon>
          <span>保存文档</span>
        </el-menu-item>
        <el-menu-item index="append">
          <el-icon><document /></el-icon>
          <span>病程合并</span>
        </el-menu-item>
        <el-menu-item index="vitalSigns">
          <el-icon><document /></el-icon>
          <span>体温单</span>
        </el-menu-item>
        <el-menu-item index="sign">
          <el-icon><document /></el-icon>
          <span>电子签名</span>
        </el-menu-item>
        <el-menu-item index="echart">
          <el-icon><document /></el-icon>
          <span>统计图表</span>
        </el-menu-item>
        <el-menu-item index="lang">
          <el-icon><document /></el-icon>
          <span>多语言</span>
        </el-menu-item>
      </el-menu>
  </template>
  
  <script setup>
  import router from '../router'
  import {Document, Menu as IconMenu, HomeFilled} from '@element-plus/icons-vue'
  
  const handleSelect = (key) => {
    router.push(key)
  }
  </script>