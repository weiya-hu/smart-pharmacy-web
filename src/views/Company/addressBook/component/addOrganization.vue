<template>
  <el-dialog
      v-model="dialogVisible"
      title="新增部门"
      width="30%"
      :before-close="handleClose"
  >
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
    >
      <el-form-item label="部门全称" prop="name">
        <el-input style="width: 400px;" v-model="ruleForm.name"/>
      </el-form-item>
      <el-form-item label="部门简称" prop="fullname">
        <el-input style="width: 400px;" v-model="ruleForm.fullname"/>
      </el-form-item>
      <el-form-item label="上级机构" prop="parentId">
        <el-tree-select
            v-model="ruleForm.parentId"
            :data="selectTreeData"
            clearable
            node-key="id"
            check-strictly
            :render-after-expand="false"
            check-on-click-node
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="submitForm"
        >保存</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const dialogVisible = ref(false)
import {ElMessageBox,ElMessage} from 'element-plus'
import {createAddressBook} from "@/api/company/addressBook";
const emits = defineEmits()
const handleClose = (done) => {
  done()
}

const showDialog = function () {
  dialogVisible.value = true
}
defineExpose({
  showDialog
})
defineProps({
  selectTreeData:Array
})

import {reactive, ref} from 'vue'
const formSize = ref('default')
const ruleFormRef = ref()
const ruleForm = reactive({
  name: '',
  fullname:'',
  parentId:'',

})

const rules = reactive({
  name: [
    {
      required: true,
      message: '请输入部门全称',
      trigger: 'blur',
    },
  ],
  fullname: [
    {
      required: true,
      message: '请选择部门简称',
      trigger: 'change',
    },
  ],
})

const submitForm =  () => {
  ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      createAddressBook(ruleForm).then(res=>{
        if(res.code === 200){
          ElMessage.success("保存成功!")
          dialogVisible.value=false
          //回调树
          emits("loadDepTree");
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = () => {
  ruleFormRef.value.resetFields()
}


</script>

<style scoped>


</style>


