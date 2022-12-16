<template>
 <div class="main">
   <div class="status">
     应用场景：对接企业DDI和店绩后台
   </div>
   <div class="desc">
     接口说明：将企业的DDI归属系统通过该接口与店绩完成对接，获取实时的DDI数据
   </div>
   <div class="content">
     <div class="content-item">
       <span>主机（Host）: </span>
       <span>{{apiObj.host}}</span>
     </div>
     <div class="content-item">
       <span>基础路径（basePath）: </span>
       <span>{{ apiObj.basePath }}</span>
     </div>
     <div class="content-item">
       <span>安全校验（Bearer Token）: </span>
       <span>{{ apiObj.securityDefinitions?'需要':'不需要' }}</span>
     </div>
     <div class="content-item" v-if="apiObj.securityDefinitions">
       <span>位置（In）: </span>
       <span>{{ apiObj.securityDefinitions.Bearer.in }}</span>
     </div>
     <div class="content-item" v-if="apiObj.securityDefinitions">
       <span>键名（Key）: </span>
       <span>{{ apiObj.securityDefinitions.Bearer.name }}</span>
     </div>
     <div class="content-item" v-if="apiObj.securityDefinitions">
       <span>类型（Type）: </span>
       <span>{{ apiObj.securityDefinitions.Bearer.type }}</span>
     </div>

   </div>
   <el-divider></el-divider>
  <div class="api-list" v-for="(item,index) in apiList">
    <template v-for="(val,key,index) in item">
      <div class="api-info">
        <div>URL：{{key}}</div>
        <template v-for="(val1,key1,index1) in val">
          <div style="font-weight: bold">{{ val1.summary }}</div>
          <div>请求方式：{{key1}}</div>
          <div>请求类型：{{val1.consumes}}</div>
          <div class="api-params">
            <div class="bold">公共参数</div>
            <el-table :data="val1.parameters" stripe  style="width: 60%">
              <el-table-column prop="name" label="参数名" align="center" />
              <el-table-column prop="required" label="是否必要" align="center" />
              <el-table-column prop="in" label="参数位置" align="center"/>
              <el-table-column  label="参数类型" align="center" #default="scope">
                      {{scope.row.schema.type || scope.row.schema['$ref'].type}}
              </el-table-column>
              <el-table-column #default="scope" label="详情" align="center">
                 <el-button :icon="View" text type="primary" @click="goDetail(scope.row.schema)" v-if="scope.row.schema['$ref']"></el-button>
                 <span v-else>--</span>
              </el-table-column>
            </el-table>
          </div>

          <div class="api-status">
            <el-table></el-table>
          </div>
        </template>
      </div>

    </template>
  </div>

   <el-dialog center align-center  v-model="dialogVisible"
              :title="getObjTitle"
              width="60%">
     <el-table :data="paramsDetailList" stripe >
       <el-table-column label="键名" prop="name" align="left"></el-table-column>
       <el-table-column label="描述" prop="desc" align="left"></el-table-column>
       <el-table-column label="类型" prop="type" align="left"></el-table-column>
       <el-table-column label="格式" #default="scope" align="center">
         {{scope.row.format?scope.row.format:'无'}}
       </el-table-column>
       <el-table-column label="必传" #default="scope" align="center">
         <span style="color: #ff5a40" v-if="scope.row.required">是</span>
         <span v-else>否</span>
       </el-table-column>
     </el-table>
   </el-dialog>
 </div>
</template>

<script setup>
import {computed, onMounted} from "vue";
import {getApiJSON} from "@/api/getOpenApi/getOpenApi";
import {View} from "@element-plus/icons-vue";


//refs
const apiObj=ref({})
const apiList=ref([])
const paramsDetailList=ref([])
const dialogVisible=ref(false)
const statusList=ref([
  {
      name:'200',
      desc:"ok",
    },
  {
    name:'201',
    desc:"Created",

  },{
    name:'401',
    desc:"Unauthorized",
  },{
    name:'403',
    desc:"Forbidden",
  },
  {
    name:'404',
    desc:'Not Found'
  }
])

//computed
const getObjTitle=computed(()=>{
  return `键名列表`
})

//methods
const goDetail=(obj)=>{
let {properties,required,title}=obj['$ref'];
  let list=[]
for(let [name,proxy] of Object.entries(properties)){
  list.push({
    name,
    desc:proxy.description,
    type:proxy.type,
    format:proxy.format,
    required:required.indexOf(name)==-1?false:true
  })
}
  paramsDetailList.value=list.sort((a,b)=>{
    return -(a.required-b.required)
  })
  dialogVisible.value=true
}
const getResponseList=(obj)=>{
 let responseObj=obj['/v1/ddi/add'].post['responses']
  let list=[]
  for(let [name,proxy] of Object.entries(responseObj['200'].schema['$ref'].properties)){
    list.push({
      name,
      type:proxy.type,
      desc:proxy.description
    })
  }
}

//hooks
onMounted(()=>{
  getApiJSON().then(res=>{
    if(res.code==200){
      res.data=JSON.parse(res.data)
     apiObj.value=res.data
      apiList.value=res.data.tags[0].paths
      getResponseList(apiList.value[0])
    }
  })
})
</script>

<style lang="scss" scoped>
$color-grey:#999;
$base-black:#333;
$content-bgColor:#F7F7F7;
.main{
  padding: 20px;
  color: $base-black;
  .desc{
    //color: $color-grey;
    margin: 0 0 10px 0;
    font-weight: bold;
  };
  .status{
    color: $color-grey;
    margin: 0 0 10px 0;
    font-size: 13px;
  }
  .content{
    background: $content-bgColor;
    font-size: 13px;
    padding: 15px;
    border-radius: 5px;
    .content-item{
      margin: 10px 0;
      span:nth-child(1){
        font-weight: bold;
      }
    }
  }
  .api-list{
    div{
      margin: 5px 0;
    }
    .bold{
      font-weight: bold;
      font-size: 15px !important;
      margin: 15px 0 5px 0;
    }
    .api-name{
      font-weight: bold;
      font-size: 15px;
      margin:15px 0;
    }
    .api-info{
      div{
        font-size: 13px;
      }
    }
  }
}
</style>