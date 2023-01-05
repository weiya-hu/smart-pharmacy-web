<template>
 <div class="main">
   <div class="desc">应用场景：企业接入店绩接口需要身份验证</div>
   <div class="token-show">
     <div class="token-item">
       <el-row :gutter=20 align="middle" >
         <el-col span=8 >appKey:</el-col>
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
         <el-col span=8 >appSecret:</el-col>
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

   <div class="head">1）微信签名算法</div>
   <div class="signature-desc">

     <div class="step">
       第一步: 在所有发送或者接收到的数据中，将参与签名的四个字段，使用URL键值对的格式，按照固定顺序（即appKey=value1&timerStamp=value2&nonce=value3&appSecret=value4）,拼接成字符串stringA。
     </div>
     <div class="content">
       <div style="font-weight: bold; font-size: 15px">注意:
       </div>
       <div>参数名区分大小写
       </div>
       <div>参数按照固定顺序拼接
       </div>
       <div>
         传送的sign参数不参与签名，将生成的签名与该sign值作校验
       </div>
     </div>
   </div>

   <div class="signature-desc">
     <div class="step">
       第二步: 对StringA进行MD5运算，再将得到的字符串中所有字符转换为大写，得到sign值signValue。 </div>
     <div class="content">
       <div style="font-weight: bold; font-size: 15px">
         固定如下几个字段参与签名：
       </div>
       <div>系统提供的appkey：appKey
       </div>
       <div>当前时间戳：timerStamp
       </div>
       <div>
         6位的随机数：nonce
       </div>
       <div>
         系统生成的密码：appSecret
       </div>
     </div>
   </div>

   <div class="head">示例</div>

   <div class="exam">
       <div class="content">
         <div class="bold">请求内容:
         </div>
         <div>appKey：CMTczTDfA33pPcdnzCEEh8r7cTJP7QPr
         </div>
         <div>
           timerStamp：1670395977696
         </div>
         <div>
           nonce：666666
         </div>
         <div>
           appSecret：ST8fMZZjk22hC5Hp25NbSEr7KmcG3fdH
         </div>
       </div>
        <div class="step-container">
          <div class="step">
            第一步: 参数按照key=value的格式拼接，排序如下：
            stringA="appKey=CMTczTDfA33pPcdnzCEEh8r7cTJP7QPr&timerStamp=1670395977696&nonce=666666&appSecret=ST8fMZZjk22hC5Hp25NbSEr7KmcG3fdH"
          </div>
          <div class="step">
            第二步：得到signValue：
            sign=MD5(stringA).toUpperCase()
          </div>
        </div>
   </div>



 </div>
</template>

<script setup>
import {Hide,View} from "@element-plus/icons-vue";
import {computed, onMounted} from "vue";
import {getCorpApiToken} from "../../api/getOpenApi/getOpenApi";
const account=ref('')
const pwd=ref('')
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
  .head{
    font-weight: bold;
    margin: 15px 0;
  }
  .signature-desc{
    margin-bottom: 50px ;
    div{
      margin: 15px 0;
    }
    .step{
       font-size: 13px;
    }
    .content{
      font-size: 13px;
      background: $content-bgColor;
      border-radius: 5px;
      padding: 10px 20px;
    }
    div{
      margin: 10px 0;
    }
  }

  .exam{
    font-size: 13px;
    background: $content-bgColor;
    border-radius: 5px;
    padding: 10px 20px;
    .bold{
      font-size: 14px;
      font-weight: bold;
    }
    .content{
    div{
      margin: 10px 0;
    }
    }
    .step-container{
    margin: 30px 0;
     .step{
       margin: 10px 0;
     }
    }
  }
}

</style>