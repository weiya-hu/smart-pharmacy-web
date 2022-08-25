<template>
  <el-dialog
      v-model="dialogVisible"
      title="新增机构"
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
      <el-form-item label="机构名称" prop="name">
        <el-input style="width: 400px;" v-model="ruleForm.name"/>
      </el-form-item>
      <el-form-item label="机构编号">
        <el-input style="width: 400px;" v-model="ruleForm.code"/>
      </el-form-item>
      <el-form-item label="机构类型" prop="type">
        <el-select style="width: 400px;" v-model="ruleForm.type" clearable placeholder="请选择机构类型">
          <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上级机构" prop="parent">
        <el-select style="width: 400px;" v-model="ruleForm.parent" clearable placeholder="请选择父级机构">
          <el-option
              v-for="item in parentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="负责人">
        <el-input style="width: 400px;" v-model="ruleForm.people"/>
      </el-form-item>
      <el-form-item label="手机">
        <el-input style="width: 400px;" v-model="ruleForm.phone"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
        >保存</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const dialogVisible = ref(false)
import {ElMessageBox} from 'element-plus'

const handleClose = (done) => {
  done()
}

const showDialog = function () {
  dialogVisible.value = true
}
defineExpose({
  showDialog
})

import {reactive, ref} from 'vue'

const formSize = ref('default')
const ruleForm = reactive({
  name: '山海平(成都)',
  code: '12316564',
  type: 1,
  parent: '山海平',
  people: '刘林',
  phone: '12345564',

})

const rules = reactive({
  name: [
    {
      required: true,
      message: '请输入机构名称',
      trigger: 'blur',
    },
  ],
  type: [
    {
      required: true,
      message: '请选择机构类型',
      trigger: 'change',
    },
  ],
  parent: [
    {
      required: true,
      message: '请选择上级机构',
      trigger: 'change',
    },
  ],

})

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}

const options = Array.from({length: 10000}).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}))

const typeOptions = [
  {
    label: "组织机构",
    value: 1
  },
  {
    label: "业务机构",
    value: 1
  }
]
const parentOptions = [
  {
    label: "山海平",
    value: 1
  }
]

</script>

<style scoped>


</style>


