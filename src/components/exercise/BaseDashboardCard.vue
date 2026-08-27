<script setup>
defineProps({
    title: {
        type: String,
        default: '',
    },
})
</script>

<template>
    <div class="dashboard-box">
        <h3>{{ title }}</h3>
        <slot>
            <p>표시할 내용이 없습니다.</p>
        </slot>
    </div>
</template>

<style scoped>
.dashboard-box {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-background-soft);
    box-shadow: var(--shadow-sm);
    padding: 1.1rem 1.25rem;
    margin-bottom: 1.25rem;
}

.dashboard-box h3 {
    margin-top: 0;
}
</style>