<template>
 <div class="main">
   <div class="desc">应用场景：企业接入店绩接口需要身份验证</div>
   <div class="token-show">
     <div class="token-item">
       <el-row :gutter=20 align="middle" >
         <el-col span=8 >账号:</el-col>
         <el-col span=12>{{toggleAccount}}</el-col>
         <el-col span=4 >
           <el-icon color="#FF5a40" size="18px">
             <View v-show="accShow" @click="toggle('account')"/>
             <Hide v-show="!accShow" @click="toggle('account')"/>
           </el-icon>
         </el-col>
       </el-row>
     </div>
     <div class="token-item">
       <el-row :gutter=20 align="middle" >
         <el-col span=8 >密码:</el-col>
         <el-col span=12>{{tooglePwd}}</el-col>
         <el-col span=4 >
           <el-icon color="#FF5a40" size="18px">
             <View v-show="pwdShow" @click="toggle('pwd')"/>
             <Hide v-show="!pwdShow" @click="toggle('pwd')"/>
           </el-icon>
         </el-col>
       </el-row>
     </div>
   </div>
   <el-divider></el-divider>
   <div class="signature-desc">
     <div class="head">1）微信签名算法</div>
     <div class="step"></div>
     <div class="content"></div>
   </div>

 </div>
</template>

<script setup>
import {Hide,View} from "@element-plus/icons-vue";
import {computed, onMounted} from "vue";
import {getCorpApiToken} from "../../api/getOpenApi/getOpenApi";
const account=ref('xy564564asdt5454')
const pwd=ref('7355608')
const accShow=ref(true)
const pwdShow=ref(false)

//computeds
const toggleAccount=computed(()=>{
  let length=account.value.length?account.value.length:account.value.toString().length;
  return accShow.value?account.value:"*".repeat(length)
})
const tooglePwd=computed(()=>{
  let length=pwd.value.length?pwd.value.length:pwd.value.toString().length;
  return pwdShow.value?pwd.value:"*".repeat(length)
})

//methods
const toggle=(type)=>{
if(type==='account'){
  accShow.value=!accShow.value
}
else{
  pwdShow.value=!pwdShow.value
}
}

//hooks
onMounted(()=>{
getCorpApiToken().then(res=>{
  let {openApiKey,openApiSecret}=res.data
  account.value=openApiKey;
  pwd.value=openApiSecret
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
    color: $color-grey;
    margin: 0 0 10px 0;
    font-size: 13px;
  }
  .token-show{
    font-size: 16px;
    font-weight: bold;
    .token-item .el-col{
      display: flex;
      align-items: center;
      height: 30px;
      line-height: 30px;
    }
    .token-item .el-col:nth-child(2){
      //width: 15%;
      //text-align: center;
      display: block;
    }
    .token-item .el-icon{
      cursor: pointer;
    }
  }
  .signature-desc{
    div{
      margin: 15px 0;
    }
    .head{
       font-weight: bold;
    }
    .step{
       font-size: 13px;
    }
    .content{
      font-size: 13px;
      background: $content-bgColor;
      border-radius: 5px;
      padding: 10px;
    }
  }
}

</style>