//导入所有表格相关的pinia
import useActivityReportStore from "@/store/modules/Company/activityReport.js";
import useSalesReport from "@/store/modules/Company/salesReport.js"

export const tableStore = new Map(
    [
        ["ActivityReport", useActivityReportStore],
        ['SalesReport', useSalesReport]
    ]
)
