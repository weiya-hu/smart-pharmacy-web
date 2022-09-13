//导入所有表格相关的pinia
import useActivityReportStore from "@/store/modules/Company/activityReport.js";

export const tableStore = new Map(
    [
        ["ActivityReport", useActivityReportStore],
    ]
)
