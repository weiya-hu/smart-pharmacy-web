<template>
  <div>
    <div class="shp-cnt">
      <div class="operate">
        <el-button @click="operateFunction('editor')" type="primary"
                   v-if="readOnly"
        >修改
        </el-button>
        <el-button
            @click="operateFunction('confirm')"
            type="primary"
            v-if="!readOnly"
        >确定
        </el-button>
        <el-button
            @click="operateFunction('cance')"
            v-if="!readOnly"
        >取消

        </el-button>
      </div>
      <div class="shp-itemGroup">
        <div class="shp-itemGroup_item">
          <el-form label-position="left"
                   label-width="120px"
                   v-model="listData">
            <el-form-item class="label" label="企业logo"
                          prop="logo">
              <div class="logo">
                <div class="upload">
                  <el-upload style="width:180px;height:180px;"
                             class="avatar-uploader"
                             :show-file-list="false"
                  >
                    <div style="textAlign: center;width:180px;height:180px;">
                      <el-icon style="marginTop:50px" size="80px">
                        <Plus/>
                      </el-icon>
                    </div>
                  </el-upload>
                </div>
                <div class="item_logoDes">推荐尺寸702*180</div>
                <!--                <div-->
                <!--                    class="demo-image__preview">-->
                <!--                  <el-image style="width:702px;height:180px;"-->
                <!--                            src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"-->
                <!--                            :initial-index="4"-->
                <!--                            fit="cover"/>-->
                <!--                </div>-->
              </div>
            </el-form-item>
            <el-form-item class="label" label="企业全称">
              <el-input
                  :readonly="readOnly"
                  :disabled="readOnly"
                  placeholder="山海平(成都)医疗科技有限公司"
                  style="width: 300px;"
              />
            </el-form-item>
            <el-form-item class="label" label="企业简称">
              <el-input
                  :readonly="readOnly"
                  :disabled="readOnly"
                  placeholder="山海平"
                  style="width: 300px;"
              />
            </el-form-item>
            <el-form-item class="label" label="主体类型" >
              <el-select
                  :readonly="readOnly"
                  :disabled="readOnly"
                  style="width: 300px;">
                <el-option>连锁</el-option>
                <el-option>药店</el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="label" label="门店编号" >
              <el-input
                  :readonly="readOnly"
                  :disabled="readOnly"
                  placeholder="请填写公司内部的门店编号"
                  style="width: 300px;"
              />
            </el-form-item>
            <el-form-item class="label" label="归属连锁" >
              <el-input
                  :readonly="readOnly"
                  :disabled="readOnly"
                  placeholder="和平医药连锁有限公司"
                  style="width: 300px;"
              />
            </el-form-item>
            <el-form-item class="label" label="连锁品牌" >
              <el-select
                  :readonly="readOnly"
                  :disabled="readOnly"
                  style="width: 300px;">
                <el-option>和平</el-option>
                <el-option>万和</el-option>
                <el-option>一之堂</el-option>
                <el-option>健之佳</el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="label" label="企业地址" style="borderBottom:1px solid #bababa;paddingBottom:10px">
              <el-input
                  :readonly="readOnly"
                  :disabled="readOnly"
                  placeholder="四川省成都市锦江区人民东路6号SAC东原中心1栋19层06单元"
                  style="width: 300px;"
              />
            </el-form-item>

            <el-form-item class="label" label="坐标">
              <div>
                <div class="position">
                    <span>
                      经度：104.07679,  纬度：30.665008
                    </span>
                  <span class="handler" v-if="!readOnly">
                     <el-button @click="getCoordinates" link type="primary">地址拾取</el-button>
                    </span>
                </div>
                <div style="width: 40vw;height: 40vh" id="container">
                </div>
              </div>
            </el-form-item>

            <el-form-item class="label" style="borderBottom:1px solid #bababa;paddingBottom:10px" label="电话">
              <div>028-86111271</div>
            </el-form-item>

            <el-form-item class="label" label="企业成员">
              <div>28个成员</div>
            </el-form-item>

            <el-form-item class="label" label="企业部门">
              <div>4个部门</div>
            </el-form-item>

            <el-form-item class="label" label="已使用/人数上限">
              <div class="usePeople">
                <span>18/200</span>
                <span class="handler">
                  <el-button type="primary" link>申请扩容</el-button>
                </span>
              </div>
            </el-form-item>

            <el-form-item class="label" style="borderBottom:1px solid #bababa;paddingBottom:10px" label="发票抬头">
              <div class="invoice">
                  <span class="handler">
                  <el-button type="primary" link>添加</el-button>
                </span>
                <span>为企业成员配置增值税发票抬头</span>
              </div>
            </el-form-item>

            <el-form-item class="label" label="创建时间">
              <div>2022年4月6日</div>
            </el-form-item>

            <el-form-item class="label" label="企业id">
              <div>13165-SDSA-WWWW-12313S</div>
            </el-form-item>

          </el-form>
        </div>
      </div>
    </div>
  </div>

</template>
<script setup>
import {onMounted, reactive} from "vue";

let listData = reactive({
  companyName: '', //企业名称
  corpType: 3, //企业类型:1厂家,2代理商,3连锁药房,4药店
  brandType: '',
  address: '',
  id: '',
  logo: '',
  latitude: '', //纬度
  longitude: '', //经度
  tel: '', //电话
  plainCorpId: '', //企业id
  createTime: '', //创建时间
  parentName: '',
  storeNo: '',
  parentId: '',
  corpInfoList: [],
  deptCount: '',
  userCount: '',
  corpUserMax: '',
  //   详细地址
  detailAreaInfo: '',
  //   选择地址
  selectAreaInfo: '',
  provinceCode: '',
  cityCode: '',
  countyCode: '',
  provinceName: '',
  cityName: '',
  countyName: '',
  selectAreaName: '',
  tenantId: ''
})
//地图加载
onMounted(() => {
  innitMap()
})

const innitMap = function () {
  var center = new TMap.LatLng(30.665008, 104.07679);//设置中心点坐标
  //初始化地图
  var map = new TMap.Map("container", {
    center: center
  });
  //初始化marker图层
  var markerLayer = new TMap.MultiMarker({
    id: 'marker-layer',
    map: map
  });
  map.on("click", (evt) => {
    //去除之前标记点
    if (markerLayer.geometries.length !== 0) {
      markerLayer.geometries.forEach(item => {
        markerLayer.remove(item.id)
      })
    }
    markerLayer.add({
      position: evt.latLng
    });
  });
}
const changePosition = function () {

}
let readOnly = ref(true)
const operateFunction = function (param) {
  if (param == 'editor') {
    readOnly.value = false
  } else if (param == "confirm") {
    readOnly.value = true
  } else {
    readOnly.value = true
  }

}
//获取选中的地址坐标
const getCoordinates = function () {


}
</script>

<style scoped lang="scss">
.label::v-deep( .el-form-item__label) {
  color: #606266;
  font-weight: 600;
  justify-content: flex-start !important;
}

.shp-cnt {
  padding: 10px 0 0 40px;

  .operate {
    margin: 10px 0 20px 0;
  }

  .logo {
    .upload {
      text-align: center;
      width: 180px;
      height: 180px;
      border: 2px dashed #97a8be;
    }

  }

  .position {
    .handler {
      margin-left: 15px;
    }
  }

  .usePeople {
    .handler {
      margin-left: 15px;
    }
  }

  .invoice {
    .handler {
      margin-right: 15px;
    }
  }
}

</style>


