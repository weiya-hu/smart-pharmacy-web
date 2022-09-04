<template>
  <div>hahahha</div>
</template>

<script setup name="User">
import { getCorpInfo } from "@/api/company/info";
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
console.log('企业ID',userStore.userInfo.corpId)
</script>

<style scoped>

</style>
