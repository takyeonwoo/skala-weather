import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useConfigStore = defineStore('config', () => {
    const unit = ref('celsius')

    const unitSymbol = computed(() => (unit.value === 'celsius' ? '℃' : '℉'))

    function toggleUnit() {
        unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
    }

    return { unit, unitSymbol, toggleUnit }
})