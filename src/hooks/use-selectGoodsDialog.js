import selectGoodsDialog from '@/components/selectGoodsDialog/selectGoodsDialog.vue'
import {ref} from 'vue'

export function useSelectGoodsDialogFunction() {
    let Dialog = ref(selectGoodsDialog)
    const dialogShow = function () {
        Dialog.value.showDialog()
    }
    return {
        Dialog,
        dialogShow
    }
}