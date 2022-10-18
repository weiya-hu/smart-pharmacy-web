<template>
  <div class="app-container">
    <el-form v-show="showSearch" :inline="true" label-width="55px">
      <el-form-item class="label" label="关键字">

        <el-input v-model="queryParams.otherFilter" placeholder="请输入商品名/商品品牌/门店名称/销售员名" clearable
                  style="width: 300px"/>
      </el-form-item>
      <el-form-item class="label" label="时间">
        <el-date-picker
            type="datetimerange"
            v-model="betweenTime"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD hh-mm-ss"
            value-format="YYYY-MM-DD hh:mm:ss"
            style="width: 360px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="btn-back">
      <el-row :gutter="10" class="mb8">

        <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              icon="Upload"
              @click="customizeImport"
          >自定义导入
          </el-button>
        </el-col>
        <!--        <el-col :span="1.5">-->
        <!--          <el-button type="primary" plain @click="queryNextpage(true)">上一页</el-button>-->
        <!--        </el-col>-->
        <!--        <el-col :span="1.5">-->
        <!--          <el-button type="primary" plain @click="queryNextpage(false)">下一页</el-button>-->
        <!--        </el-col>-->

        <right-toolbar v-model:showSearch="showSearch" @queryTable="refreshList" :columns="columns"></right-toolbar>
      </el-row>
    </div>

    <el-dialog title="订单导入" v-model="upload.open" width="50%" append-to-body :close-on-click-modal="false"
               draggable>
      <el-upload
          ref="uploadRef"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport"/>
              是否更新已经存在的用户数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                     @click="importTemplate">下载模板
            </el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!--    自定义导入-->
    <el-dialog
        title="导入销售清单" v-model="uploadData.open" width="50%" append-to-body :close-on-click-modal="false"
        draggable>
      <el-upload
          v-loading="uploadData.isLoading"
          element-loading-text="文件上传中..."
          ref="customizeUploadRef"
          style="margin: 0 10px"
          :limit="1"
          accept=".xlsx, .xls"
          :disabled="uploadData.isUploading"
          :action="uploadData.customizeUrl"
          :headers="{'Authorization':uploadData.token}"
          :data="uploadData.customizeParam"
          method:="POST"
          :file-list="customizeList"
          :show-file-list="true"
          :on-success="handleCustomizeSuccess"
          :on-progress="handleCustomizeFileUploadProgress"
          :auto-upload="false"
          :on-error="handleCustomizeError"
          drag
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <el-checkbox v-model="uploadData.customizeParam.isOverRide "/>
            是否更新已经存在的用户数据
          </div>
          <div class="el-upload__tip text-center">
                <span>温馨提示请确认，在上传清单以前，已经完成您销售清单的表头与系统表头的匹配
                  如没有匹配，请点击：</span>
            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                     @click="matchFormHeader">去匹配表头
            </el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div style="marginTop:20px" class="dialog-footer">
          <el-button :disabled="uploadData.isLoading" type="primary" @click="submitFileForm">确 定</el-button>
          <el-button :disabled="uploadData.isLoading" @click="uploadData.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!--http自定义上传-->
    <!--    <el-dialog-->
    <!--        title="导入销售清单" v-model="uploadData.open" width="50%" append-to-body :close-on-click-modal="false"-->
    <!--        draggable>-->
    <!--      <el-upload-->
    <!--          :disabled="uploadData.isUploading"-->
    <!--          ref="customizeUploadRef"-->
    <!--          style="margin: 0 10px"-->
    <!--          :limit="1"-->
    <!--          accept=".xlsx, .xls"-->
    <!--          action="#"-->
    <!--          method:="POST"-->
    <!--          :file-list="customizeList"-->
    <!--          :show-file-list="true"-->
    <!--          :on-success="handleCustomizeSuccess"-->
    <!--          :on-progress="handleCustomizeFileUploadProgress"-->
    <!--          :http-request="customizeUpload"-->
    <!--          :auto-upload="false"-->
    <!--          :on-error="handleCustomizeError"-->
    <!--          drag-->
    <!--      >-->
    <!--        <el-icon class="el-icon&#45;&#45;upload">-->
    <!--          <upload-filled/>-->
    <!--        </el-icon>-->
    <!--        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
    <!--        <template #tip>-->
    <!--          <div class="el-upload__tip text-center">-->
    <!--            <el-checkbox v-model="uploadData.customizeParam.isOverRide "/>-->
    <!--            是否更新已经存在的用户数据-->
    <!--          </div>-->
    <!--          <div class="el-upload__tip text-center">-->
    <!--            <span>温馨提示请确认，在上传清单以前，已经完成您销售清单的表头与系统表头的匹配-->
    <!--              如没有匹配，请点击：</span>-->
    <!--            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"-->
    <!--                     @click="matchFormHeader">去匹配表头-->
    <!--            </el-link>-->
    <!--          </div>-->
    <!--        </template>-->
    <!--      </el-upload>-->
    <!--      <el-progress v-if="isShowProgress" :percentage="percentage" :color="customColors"/>-->
    <!--      <template #footer>-->
    <!--        <div style="marginTop:20px" class="dialog-footer">-->
    <!--          <el-button :disabled="uploadData.isLoading" type="primary" @click="submitFileForm">确 定</el-button>-->
    <!--          <el-button :disabled="uploadData.isLoading" @click="uploadData.open = false">取 消</el-button>-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </el-dialog>-->


    <div class="tableList">
      <el-table v-loading="loading" :data="orderList">
        <el-table-column min-width="100px" v-if="columns[0].visible" label="产品名" key="productName"
                         prop="productName" show-overflow-tooltip/>
        <el-table-column min-width="90px" v-if="columns[1].visible" label="销售金额" key="paidinAmount"
                         prop="paidinAmount" show-overflow-tooltip/>
        <el-table-column min-width="90px" v-if="columns[2].visible" label="销售数量" key="saleNumber"
                         prop="saleNumber" show-overflow-tooltip/>
        <el-table-column min-width="160px" v-if="columns[3].visible" label="销售时间" key="saleTime"
                         prop="saleTime" show-overflow-tooltip/>
        <el-table-column label="规格" v-if="columns[4].visible" key="specification"
                         prop="specification" show-overflow-tooltip/>
        <el-table-column label="门店ID" min-width="150px" v-if="columns[5].visible" key="storeId" prop="storeId"
                         show-overflow-tooltip/>
        <el-table-column label="门店名" min-width="150px" v-if="columns[6].visible" key="storeName"
                         prop="storeName" show-overflow-tooltip/>
        <el-table-column label="门店订单ID" min-width="90px" v-if="columns[7].visible" key="storeOrderNumber"
                         prop="storeOrderNumber" show-overflow-tooltip/>
        <el-table-column min-width="100px" v-if="columns[8].visible" label="销售员" key="userName"
                         prop="userName" show-overflow-tooltip/>
      </el-table>

      <div class="pagination-container pagination" v-show="total > 0">
        <div class="total">共{{ totalCount }}条</div>
        <el-button :icon="ArrowLeft" text bg @click="queryNextpage(true)" :disabled="currentPage + 1 == 1"></el-button>
        <div class="page-box">
          <el-tag v-for="item in pageItem" effect="dark" :type="currentPage + 1 === item ? '' : 'info'"
                  style="margin: 0 5px;">{{ item }}
            <el-icon v-show="item == ''">
              <MoreFilled/>
            </el-icon>
          </el-tag>
        </div>
        <el-button :icon="ArrowRight" text bg @click="queryNextpage(false)"
                   :disabled="currentPage + 1 == Math.ceil(totalCount / 10)"></el-button>
      </div>
      <!--      <div style="padding: 20px;display: flex;justifyContent: flex-end">-->
      <!--        <span style="marginRight:10px">共{{ totalCount }}条 </span>-->
      <!--        <span style="marginRight:10px">共{{ total }}页 </span>-->
      <!--        <span>当前页:{{ currentPage + 1 }}</span>-->
      <!--      </div>-->
    </div>

  </div>
