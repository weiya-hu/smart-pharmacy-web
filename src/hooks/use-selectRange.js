import selectionRange from '@/components/selectionRange/selectionRange.vue'
import {ref} from 'vue'

export function useSelectionRangeFunction() {
    let Dialog = ref(selectionRange)
    const dialogShow = function () {
        Dialog.value.showDialog()
    }
    return {
        Dialog,
        dialogShow
    }
}