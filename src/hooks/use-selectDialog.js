import selectDialog from '@/components/selectDialog/selectDialog.vue'
import {ref} from 'vue'

export function useSelectDialogFunction() {
    let deepDialog = ref(selectDialog)
    const dialogShow = function () {
        deepDialog.value.showDialog()
    }
    return {
        deepDialog,
        dialogShow
    }
}