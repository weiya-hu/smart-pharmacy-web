import lodash from 'lodash'


// 深拷贝

export const cloneFunction = function (object){
    return  lodash.cloneDeep(object)
}