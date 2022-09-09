<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div class="right-menu">
      <div class="cprp-con">重庆鑫乐医疗保健用品有限公司</div>
      <el-divider direction="vertical" />
      <div class="term-con">
        <span class="term-edition">v1.0</span>
        <span class="term-time">有效期：2022-06-01</span>
        <a href="#">续费</a>
      </div>
      <el-divider direction="vertical" />
      <div class="avatar-con">
        <img :src="userStore.avatar" class="user-avatar" />
        <span class="user-name">Admin</span>
      </div>
      <el-divider direction="vertical" />
      <el-button text @click="logout">
        <el-icon :size="16"><SwitchButton /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import Hamburger from '@/components/Hamburger'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'

const appStore = useAppStore()
const userStore = useUserStore()

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

// const emits = defineEmits(['setLayout'])
// function setLayout() {
//   emits('setLayout');
// }
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
      .term-edition {
        padding: 4px 6px;
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        color: #999999;
        background: rgba(153,153,153,0);
        border: 1px solid #E2E2E2;
        border-radius: 4px;
      }
      .term-time {
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        color: #999999;
        margin: 0 20px;
      }
      a {
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        color: #FF5A40;
      }
    }
    .avatar-con {
      display: flex;
      align-items: center;
      img {
        width: 24px;
        height: 24px;
        margin-right: 7px;
      }
      .user-name {
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #999999;
      }
    }
    .el-button {
      padding-left: 0;
    }
  }
}
@media screen and (max-width: 768px){
  .term-con span {
    display: none;
  }
  .avatar-con span {
    display: none;
  }
  .el-divider--vertical {
    margin: 0 12px !important;
  }
}
</style>