</template>

<script setup>
import {ArrowLeft, ArrowRight} from '@element-plus/icons-vue'
import {getCurrentInstance, reactive, toRefs} from "vue";
import {getToken} from "@/utils/auth";
import {getOrderList, addDynamicHeaderExcelUrl, uploadSaleOrder} from "@/api/system/order";
import customizeImportFirst from './component/customizeImportFirst'

import router from "@/router";
//自定义导入列表
const customizeUploadRef = ref()
const customizeList = ref([])
const showSearch = ref(true);
const {proxy} = getCurrentInstance()
let nextSearchAfter = ref([])
let betweenTime = ref([])
//存储当前页数
let currentPage = ref(0)
//保存每一页的查询参数
let pageQueryParams = ref([[
  undefined
]
])
//控制进度条是否显示
let isShowProgress = ref(false)
//进度条控制
const customColors = [
  {color: '#1989fa', percentage: 99.99},
  {color: '#5cb87a', percentage: 100},
]
const percentage = ref(0)
//搜索条件
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    otherFilter: undefined,
  }
});
const orderList = ref([]);
//列表loading
let loading = ref(false)
const total = ref(0);
let totalCount = ref(0)
const {queryParams} = toRefs(data);
/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（订单导入）
  open: false,
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/product/order/importOrder"
});
/*** 重置每一页的查询参数*/
const restPageQueryParams = () => {
  currentPage.value = 0
  pageQueryParams.value = [[
    undefined
  ]
  ]
}

