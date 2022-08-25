//导入所有表格相关的pinia
import useAutotrophicTaskStore from "@/store/modules/autotrophicTask.js";
import useRolePermission from '@/store/modules/Company/rolePermission.js'
import useAddressBook from '@/store/modules/Company/addressBook.js'
import useActivityReportStore from "@/store/modules/Company/activityReport.js";
import useSalesWriteOff from "@/store/modules/Company/salesWriteOff.js";

export const tableStore = new Map(
    [
        ["AutotrophicTask", useAutotrophicTaskStore],
        ["RolePermission", useRolePermission],
        ["ActivityReport", useActivityReportStore],
        ["AddressBook", useAddressBook],
        ["SalesWriteOff", useSalesWriteOff]
    ]
)
