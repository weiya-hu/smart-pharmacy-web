//导入所有表格相关的pinia
import useAutotrophicTaskStore from "@/store/modules/autotrophicTask.js";
import useRolePermission from '@/store/modules/company/rolePermission.js'
import useAddressBook from '@/store/modules/company/addressBook.js'
import useActivityReportStore from "@/store/modules/company/activityReport.js";
import useSalesWriteOff from "@/store/modules/company/salesWriteOff.js";

export const tableStore = new Map(
    [
        ["AutotrophicTask", useAutotrophicTaskStore],
        ["RolePermission", useRolePermission],
        ["ActivityReport", useActivityReportStore],
        ["AddressBook", useAddressBook],
        ["SalesWriteOff", useSalesWriteOff]
    ]
)
