<template>
  <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, )">展开/折叠</el-checkbox>
  <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, )">全选/全不选</el-checkbox>
  <el-checkbox v-model="menuCheckStrictly" @change="handleCheckedTreeConnect($event, )">父子联动</el-checkbox>
  <el-scrollbar style="height: 500px;">
      <el-tree
          class="tree-border"
          :data="treeData"
          show-checkbox
          ref="menuRef"
          node-key="id"
          default-expand-all
          :check-strictly="!menuCheckStrictly"
          empty-text="加载中，请稍候"
          :props="{ label: 'name', children: 'children' }"
      ></el-tree>
  </el-scrollbar>

</template>

<script setup>
import {listReltree} from '@/api/company/reltree'
const menuRef = ref()
const treeData = ref([]);
const menuExpand = ref(true);
const menuNodeAll = ref(false);
const menuCheckStrictly = ref(true)
const queryParams = ref({
  name: ''
})
const loadTree = () => {
  listReltree(queryParams.value)
      .then(res => {
        if (res.code === 200) {
          treeData.value = res.data
        }
      })
}

/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value) {
  let treeList = treeData.value;
  for (let i = 0; i < treeList.length; i++) {
    menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
  }
}

/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value) {
  menuRef.value.setCheckedNodes(value ? treeData.value : []);
}

/** 树权限（父子联动） */
function handleCheckedTreeConnect(value) {
  menuCheckStrictly.value = value ? true : false;
}

/** 所有菜单节点数据 */
function getMenuAllCheckedKeys() {
  // 目前被选中的菜单节点
  let checkedKeys = menuRef.value.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = menuRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}

defineExpose({
  getMenuAllCheckedKeys
})
defineProps({
  readonly: {
    type: Boolean,
    default: false
  },
})

loadTree()
</script>

<style scoped>

</style>
