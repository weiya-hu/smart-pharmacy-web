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
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="defaultTime"
            style="width: 360px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        <el-button
            type="primary"
            plain
            icon="Upload"
            @click="customizeImport"
        >自定义导入
        </el-button>
      </el-form-item>
    </el-form>
    <div class="btn-back">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <div>
            <div v-if="analysisStatus==2" class="uploadInfo">
              <p class="desc">当前数据截至 {{ lastImportTime }}导入,其中{{ insertCount }}条导入成功，{{
                  updateCount
                }}条更新，
                {{ cantSaveCount }}条导入失败。</p>
              <el-button
                  type="primary"
                  plain
                  v-if="cantSaveList.length!==0"
                  @click="uploadErrorProCode"
              >查看导入失败
              </el-button>
              <el-button
                  type="info"
                  plain
                  v-if="cantSaveList.length==0"
              >查看导入失败
              </el-button>
            </div>
            <div v-if="analysisStatus==3" class="uploadInfo">
              <p style="marginRight:10px" class="desc">上传导入计算失败 ！！！</p>
              <el-button
                  type="primary"
                  plain
                  @click="()=>{waitDialog = true}"
              >查看计算失败原因
              </el-button>
            </div>
          </div>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="refreshList" :columns="columns"></right-toolbar>
      </el-row>
    </div>
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
            是否更新已经存在的清单数据
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
    <el-dialog
        @close="colseTipsDialog"
        v-model="notImportGoodsTips" width="50%" append-to-body :close-on-click-modal="false" center
        draggable>
      <div class="tips">
        <p>
          发现新商品{{ cantSaveList.length }} 个，其销售数据都没导入
        </p>
        <el-scrollbar height="20vh">
          <div class="goodsId">
            <span v-for="item in cantSaveList" :key="item">{{ item }},</span>
          </div>
        </el-scrollbar>
        <p>
          请复制并保存此条通知当中的商品编码，将新商品加入到 商品中心 - 连锁商品库，加入成功后，再次导入数据即可。
        </p>
      </div>
      <template #footer>
        <div style="marginTop:20px">
          <el-button size=" large" type="primary" :disabled="uploadData.isLoading" @click="notImportGoodsTips = false">
            我已复制此对话框当中的编码
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
        v-model="waitDialog"
        width="25%"
        :modal-append-to-body='false'
        :show-close="false"
        :close-on-click-modal="true"
        center
        draggable>
      <div class="uploadStatus">
        <p v-if="analysisStatus==1" class="waitDesc">
          <span>数据导入完成，系统正在计算中，
            <span v-if="analysisTime>1">估计需要<span style="color: red">{{
                analysisTime
              }}</span>分钟，请耐心等待</span>
            <span v-if="analysisTime==1">
            请耐心等待...
          </span>
          </span><br/>
          <span>  您还可以离开本页面，待计算完成再返回</span>
        </p>
        <p v-if="analysisStatus==2" class="finishDesc">
          本次导入数据已计算完成
        </p>
        <p v-if="analysisStatus==3" class="errorDesc">
          <span>
            订单解析失败
          </span><br/>
          <span style="color:red;">
            {{ analysisErrorMsg }}
          </span>
        </p>
      </div>
      <template v-if="analysisStatus==2||analysisStatus==3" #footer>
        <div style="marginTop:20px">
          <el-button size=" large" type="primary" @click="caculateOver">
            我知道了
          </el-button>
        </div>
      </template>
    </el-dialog>


    <div class="tableList">
      <el-table v-loading="loading" element-loading-text="加载中..." :data="orderList">

        <el-table-column v-if="columns[0].visible" label="产品名" key="productName"
                         prop="productName" show-overflow-tooltip/>
        <el-table-column v-if="columns[1].visible" label="销售金额" key="paidinAmount"
                         prop="paidinAmount" show-overflow-tooltip/>
        <el-table-column v-if="columns[2].visible" label="销售数量" key="saleNumber"
                         prop="saleNumber" show-overflow-tooltip/>
        <el-table-column v-if="columns[3].visible" label="销售时间" key="saleTime"
                         prop="saleTime" show-overflow-tooltip/>

        <el-table-column label="规格" v-if="columns[4].visible" key="specification"
                         prop="specification" show-overflow-tooltip/>
        <el-table-column label="门店ID" v-if="columns[5].visible" key="storeId" prop="storeId"
                         show-overflow-tooltip/>
        <el-table-column label="门店名" v-if="columns[6].visible" key="storeName"
                         prop="storeName" show-overflow-tooltip/>
        <el-table-column label="门店订单ID" v-if="columns[7].visible" key="storeOrderNumber"
                         prop="storeOrderNumber" show-overflow-tooltip/>
        <el-table-column v-if="columns[8].visible" label="销售员" key="userName"
                         prop="userName" show-overflow-tooltip/>
        <el-table-column v-if="columns[9].visible" label="是否核销" key="userName"
                         prop="isWriteOff" show-overflow-tooltip>
          <template #default="{row}">
              <span v-if="row.isWriteOff==null">
                否
              </span>
            <span v-else>
                是
              </span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
      />
    </div>
  </div>
