<script setup>
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
</script>

<template>
    <li @click="handleCardClick">
        <p>{{ cityItem.name }} ({{ cityItem.status }})</p>
        <p>현재 기온: {{ cityItem.temp }}도</p>
        <p v-show="showDetails">습도 {{ cityItem.humidity }}% · 바람 {{ cityItem.wind }}m/s</p>
        <span v-if="cityItem.temp >= 25" class="badge hot">더움 (25도 이상)</span>
        <span v-else class="badge cool">선선함 (25도 미만)</span>
        <button @click.stop="handleDetailClick">상세보기</button>
    </li>
</template>