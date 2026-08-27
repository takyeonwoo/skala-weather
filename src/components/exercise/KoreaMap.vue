<script setup>
import { koreaRegions } from '@/data/koreaRegions.js'
import { useConfigStore } from '@/stores/configStore.js'

const configStore = useConfigStore()

const props = defineProps({
    mode: {
        type: String,
        default: 'temp',
    },
    valueMap: {
        type: Object,
        default: () => ({}),
    },
    selectedId: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['select-region'])

const levelOf = (id) => {
    const v = props.valueMap[id]
    if (v === undefined || v === null) return 0
    if (props.mode === 'temp') {
        if (v >= 30) return 4
        if (v >= 25) return 3
        if (v >= 20) return 2
        return 1
    }
    if (props.mode === 'rain') {
        if (v >= 20) return 4
        if (v >= 5) return 3
        if (v > 0) return 2
        return 1
    }
    if (v >= 76) return 4
    if (v >= 36) return 3
    if (v >= 16) return 2
    return 1
}

const labelText = (id) => {
    const v = props.valueMap[id]
    if (v === undefined || v === null) return ''
    if (props.mode === 'temp') {
        const t = configStore.unit === 'fahrenheit' ? Math.round((v * 9) / 5 + 32) : v
        return `${t}${configStore.unitSymbol}`
    }
    if (props.mode === 'rain') return `${v}mm`
    return `${v}㎍`
}
</script>

<template>
    <svg class="korea-map" viewBox="0 0 800 1200">
        <template v-for="region in koreaRegions" :key="region.id">
            <polyline
                v-if="region.tag === 'polyline'"
                :points="region.geom"
                :transform="region.transform"
                :class="[
                    'region',
                    `mode-${mode}`,
                    `lv-${levelOf(region.id)}`,
                    { selected: selectedId === region.id },
                ]"
                @click="emit('select-region', region)"
            />
            <path
                v-else
                :d="region.geom"
                :class="[
                    'region',
                    `mode-${mode}`,
                    `lv-${levelOf(region.id)}`,
                    { selected: selectedId === region.id },
                ]"
                @click="emit('select-region', region)"
            />
        </template>

        <g v-for="region in koreaRegions" :key="`label-${region.id}`" class="label-group">
            <text :x="region.labelX" :y="region.labelY" class="label-name">
                {{ region.name }}
            </text>
            <text
                v-if="labelText(region.id)"
                :x="region.labelX"
                :y="region.labelY + 22"
                class="label-value"
            >
                {{ labelText(region.id) }}
            </text>
        </g>
    </svg>
</template>

<style scoped>
.korea-map {
    width: 100%;
    max-width: 480px;
    height: auto;
}

.region {
    stroke: #ffffff;
    stroke-width: 1;
    stroke-miterlimit: 1;
    cursor: pointer;
    transition: opacity 0.15s;
    fill: #cdcccc;
}

.region:hover {
    opacity: 0.7;
}

.region.selected {
    stroke: #212529;
    stroke-width: 3;
}

.lv-0 { fill: #cdcccc; }

.mode-temp.lv-1 { fill: #74c0fc; }
.mode-temp.lv-2 { fill: #ffe066; }
.mode-temp.lv-3 { fill: #ffa94d; }
.mode-temp.lv-4 { fill: #ff6b6b; }

.mode-rain.lv-1 { fill: #e9ecef; }
.mode-rain.lv-2 { fill: #a5d8ff; }
.mode-rain.lv-3 { fill: #4dabf7; }
.mode-rain.lv-4 { fill: #1864ab; }

.mode-dust.lv-1 { fill: #63e6be; }
.mode-dust.lv-2 { fill: #ffe066; }
.mode-dust.lv-3 { fill: #ffa94d; }
.mode-dust.lv-4 { fill: #ff6b6b; }

.label-group {
    pointer-events: none;
}

.label-name {
    font-size: 22px;
    font-weight: bold;
    fill: #212529;
    text-anchor: middle;
    paint-order: stroke;
    stroke: #ffffff;
    stroke-width: 4px;
}

.label-value {
    font-size: 20px;
    fill: #495057;
    text-anchor: middle;
    paint-order: stroke;
    stroke: #ffffff;
    stroke-width: 4px;
}
</style>
