<script setup>
import { useConfigStore } from '@/stores/configStore.js'

const configStore = useConfigStore()
</script>

<template>
    <span class="unit-toggler">
        날씨단위: {{ configStore.unit === 'celsius' ? '섭씨' : '화씨' }}({{ configStore.unitSymbol }})
        <button @click="configStore.toggleUnit">단위변경</button>
    </span>
</template>