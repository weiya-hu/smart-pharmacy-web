<template>
  <el-dialog
      v-model="dialogVisible"
      title="添加成员"
      width="30%"
      :before-close="handleClose"
  >
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-position="left"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
    >
      <el-form-item label="头像" class="label">
        <el-upload
            class="avatar-uploader"
            :show-file-list="false"
        >
          <div class="headPortrait">
            <el-icon style="marginTop:15px" size="30px">
              <Plus/>
            </el-icon>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="姓名" class="label">
        <el-input placeholder="请输入姓名" style="width: 350px;" v-model="ruleForm.name"/>
      </el-form-item>

      <el-form-item label="别名" class="label">
        <el-input placeholder="请输入别名" style="width: 350px;" v-model="ruleForm.shortName"/>
      </el-form-item>

      <el-form-item label="账号" prop="accountNumber" class="label">
        <el-input placeholder="成员唯一标识,设定之后不可更改" style="width: 350px;" v-model="ruleForm.accountNumber"/>
      </el-form-item>

      <el-form-item label="性别" prop="name" class="label">
        <el-radio-group style="width: 350px;" v-model="ruleForm.sex">
          <el-radio label="1" size="large">男</el-radio>
          <el-radio label="2" size="large">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="企业邮箱" prop="enterpriseMailbox" class="label">
        <el-input placeholder="请输入企业邮箱" style="width: 350px;" v-model="ruleForm.enterpriseMailbox"/>
      </el-form-item>

      <el-form-item label="部门" prop="name" class="label">
        <el-input style="width: 350px;" v-model="ruleForm.name"/>
      </el-form-item>

      <el-form-item label="职务" prop="name" class="label">
        <el-input style="width: 350px;" v-model="ruleForm.name"/>
      </el-form-item>

      <!--      <el-form-item label="标签" prop="name">-->
      <!--        <el-input style="width: 350px;" v-model="ruleForm.name"/>-->
      <!--      </el-form-item>-->

      <el-form-item label="手机" prop="name" class="label">
        <el-input style="width: 350px;" v-model="ruleForm.name"/>
      </el-form-item>
      <el-form-item label="部分负责人" prop="name" class="label">
        <el-radio-group style="width: 350px;" v-model="ruleForm.sex">
          <el-radio label="1" size="large">是</el-radio>
          <el-radio label="2" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item style="color: red" label="直属上级" prop="name" class="label">
        <el-button type="primary" link>选择</el-button>
      </el-form-item>


    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
        >保存</el-button
        >
           <el-button type="primary" @click="dialogVisible = false"
           >保存并继续添加</el-button
           >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const dialogVisible = ref(false)

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
  shortName: '??',
  accountNumber: '165456',
  sex: "1",
  enterpriseMailbox: "21655663@shanhaiping.com",
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


</script>

<style scoped lang="scss">

.headPortrait {
  border: 2px dashed #97a8be;
  text-align: center;
  width: 60px;
  height: 60px;
}

.label::v-deep( .el-form-item__label) {
    color: #606266;
  font-weight: 600;
  justify-content: flex-start !important;
  }


</style>


