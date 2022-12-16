import request from "../../utils/request";

export function getCorpApiToken(){
    return request({
        url:'/wecom/corpinfo/info/getCorpOpenApi',
        method:'get'
    })
}

export function getApiJSON(index=0){
    return request({
        url:'/openapi/v1/json/getJson',
        method:'get'
    })
   // return new Promise((resolve,reject)=>{
   //     request({
   //         url:'/openapi/v1/json/getJson',
   //         method:'get'
   //     }).then(res=>{
   //         let {tags} = res.data;
   //         let {path} = tags[index]
   //         resolve(path)
   //     }).catch(err=>{
   //         reject(err)
   //     })
   // })
}