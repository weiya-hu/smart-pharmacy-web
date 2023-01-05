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
   <el-divider>接口列表</el-divider>
  <div class="api-list" v-for="(item,index) in apiList" >
    <template v-for="(val,key,index1) in item">
      <div class="api-info" >
        <div class="bold">url：<span class="default">{{key}}</span></div>
        <template v-for="(val1,key1,index1) in val">
          <div class="bold">{{ val1.summary }}</div>
          <div class="bold">请求方式：<span class="default">{{key1}}</span></div>
          <div class="bold">Content-Type：<span class="default">{{val1.consumes || '无'}}</span></div>
          <div class="api-params">
            <div class="bold" style="color: #999">公共参数</div>
            <el-table :data="val1.parameters" stripe  style="width: 60%">
              <el-table-column prop="name" label="参数名" align="left" />
              <el-table-column prop="required" label="是否必要" align="left" />
              <el-table-column prop="in" label="参数位置" align="left"/>
              <el-table-column  label="参数类型" align="left" #default="scope">
                      {{scope.row.schema.type || scope.row.schema['$ref'].type}}
              </el-table-column>
              <el-table-column #default="scope" label="详情" align="center">
                 <el-button :icon="View" text type="primary" @click="goDetail(scope.row.schema)" v-if="scope.row.schema['$ref']"></el-button>
                 <span v-else>--</span>
              </el-table-column>
            </el-table>
          </div>

          <div class="api-status">
            <div class="bold" style="color: #999">状态码</div>
            <el-table :data="statusList" stripe style="width: 60%">
              <el-table-column label="状态码（Code）" prop="name" align="left"></el-table-column>
              <el-table-column label="描述" prop="desc" align="left"></el-table-column>
              <el-table-column label="返回值" prop="desc" align="center" #default="scope">
                <el-button :icon="View" text type="primary" @click="dialogVisible2=true" v-if="scope.row.responses && index!=3"></el-button>
                <span v-else>--</span>
              </el-table-column>

            </el-table>
          </div>
        </template>
      </div>
    </template>

  </div>

   <el-dialog center align-center append-to-body v-model="dialogVisible"
              :title="getObjTitle"
              width="60%">
       <el-table :data="paramsDetailList" stripe >
         <el-table-column label="键名" prop="name" align="left"></el-table-column>
         <el-table-column label="描述" prop="desc" align="left"></el-table-column>
         <el-table-column label="类型"  align="left" #default="scope">
           <span v-if="scope.row.type=='array' || scope.row.type=='object'">Array&ltobject&gt<el-button :icon="toggleView" text type="primary" @click="getMoreParamList(scope.$index,scope.row.items,)"></el-button></span>
           <span v-else>{{ scope.row.type }}</span>
         </el-table-column>
         <el-table-column label="格式" #default="scope" align="left">
           {{scope.row.format?scope.row.format:'无'}}
         </el-table-column>
         <el-table-column label="必传" #default="scope" align="left">
           <span style="color: #ff5a40" v-if="scope.row.required">是</span>
           <span v-else>否</span>
         </el-table-column>
       </el-table>

     <template v-if="moreShow" >
       <div class="moreShow">详情</div>
       <el-table  stripe :data="moreParamsList" >
         <el-table-column label="键名" prop="name" align="left"></el-table-column>
         <el-table-column label="描述" prop="desc" align="left"></el-table-column>
         <el-table-column label="类型" prop="type" align="left"></el-table-column>
       </el-table>
     </template>
   </el-dialog>

   <el-dialog center align-center  v-model="dialogVisible2"
              title="返回值"
              width="60%">
     <el-table :data="statusList[0].responses" stripe >
       <el-table-column label="键名" prop="name" align="left"></el-table-column>
       <el-table-column label="描述" prop="desc" align="left"></el-table-column>
       <el-table-column label="类型" prop="type" align="left"></el-table-column>
       <el-table-column label="示例" prop="exam" align="left"></el-table-column>
     </el-table>
   </el-dialog>

 </div>
</template>

<script setup>
import {computed, onMounted} from "vue";
import {getApiJSON} from "@/api/getOpenApi/getOpenApi";
import {View,Hide} from "@element-plus/icons-vue";


//refs
const apiObj=ref({})
const apiList=ref([])
const paramsDetailList=ref([])
const moreParamsList=ref([])
const dialogVisible=ref(false)
const moreShow=ref(false)
const pick=ref('')
const beforeIndex=ref(-1)
const dialogVisible2=ref(false)
const statusList=ref([
  {
      name:'200',
      desc:"ok",
    },
  {
    name:'201',
    desc:"Created",

  },
  {
    name:'401',
    desc:"Unauthorized",
  },
  {
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

const toggleView=computed(()=>{
  return moreShow.value?"Hide":'View'
})

//methods
const goDetail=(obj)=>{
let {properties,required}=obj['$ref'];
  let list=[]
for(let [name,proxy] of Object.entries(properties)){

  list.push({
    name,
    desc:proxy.description,
    type:proxy.type,
    format:proxy.format,
    required:required.indexOf(name)==-1?false:true,
    items:proxy.items?proxy['items']['$ref']['properties']:{}
  })
}
  paramsDetailList.value=list.sort((a,b)=>{
    return -(a.required-b.required)
  })
  dialogVisible.value=true
}

const getResponseList=(obj)=>{

 for(let i in obj){
      for(let [key,value] of Object.entries(obj[i])){
        let responseObj=value.get || value.post
        if(responseObj['responses']['200'].schema){
          let list=[]
              for(let [name,proxy] of Object.entries(responseObj['responses']['200'].schema['$ref'].properties)){
              if(proxy){
                list.push({
                  name,
                  type:proxy.type,
                  desc:proxy.description,
                  exam:proxy.example?proxy.example:'无'
                })
                statusList.value[0].responses=list
              }
              }
            }
      }

 }
}

const getMoreParamList=(index,obj)=>{
  if(index==beforeIndex.value){
    moreShow.value=!moreShow.value
  }
  else{
    moreShow.value=true
  }
  let list=[]
  for(let [name,proxy] of Object.entries(obj)){
    list.push({
      name,
      desc:proxy.description,
      type:proxy.type,
      format:proxy.format,
    })
  }
  moreParamsList.value=list
  beforeIndex.value=index
}

//hooks
onMounted(()=>{
  getApiJSON().then(res=>{
    if(res.code==200){
      res.data=JSON.parse(res.data)
     apiObj.value=res.data
      apiList.value=res.data.tags[0].paths
      getResponseList(apiList.value)
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
    margin-bottom:100px;
    div{
      margin: 5px 0;
    }
    .el-divider--horizontal{
      margin: 24px 0;
    }
    //.divider-style{
    //  height: 10px;
    //  border-radius: 20px;
    //  background: #666;
    //  border-color:#666 ;
    //}
    .bold{
      font-weight: bold;
      font-size: 15px !important;
      margin: 15px 0 5px 0;
    }
    .default{
      font-weight:normal ;
      font-size: 14px;
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

.moreShow{
  text-align: center;
  font-size: 18px;
  margin: 30px 0;
}
</style>