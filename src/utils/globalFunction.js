import lodash from 'lodash'
import moment from "moment";
// 深拷贝
export const cloneFunction = function (object) {
    return lodash.cloneDeep(object)
}
/**获取本周的时间区间范围*/
export const getCurrentWeekTime = () => {
    const startDate = moment().startOf("weeks").format("YYYY-MM-DD HH:mm:ss");
    const endDate = moment().endOf("weeks").format("YYYY-MM-DD HH:mm:ss");
    return [startDate, endDate];
}
/**获取本月的时间区间范围*/
export const getCurrentMonthTime = () => {
    const startDate = moment().startOf("month").format("YYYY-MM-DD HH:mm:ss");
    const endDate = moment().endOf("month").format("YYYY-MM-DD HH:mm:ss");
    return [startDate, endDate];
}