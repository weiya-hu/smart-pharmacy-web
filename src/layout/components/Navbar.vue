<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div class="right-menu">
      <div class="cprp-con">{{ data.corpName }}</div>
      <el-divider direction="vertical" />
      <div class="term-con">
<!--        <span class="term-edition">v1.0</span>-->
        <span class="term-time term-time-border">{{ data.packageName }}</span>
        <span class="term-time">有效期：{{ data.expireTime }}</span>
        <a href="#">续费</a>
      </div>
      <el-divider direction="vertical" />
      <div class="avatar-con">
        <img :src="data.headImageUrl" alt="" />
        <span class="user-name">{{ data.userName }}</span>
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
import {getCurrUserBaseInfo} from '../../api/company/info'

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

// const emits = defineEmits(['setLayout'])
// function setLayout() {
//   emits('setLayout');
// }
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
        margin-right: 15px;
      }
      .term-time-border {
        border: 1px solid #999;
        width: 80px;
        height: 24px;
        line-height: 23px;
        text-align: center;
        display: inline-block;
        border-radius: 25px;
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
      transform: translateX(-7px);
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
