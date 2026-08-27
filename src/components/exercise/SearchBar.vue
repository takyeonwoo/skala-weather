<script setup>
defineProps({
    searchQuery: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['update-query'])
const handleInput = (e) => {
    emit('update-query', e.target.value)
}
</script>

<template>
    <div>
        <input
            type="text"
            :value="searchQuery"
            @input="handleInput"
            placeholder="검색할 도시 이름 입력"
        />
        <p>검색 중인 도시: {{ searchQuery }}</p>
    </div>
</template>