</template>

<script setup>
import {ArrowLeft, ArrowRight} from '@element-plus/icons-vue'
import {computed, getCurrentInstance, nextTick, onBeforeUnmount, reactive, toRefs} from "vue";
import {getToken} from "@/utils/auth";
import {getOrderList, addDynamicHeaderExcelUrl, uploadSaleOrder} from "@/api/system/order";
import customizeImportFirst from './component/customizeImportFirst'

import router from "@/router";
import {recentlyFileInfo} from "../../../api/system/order";
//自定义导入列表
const customizeUploadRef = ref()
const customizeList = ref([])
const showSearch = ref(true);
const {proxy} = getCurrentInstance()
let nextSearchAfter = ref([])
let betweenTime = ref([])
//未导入数据
let cantSaveList = ref([])
let notImportGoodsTips = ref(false)
//存储当前页数
let currentPage = ref(0)
//保存每一页的查询参数
let pageQueryParams = ref([[
  undefined
]
])
let defaultTime = ref([new Date(2022, 9, 10, 0, 0, 0), new Date(2022, 9, 10, 23, 59, 59)])
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
    searchKey: undefined,
    total: undefined
  }
});
const orderList = ref([]);
/*上传文件计算等待弹框*/
const waitDialog = ref(false)
let waitTimer = ref()
const analysisTime = ref()
const analysisStatus = ref()
const analysisErrorMsg = ref()
const cantSaveCount = ref()
const updateCount = ref()
const insertCount = ref()
const lastImportTime = ref()
const isCaculateOver = ref(false)
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
  customizeUrl: import.meta.env.VITE_APP_BASE_API + '/product/order/addDynamicHeaderExcelFileNew',
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
      proxy.$modal.msgError(res.msg)
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
/**订单计算完成*/
const caculateOver = () => {
  waitDialog.value = false
  getList()
}

//自定义上传前的回调
const handleCustomizeFileUploadProgress = () => {
  uploadData.isLoading = true
  uploadData.isUploading = true
  uploadData.open = true
}
/**关闭未导入商品提示弹框*/
const colseTipsDialog = () => {
  notImportGoodsTips.value = false
  // cantSaveList.value = []
}
/**自定义上传成功的回调*/
    //点击查看导入失败
const uploadErrorProCode = () => {
      if (cantSaveList.value.length !== 0) {
        notImportGoodsTips.value = true
      }
    }

//定时器轮询回调
const getRecentlyFileInfo = () => {
  recentlyFileInfo().then(res => {
    if (res.code == 200) {
      let {
        predictTime,
        productOrderImportInfo: {importTime, status, errorMsg, cantsaveDetail, insertNum, updateNum, cantsaveNum}
      } = res.data
      analysisStatus.value = status
      let remainTime = predictTime * 60000 - (new Date().getTime() - new Date(importTime).getTime())
      if ((remainTime > 0 && remainTime <= 60000) || remainTime <= 0) {
        analysisTime.value = 1
      } else if (remainTime > 60000) {
        analysisTime.value = Math.ceil(remainTime / 60000)
      }
      switch (status) {
        case 1:
          isCaculateOver.value = false
          break;
        case 2:
          if (JSON.parse(cantsaveDetail).length !== 0) {
            cantSaveList.value = JSON.parse(cantsaveDetail).filter(item => {
              return item.errCode == "1002"
            })
            cantSaveList.value = Array.from(new Set(cantSaveList.value.map(item => {
              return item.storeProductCode
            })))
          }
          console.log(cantSaveList.value, "？？？")

          analysisTime.value = predictTime
          cantSaveCount.value = cantsaveNum
          updateCount.value = updateNum
          insertCount.value = insertNum
          lastImportTime.value = importTime
          isCaculateOver.value = true
          nextTick(() => {
            clearInterval(waitTimer.value)
          })
          break;
        case 3:
          waitDialog.value = true
          isCaculateOver.value = true
          analysisErrorMsg.value = errorMsg.split("||").join(",") ? errorMsg.split("||").join(",") : errorMsg
          nextTick(() => {
            clearInterval(waitTimer.value)
          })
          break
      }
    }
  })
}