/*** 用户自定义导入 */
let uploadData = reactive({
  // 是否显示弹出层（订单导入）
  open: false,
  isLoading: false,
  isUploading: false,
  // 是否禁用上传
  customizeUrl: import.meta.env.VITE_APP_BASE_API + '/product/order/addDynamicHeaderExcelFile',
  customizeParam: {
    path: '/Company/Customize', isOverRide: true,
  },
  token: getToken(),
  parameter: {corpId: '', file: ''}
})
/**http自定义上传函数*/
let customizeUpload = (fileObj) => {
  isShowProgress.value = true
  let formData = new FormData()
  formData.append("file", fileObj.file)
  formData.append("path", uploadData.customizeParam.path)
  formData.append("isOverRide", uploadData.customizeParam.isOverRide)
  uploadSaleOrder({token: uploadData.token, cllBackFunction: uploadProgressCallback, data: formData}).then(res => {
    if (res.data.code == 200) {
      let {cantSave, insert, update} = res.data.data
      customizeList.value = []
      proxy.$modal.msgSuccess(`上传文件成功 未保存:${cantSave.length}条 新增:${insert.length}条 更新:${update.length}条`)
    } else {
      isShowProgress.value = false
      customizeList.value = []
      proxy.$modal.msgError("上传文件失败")
      uploadData.open = false
      uploadData.isUploading = false
    }
  })

}

/**上传进度的回调*/
const uploadProgressCallback = (progressEvent) => {
  let persent = (progressEvent.loaded / progressEvent.total * 100 | 0)
  percentage.value = persent
}

//自定义上传前的回调
const handleCustomizeFileUploadProgress = () => {
  uploadData.isLoading = true
  uploadData.isUploading = true
  uploadData.open = true
}
/**自定义上传成功的回调*/
const handleCustomizeSuccess = function (res) {
  if (res.code == 200) {
    let {cantSave, insert, update} = res.data
    uploadData.isLoading = false
    customizeList.value = []
    proxy.$modal.msgSuccess(`上传文件成功 未保存:${cantSave.length}条 新增:${insert.length}条 更新:${update.length}条`)
    uploadData.open = false
    uploadData.isLoading = false
    uploadData.isUploading = false
  } else {
    uploadData.isLoading = false
    customizeList.value = []
    proxy.$modal.msgError("上传文件失败")
    uploadData.open = false
    uploadData.isLoading = false
    uploadData.isUploading = false
  }
}
/**自定义上传失败的回调 */
const handleCustomizeError = function () {
  uploadData.isLoading = false
  customizeList.value = []
  proxy.$modal.msgError("上传文件失败")
  uploadData.open = false
  uploadData.isLoading = false
  uploadData.isUploading = false
}

// 列显隐信息
const columns = ref([
  {key: 0, label: `产品名`, visible: true},
  {key: 1, label: `销售金额`, visible: true},
  {key: 2, label: `销售数量`, visible: true},
  {key: 3, label: `销售时间`, visible: true},
  {key: 4, label: `规格`, visible: true},
  {key: 5, label: `门店ID`, visible: true},
  {key: 6, label: `门店名`, visible: true},
  {key: 7, label: `门店订单ID`, visible: true},
  {key: 8, label: `销售员`, visible: true}
]);
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  proxy.$refs["customizeUploadRef"].handleRemove(file);
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  upload.open = false
  getList();
};
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["customizeUploadRef"].submit();
};

/** 导入按钮操作 */
function handleImport() {
  upload.title = "用户导入";
  upload.open = true;
};

//自定义上传
function customizeImport() {
  uploadData.open = true;
}

//匹配表头
const matchFormHeader = () => {
  router.push({path: '/enterpriseCenter/order/customizeImportSecond'})
}

//刷新
function refreshList() {
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
    otherFilter: undefined,
  }
  betweenTime.value = []
  nextSearchAfter.value = undefined
  getList()

  currentPage.value = 0
}

