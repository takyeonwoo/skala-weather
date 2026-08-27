<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore.js'
import { useFavoriteStore } from '@/stores/favoriteStore.js'

const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()

const props = defineProps({
    cityItem: { type: Object, required: true, },
    showDetails: { type: Boolean, default: false, },
})

const emit = defineEmits(['select-card', 'click-detail'])
const handleCardClick = () => {
    emit('select-card', props.cityItem.name)
}

const handleDetailClick = () => {
    emit('click-detail', props.cityItem.name, props.cityItem.status)
}

const displayTemp = computed(() => {
    const rawTemp = props.cityItem.temp
    if (configStore.unit === 'fahrenheit') {
        return Math.round((rawTemp * 9) / 5 + 32)
    }
    return rawTemp
})
</script>

<template>
    <li @click="handleCardClick">
        <p>{{ cityItem.name }} ({{ cityItem.status }})</p>
        <p>현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
        <p v-show="showDetails">습도 {{ cityItem.humidity }}% · 바람 {{ cityItem.wind }}m/s</p>
        <span v-if="cityItem.temp >= 25" class="badge hot">더움 (25도 이상)</span>
        <span v-else class="badge cool">선선함 (25도 미만)</span>
        <button @click.stop="favoriteStore.toggleFavorite(cityItem.id)">
            {{ favoriteStore.isFavorite(cityItem.id) ? '★' : '☆' }}
        </button>
        <button @click.stop="handleDetailClick">상세보기</button>
    </li>
</template>