//    轮询最近一次上传文件的 计算状态
const recentlyUploadFileStatus = () => {
  uploadData.open = false
  recentlyFileInfo().then(res => {
    if (res.data.productOrderImportInfo !== null) {
      if (res.code == 200) {
        let {
          predictTime,
          productOrderImportInfo: {importTime, status, errorMsg, cantsaveDetail, insertNum, updateNum, cantsaveNum}
        } = res.data
        analysisStatus.value = status
        let remainTime = predictTime * 60000 - (new Date().getTime() - new Date(importTime).getTime())
        if ((remainTime > 0 && remainTime <= 60000) || remainTime <= 0) {
          analysisTime.value = 1
        } else if (remainTime > 60000) {
          analysisTime.value = Math.ceil(remainTime / 60000)
        }
        switch (status) {
          case 1:
            waitDialog.value = true
            isCaculateOver.value = false
            waitTimer.value = setInterval(() => {
              getRecentlyFileInfo()
            }, 5000)
            break;
          case 2:
            if (JSON.parse(cantsaveDetail).length !== 0) {
              cantSaveList.value = JSON.parse(cantsaveDetail).filter(item => {
                return item.errCode == "1002"
              })
              cantSaveList.value = Array.from(new Set(cantSaveList.value.map(item => {
                return item.storeProductCode
              })))
            }
            isCaculateOver.value = true
            analysisTime.value = predictTime
            cantSaveCount.value = cantsaveNum
            updateCount.value = updateNum
            insertCount.value = insertNum
            lastImportTime.value = importTime
            nextTick(() => {
              clearInterval(waitTimer.value)
            })
            break;
          case 3:
            isCaculateOver.value = true
            analysisErrorMsg.value = errorMsg.split("||").join(",") ? errorMsg.split("||").join(",") : errorMsg
            nextTick(() => {
              clearInterval(waitTimer.value)
            })
            break
        }
      }
    } else if (res.data.productOrderImportInfo == null) {
      isCaculateOver.value = true
      return
    }

  })

}
const handleCustomizeSuccess = function (res) {
  if (res.code == 200) {
    let {status, predictTime} = res.data
    analysisTime.value = predictTime
    uploadData.isLoading = false
    uploadData.isUploading = false
    customizeList.value = []
    proxy.$modal.msgSuccess("上传文件成功")
    recentlyUploadFileStatus()
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
  {key: 8, label: `销售员`, visible: true},
  {key: 9, label: `是否核销`, visible: true}
]);

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["customizeUploadRef"].submit();
};


//自定义上传
function customizeImport() {
  if (isCaculateOver.value) {
    uploadData.open = true;
  } else {
    proxy.$modal.msgError("请等待上次导入计算完成后再导入")
  }
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
    total: undefined
  }
  betweenTime.value = []
  nextSearchAfter.value = undefined
  getList()

  currentPage.value = 0
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
  }).then(res => {
    orderList.value = res.data.orders
    if (orderList.value == null && queryParams.value.pageNum !== 1) {
      proxy.$modal.msgError("数据计算中请稍后再试")
    } else if (orderList.value == null && queryParams.value.pageNum == 1) {
      orderList.value = []
    }
    queryParams.value.searchKey = res.data.searchKey
    queryParams.value.total = Number(res.data.total);
    total.value = Number(res.data.total);
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
  queryParams.value.searchKey = undefined
  restPageQueryParams()
  getList();
};

/** 重置搜索 */
function resetQuery() {
  queryParams.value.pageNum = 1;
  queryParams.value.pageSize = 10;
  queryParams.value.searchKey = undefined;
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
recentlyUploadFileStatus()
onBeforeUnmount(() => {
  clearInterval(waitTimer.value)
})
</script>

<style scoped lang="scss">

::v-deep(.el-dialog__wrapper) {
  position: absolute !important;
}

::v-deep(.v-modal) {
  position: absolute !important;
}

::v-deep(.el-progress) {
  display: none !important;
}

.label::v-deep( .el-form-item__label) {
  color: #606266;
  font-weight: 600;
}

.tips {
  font-size: 18px;

  .goodsId {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    width: 100%;

    span {
      padding: 20px 10px;
      width: 20%;
    }
  }
}

.uploadStatus {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .finishDesc {
    text-align: center;
  }

  .errorDesc {
    text-align: center;

    span:last-child {
      display: inline-block;
      margin-top: 20px;
    }
  }

  .waitDesc {
    text-align: center;

    span:last-child {
      display: inline-block;
      margin-top: 20px;
    }
  }
}

.uploadInfo {
  display: flex;
  align-items: center;

  .desc {
    font-size: 14px;
    color: red;
  }
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
      min-width: 32px;
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