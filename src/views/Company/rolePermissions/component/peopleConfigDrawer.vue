<template>
  <el-drawer size="27%" v-model="visible" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <div :id="titleId" :class="titleClass">
        <span>请为</span>
        <span style="color: blue">梁毅</span>
        <span>配置</span>
      </div>
      <el-button type="primary" v-if="checked.length!==0" link @click="close">
       确定
      </el-button>
    </template>
    <div class="content">

      <div class="selectOption">
        <div class="search">
          <el-input
              style="width: 400px"
              placeholder="搜索部门/成员/标签"
              clearable
          >
            <template #append>
              <el-button :icon="Search"/>
            </template>
          </el-input>
        </div>
       <div class="checkBox">
         <div class="option">
           <h3>选项</h3>
           <template v-for="(item, index) in selectOption" :key="index">
             <el-checkbox-group @change="checkBoxChange"  v-model="checked">
               <el-checkbox style="display: block" :label="item.label" size="large" />
             </el-checkbox-group>
           </template>
         </div>
         <div class="selected">
          <h3>选中</h3>
           <template v-for="(item, index) in checked" :key="index">
             <el-checkbox-group @change="checkBoxChange"  v-model="checked">
               <el-checkbox style="display: block" :label="item" size="large" />
             </el-checkbox-group>
           </template>
         </div>
       </div>
      </div>

    </div>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import {CloseBold, Search} from '@element-plus/icons-vue'
const visible = ref(false)
const  showDrawer = function (){
  visible.value = true
}
//选项
let selectOption = [
  {
  label:'系统管理员'
  },
  {
    label:'店长'
  },
  {
    label:'店员'
  },
  {
    label:'储备店长'
  },
  {
    label:'负责人'
  },
]
//选中
let checked = ref([])
defineExpose({
  showDrawer
})
//选中回调
const checkBoxChange = function (value){
  console.log(checked.value,value)
}
</script>

<style scoped lang="scss">
.content {
  .selectOption {
    display: flex;
    flex-direction: column;
    .checkBox {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      flex-direction: row;
      .option {
        width: 50%;
      }
      .selected {
        width: 50%;
      }
    }
  }
}
</style>