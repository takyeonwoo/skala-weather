<script setup>
defineProps({
    showDetails: {
        type: Boolean,
        default: false,
    },
    sortByTemp: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update-show-details', 'update-sort'])

const handleShowDetails = (e) => {
    emit('update-show-details', e.target.checked)
}

const handleSort = (e) => {
    emit('update-sort', e.target.checked)
}
</script>

<template>
    <div>
        <label>
            <input type="checkbox" :checked="showDetails" @change="handleShowDetails" />상세 정보 표시
        </label>
        <label>
            <input type="checkbox" :checked="sortByTemp" @change="handleSort" />기온 높은순 정렬
        </label>
    </div>
</template>