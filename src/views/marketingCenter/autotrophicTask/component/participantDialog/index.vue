<template>
  <div class="outBox">
    <el-dialog width="40%" v-model="dialogFormVisible" :close-on-click-modal="false" title="新增参与人">
      <el-form :model="form" label-width="170px" label-position="left">
        <el-form-item label="参与人全称">
          <el-input clearable placeholder="请输入" v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item style="marginTop:10px" label="参与人类型">
          <el-input clearable placeholder="请输入" v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item style="marginTop:10px" label="参与人统一社会信用代码">
          <el-input clearable placeholder="请输入" v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item style="marginTop:10px" label="对接人">
          <el-input clearable placeholder="请输入" v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item style="marginTop:10px" label="对接人联系方式">
          <el-input clearable placeholder="请输入" v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item style="marginTop:10px" label="备注">
          <el-input
              :autosize="{ minRows: 4, maxRows: 8 }"
              type="textarea"
              placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
        >保存</el-button
        >
      </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import {reactive, ref, defineProps} from 'vue'

const dialogFormVisible = ref(false)


const props = defineProps({
  //标题
  title: {
    type: String,
    required: true
  },
});
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})
const showDialog = function () {
  dialogFormVisible.value = true
}
//方法导出
defineExpose({
  showDialog
})
</script>

<style scoped lang="scss">
.outBox {
}


</style>
