<template>
  <div class="out-box">
    <selectGoodsDialog ref="selectGoodsDialogInstance"></selectGoodsDialog>
    <el-dialog v-model="visible" :show-close="false">
      <template #title="{ close, titleId, titleClass }">
        <div class="my-header">
          <div :id="titleId" :class="titleClass" class="title">活动商品</div>
          <div class="handler">
            <el-link type="primary">确定</el-link>
            <el-link type="primary" @click="close">取消</el-link>
          </div>
        </div>
      </template>
      <div class="content">

        <div class="singleGoods">
          <div class="singleHandler">
            <span>单个商品</span>
            <el-button @click="showGoodsDialog" size="small" class="el-icon-plus"
                       :icon="Plus">
            </el-button>
          </div>
          <el-scrollbar height="400px">
            <div class="singleContent">
              <div class="singleList">
                <div>统一规则1</div>
                <ul>
                  <li>
                    <span>商品一</span>
                    <span>x</span>
                  </li>
                  <li>
                    <span>商品二</span>
                    <span>x</span>
                  </li>
                  <li>
                    <span>商品三</span>
                    <span>x</span>
                  </li>
                  <li>
                    <span>商品四</span>
                    <span>x</span>
                  </li>
                </ul>
              </div>
              <div class="singleList">
                <div>统一规则1</div>
                <ul>
                  <li>
                    <span>商品一</span>
                    <span>x</span>
                  </li>
                  <li>
                    <span>商品二</span>
                    <span>x</span>
                  </li>
                  <li>
                    <span>商品三</span>
                    <span>x</span>
                  </li>
                  <li>
                    <span>商品四</span>
                    <span>x</span>
                  </li>
                </ul>
              </div>
              <div class="singleList">
                <div>统一规则1</div>
                <ul>
                  <li>
                    <span>商品一</span>
                    <span>x</span>
                  </li>
                  <li>
                    <span>商品二</span>
                    <span>x</span>
                  </li>
                  <li>
                    <span>商品三</span>
                    <span>x</span>
                  </li>
                  <li>
                    <span>商品四</span>
                    <span>x</span>
                  </li>
                </ul>
              </div>
            </div>
          </el-scrollbar>
        </div>

        <div class="composeGoods">
          <div class="composeHandler">
            <span>组合商品</span>
            <el-button size="small" class="el-icon-plus"
                       :icon="Plus">
            </el-button>
          </div>
          <el-scrollbar height="400px">
            <div class="composeContent">
              <div class="composeList">
                <div class="close">
                  <el-icon>
                    <Close/>
                  </el-icon>
                </div>
                <ul>
                  <li>
                    <span>商品一</span>
                    <div class="count">
                      <el-input size="small"></el-input>
                      <span>件</span>
                    </div>
                  </li>
                  <li>
                    <span>商品二</span>
                    <div class="count">
                      <el-input size="small"></el-input>
                      <span>件</span>
                    </div>
                  </li>
                  <li>
                    <span>商品三</span>
                    <div class="count">
                      <el-input size="small"></el-input>
                      <span>件</span>
                    </div>
                  </li>
                  <li>
                    <span>商品四</span>
                    <div class="count">
                      <el-input size="small"></el-input>
                      <span>件</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="composeList">
                <div class="close">
                  <el-icon>
                    <Close/>
                  </el-icon>
                </div>
                <ul>
                  <li>
                    <span>商品一</span>
                    <div class="count">
                      <el-input size="small"></el-input>
                      <span>件</span>
                    </div>
                  </li>
                  <li>
                    <span>商品二</span>
                    <div class="count">
                      <el-input size="small"></el-input>
                      <span>件</span>
                    </div>
                  </li>
                  <li>
                    <span>商品三</span>
                    <div class="count">
                      <el-input size="small"></el-input>
                      <span>件</span>
                    </div>
                  </li>
                  <li>
                    <span>商品四</span>
                    <div class="count">
                      <el-input size="small"></el-input>
                      <span>件</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="composeList">
                <div class="close">
                  <el-icon>
                    <Close/>
                  </el-icon>
                </div>
                <ul>
                  <li>
                    <span>商品一</span>
                    <div class="count">
                      <el-input size="small"></el-input>
                      <span>件</span>
                    </div>
                  </li>
                  <li>
                    <span>商品二</span>
                    <div class="count">
                      <el-input size="small"></el-input>
                      <span>件</span>
                    </div>
                  </li>
                  <li>
                    <span>商品三</span>
                    <div class="count">
                      <el-input size="small"></el-input>
                      <span>件</span>
                    </div>
                  </li>
                  <li>
                    <span>商品四</span>
                    <div class="count">
                      <el-input size="small"></el-input>
                      <span>件</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </el-scrollbar>
        </div>

      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import selectGoodsDialog from '../selectGoodsDialog/selectGoodsDialog.vue'
import {Plus, Search, Picture, RefreshRight, Close} from '@element-plus/icons-vue'

const visible = ref(false)


const selectGoodsDialogInstance = ref('')
const showGoodsDialog = function () {
  console.log("函数执行")
  selectGoodsDialogInstance.value.showDialog()

}
const showDialog = function () {
  visible.value = true
}

defineExpose({
  showDialog
})

</script>

<style scoped lang="scss">
//.out-box::v-deep .el-dialog__body {
//  padding: 0 ;
//}

.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .title {
    font-size: 20px;
    font-weight: 600;
    width: 90%;
  }

  .handler {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 10%;
  }
}

.content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .singleGoods {
    display: flex;
    flex-direction: column;
    width: 50%;
    border-right: 3px solid #838383;

    .singleHandler {
      border-top: 3px solid #838383;
      border-bottom: 3px solid #838383;
      display: flex;
      padding: 10px 0 10px 10px;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;

      span {
        margin-right: 15px;
      }
    }

    .singleContent {
      padding: 10px;

      .singleList {
        border: 2px solid #d7d7d7;
        border-radius: 10px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;

        ul {
          padding: 5px;

          li {
            list-style-type: none;
            height: 20px;
            width: 100%;
            margin: 10px 0;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          }
        }
      }
    }
  }

  .composeGoods {
    display: flex;
    flex-direction: column;
    width: 50%;

    .composeHandler {
      border-top: 3px solid #838383;
      padding: 10px 0 10px 10px;
      display: flex;
      flex-direction: row;
      margin-bottom: 10px;
      align-items: center;
      border-bottom: 3px solid #838383;

      span {
        margin-right: 15px;
      }
    }

    .composeContent {
      padding: 10px;

      .composeList {
        border: 2px solid #d7d7d7;
        border-radius: 10px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;

        .close {
          display: flex;
          justify-content: flex-end;
          font-size: 20px;
        }

        ul {
          padding: 5px;

          li {
            list-style-type: none;
            height: 20px;
            width: 100%;
            margin: 10px 0;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            .count {
              display: flex;
              flex-direction: row;
              align-items: center;
              width: 20%;
              justify-content: space-between;

              span {
                margin-left: 3px;
              }
            }
          }
        }
      }
    }
  }
}


</style>


