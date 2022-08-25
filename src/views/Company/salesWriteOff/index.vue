<template>
  <div class="outBox">
    <div class="search">
      <div class="form">
        <el-form>
          <el-form-item label="时间">
            <el-date-picker
                type="datetimerange"
                v-model="searchInfo.time"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="defaultTime1"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="seach">
        <el-input
            style="width: 400px"
            v-model="searchInfo.goodsId"
            placeholder="请输入商品名称/商品编号"
            clearable
        >
          <template #append>
            <el-button :icon="Search"/>
          </template>
        </el-input>
      </div>
      <div class="handler">
        <el-button type="primary">查找</el-button>
        <el-button type="primary">导入</el-button>
      </div>
    </div>
    <div class="tableList">
      <pageContent
          :contentTableConfig="contentTableConfig"
          :storeConfig="SalesWriteOffStoreConfig"
          @editBtnClick="handleEditData"
      ></pageContent>
    </div>
  </div>
</template>

<script setup>
import {CloseBold, Search} from '@element-plus/icons-vue'
import pageContent from "@/components/page-content/page-content";
import {contentTableConfig} from './config/tableConfig'
import {SalesWriteOffStoreConfig} from './config/storeConfig.js'
import {reactive} from "vue";
//搜索条件
const searchInfo = reactive({
  time:'',
  goodsId:''
})

</script>

<style scoped lang="scss">
.outBox {
  padding: 20px;

  .search {
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;

    .seach {
      margin-left: 20px;

    }

    .handler {
      margin-left: 20px;
    }
  }
}
</style>