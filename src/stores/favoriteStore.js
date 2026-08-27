import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoriteStore = defineStore('favorite', () => {
    const favoriteIds = ref([])

    const favoriteCount = computed(() => favoriteIds.value.length)

    function toggleFavorite(cityId) {
        if (favoriteIds.value.includes(cityId)) {
            favoriteIds.value = favoriteIds.value.filter((id) => id !== cityId)
        } else {
            favoriteIds.value.push(cityId)
        }
    }

    function isFavorite(cityId) {
        return favoriteIds.value.includes(cityId)
    }

    return { favoriteIds, favoriteCount, toggleFavorite, isFavorite }
})