/**查询下一页*/
function queryNextpage(type) {

  let timeObject = {
    startTime: undefined,
    endTime: undefined
  }
  if (betweenTime.value.length !== 0) {
    timeObject = {
      startTime: betweenTime.value[0],
      endTime: betweenTime.value[1]
    }
  }
  if (type) {
    let previousIndex = currentPage.value - 1
    if (previousIndex < 0) {
      proxy.$modal.msgError("已经是第一页")
      return;
    } else {
      getOrderList({
        ...timeObject,
        ...queryParams.value,
        nextSearchAfter: pageQueryParams.value[previousIndex]
      }).then(res => {
        if (res.code == 200) {
          currentPage.value = currentPage.value - 1
          orderList.value = res.data.orders
          total.value = Number(res.data.pageSize * res.data.pages);
          loading.value = false;
        }
      })
    }
  } else {
    let nextIndex = currentPage.value + 1
    if (pageQueryParams.value[nextIndex] == null) {
      proxy.$modal.msgError("已经是最后一页")
      return
    } else {
      getOrderList({
        ...timeObject,
        ...queryParams.value,
        nextSearchAfter: pageQueryParams.value[nextIndex]
      }).then(res => {
        if (res.code == 200) {
          currentPage.value = currentPage.value + 1
          orderList.value = res.data.orders
          nextSearchAfter.value = res.data.nextSearchAfter
          let nextIndex = currentPage.value + 1
          pageQueryParams.value[nextIndex] = res.data.nextSearchAfter
          total.value = Number(res.data.pages);
          loading.value = false;
        }
      })
    }
  }
}


/** 查询用订单列表 */
function getList() {
  let timeObject = {
    startTime: undefined,
    endTime: undefined
  }
  if (betweenTime.value.length !== 0) {
    timeObject = {
      startTime: betweenTime.value[0],
      endTime: betweenTime.value[1]
    }
  }
  loading.value = true;
  getOrderList({
    ...timeObject,
    ...queryParams.value,
    nextSearchAfter: pageQueryParams.value[currentPage.value].nextSearchAfter
  }).then(res => {
    orderList.value = res.data.orders
    nextSearchAfter.value = res.data.nextSearchAfter
    let nextIndex = currentPage.value + 1
    pageQueryParams.value[nextIndex] = res.data.nextSearchAfter
    total.value = Number(res.data.pages);
    totalCount.value = Number(res.data.total)
    loading.value = false;

  })
};

/** 下载模板操作 */
function importTemplate() {
  proxy.downloadToGet("/product/order/downLoadDdiExcelTemplate", `order_template_${new Date().getTime()}.xlsx`);
};

/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/user/export", {
    ...queryParams.value,
  }, `order_${new Date().getTime()}.xlsx`);
};

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  nextSearchAfter.value = undefined
  restPageQueryParams()
  getList();
};

/** 重置搜索 */
function resetQuery() {
  queryParams.value.pageNum = 1;
  nextSearchAfter.value = undefined
  currentPage.value = 0
  restPageQueryParams()
  refreshList()
}

/** 分页 */
const pageItem = computed(() => {
  let start = currentPage.value + 1, end = Math.ceil(totalCount.value / queryParams.value.pageSize)
  if (end < 10) return end;
  if (start <= 5) {
    return [1, 2, 3, 4, 5, 6, '', end]
  } else if (start > end - 5) {
    return [1, '', end - 5, end - 4, end - 3, end - 2, end - 1, end]
  } else {
    return [1, '', start - 2, start - 1, start, start + 1, start + 2, '', end]
  }
})

getList()
</script>

<style scoped lang="scss">

::v-deep(.el-progress) {
  display: none !important;
}

.label::v-deep( .el-form-item__label) {
  color: #606266;
  font-weight: 600;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .total {
    margin-right: 10px;
    font-weight: 400;
    color: var(--el-text-color-regular);
  }

  .page-box {
    .el-tag {
      width: 32px;
      height: 32px;
      border-radius: 2px;
      font-size: 14px;
      font-weight: 400;
    }

    .el-tag--dark.el-tag--info {
      background: var(--el-fill-color);
      color: var(--el-text-color-regular);
      border: 0;
    }
  }

  ::v-deep(.el-button.is-text) {
    width: 32px;
    height: 32px;
    background-color: var(--el-fill-color-light) !important;
    margin: 0 5px;
    border-radius: 2px;
  }
}

</style>