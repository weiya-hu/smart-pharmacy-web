<template>
  <div>
    <el-dropdown trigger="click" @command="handleSetSize">
      <div class="size-icon--style">
        <svg-icon class-name="size-icon" icon-class="language" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :disabled="size === item.value" :command="item.value">
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup>
import useAppStore from "@/store/modules/app";

const appStore = useAppStore();
const size = computed(() => appStore.size);
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();
const sizeOptions = ref([
  { label: "简体中文", value: "chinese" },
  { label: "English", value: "english" },
]);

function handleSetSize(size) {
  proxy.$modal.loading("正在切换语言，请稍候...");
  appStore.setSize(size);
  setTimeout("window.location.reload()", 1000);
}
</script>

<style lang='scss' scoped>
.size-icon--style {
  font-size: 21px;
  line-height: 50px;
}
</style>