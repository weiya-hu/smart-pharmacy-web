<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div class="right-menu">
      <div class="cprp-con">{{ (userStore.corpInfo && userStore.corpInfo.corpName) || data.corpName }}</div>
      <el-divider direction="vertical" />
      <div class="term-con">
        <span class="term-time term-time-border">{{ data.packageName }}</span>
        <span class="term-time">有效期：{{ data.expireTime }}</span>
        <a href="#">续费</a>
      </div>
      <el-divider direction="vertical" />
      <el-dropdown style="cursor: pointer;">
        <div class="avatar-con">
          <img :src="data.headImageUrl || header_img" alt="" class="head-portrait"/>
          <span class="user-name">{{ data.userName }}</span>
          <img src="@/assets/images/user_header_bon.png" alt="下拉" class="header-drop-down" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <img src="../../assets/images/user_header_out.png" alt=""/>
              <span @click="logout" style="padding-left: 5px;">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import Hamburger from '@/components/Hamburger'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import {getCurrUserBaseInfo} from '../../api/company/info'
import header_img from '@/assets/images/user_header.png'

const appStore = useAppStore()
const userStore = useUserStore()

const data = ref({
  corpName: '',
  packageName: '',
  expireTime: '',
  headImageUrl: '',
  userName: ''
})

function toggleSideBar() {
  appStore.toggleSideBar()
}

function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logOut().then(() => {
      location.href = '/index';
    })
  }).catch(() => { });
}
function getInfo() {
  if (userStore.corpInfo) {
    data.value = userStore.corpInfo
  } else {
    getCurrUserBaseInfo().then(res => {
      if (res.code === 200) {
        data.value = res.data
        userStore.setCorpInfo(data.value)
      }
    })
  }
}
getInfo()
</script>

<style lang='scss' scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .right-menu {
    height: 100%;
    line-height: 50px;
    display: flex;
    align-items: center;

    .el-divider--vertical {
      margin: 0 20px;
    }

    .cprp-con {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #999999;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .term-con {
      .term-time {
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        color: #999999;
        margin-right: 15px;
      }
      .term-time-border {
        border: 1px solid #e2e2e2;
        //width: 80px;
        padding: 0 7px;
        height: 24px;
        line-height: 22px;
        text-align: center;
        display: inline-block;
        border-radius: 25px;
      }
      a {
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        color: #FF5A40;
        white-space: nowrap;
      }
    }
    .avatar-con {
      display: flex;
      align-items: center;
      padding-right: 20px;
      .head-portrait {
        width: 24px;
        height: 24px;
        margin-right: 7px;
        border-radius: 50%;
      }
      .user-name {
        min-width: 42px;
        text-align: center;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #999999;
        white-space: nowrap;
      }
      .header-drop-down {
        margin-left: 10px;
        width: 8px;
        height: 7px;
      }
    }
  }
}
@media screen and (min-width: 768px) and (max-width: 1024px){
  .term-con .term-time-border {
    display: none !important;
  }
}
@media screen and (max-width: 768px){
  .term-con span {
    display: none !important;
  }
  .avatar-con span {
    display: none;
  }
  .el-divider--vertical {
    margin: 0 12px !important;
  }
}
</style>
