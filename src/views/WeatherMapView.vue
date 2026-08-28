<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { koreaRegions } from '@/data/koreaRegions.js'
import KoreaMap from '@/components/exercise/KoreaMap.vue'
import { useConfigStore } from '@/stores/configStore.js'

const configStore = useConfigStore()

const PROXY_URL = '/api/weather'
const AIR_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'

const MODES = [
    { key: 'temp', label: '기온' },
    { key: 'rain', label: '강수량' },
    { key: 'dust', label: '미세먼지' },
]

const LEGENDS = {
    temp: [
        { cls: 'mode-temp lv-4', text: '30도 이상' },
        { cls: 'mode-temp lv-3', text: '25~29도' },
        { cls: 'mode-temp lv-2', text: '20~24도' },
        { cls: 'mode-temp lv-1', text: '20도 미만' },
    ],
    rain: [
        { cls: 'mode-rain lv-5', text: '매우 강한 30mm~' },
        { cls: 'mode-rain lv-4', text: '강한 15~30mm' },
        { cls: 'mode-rain lv-3', text: '보통 3~15mm' },
        { cls: 'mode-rain lv-2', text: '약한 ~3mm' },
        { cls: 'mode-rain lv-1', text: '비 없음' },
    ],
    dust: [
        { cls: 'mode-dust lv-4', text: '매우나쁨 (76~)' },
        { cls: 'mode-dust lv-3', text: '나쁨 (36~75)' },
        { cls: 'mode-dust lv-2', text: '보통 (16~35)' },
        { cls: 'mode-dust lv-1', text: '좋음 (0~15)' },
    ],
}

const rainIntensity = (mm) => {
    if (mm >= 30) return '매우 강한'
    if (mm >= 15) return '강한'
    if (mm >= 3) return '보통'
    return '약한'
}

const describePrecipitation = (ptyCode, mm) => {
    if (ptyCode === '0') return '없음'
    if (ptyCode === '2') return '진눈깨비'
    if (ptyCode === '3') return '눈'

    const form = ptyCode === '4' ? '소나기' : ptyCode === '1' ? '비' : null
    if (!form) return `알 수 없음(${ptyCode})`

    return mm > 0 ? `${rainIntensity(mm)} ${form}` : form
}

const mode = ref('temp')
const tempMap = ref({})
const rainMap = ref({})
const ptyMap = ref({})
const dustMap = ref({})
const weatherMap = ref({})
const selectedId = ref('')
const isLoading = ref(false)
const messages = ref([])

const valueMap = computed(() => {
    if (mode.value === 'rain') return rainMap.value
    if (mode.value === 'dust') return dustMap.value
    return tempMap.value
})

const legend = computed(() => LEGENDS[mode.value])

const heroValue = computed(() => {
    const v = valueMap.value[selectedId.value]
    if (v === undefined || v === null) return '-'
    return mode.value === 'temp' ? displayTemp(v) : v
})

const heroUnit = computed(() => {
    if (heroValue.value === '-') return ''
    if (mode.value === 'rain') return 'mm'
    if (mode.value === 'dust') return '㎍/㎥'
    return configStore.unitSymbol
})

const heroLabel = computed(() => {
    if (mode.value === 'rain') return '시간당 강수량'
    if (mode.value === 'dust') return '초미세먼지 (PM2.5)'
    return '현재 기온'
})

const heroLevel = computed(() => {
    const v = valueMap.value[selectedId.value]
    if (v === undefined || v === null) return 0
    if (mode.value === 'temp') {
        if (v >= 30) return 4
        if (v >= 25) return 3
        if (v >= 20) return 2
        return 1
    }
    if (mode.value === 'rain') {
        if (v >= 30) return 5
        if (v >= 15) return 4
        if (v >= 3) return 3
        if (v > 0) return 2
        return 1
    }
    if (v >= 76) return 4
    if (v >= 36) return 3
    if (v >= 16) return 2
    return 1
})

const displayTemp = (temp) => {
    if (configStore.unit === 'fahrenheit') {
        return Math.round((temp * 9) / 5 + 32)
    }
    return temp
}

const fetchTemp = async () => {
    const responses = await Promise.all(
        koreaRegions.map((region) =>
            axios.get(PROXY_URL, {
                params: { source: 'current', q: region.query, units: 'metric', lang: 'kr' },
            }),
        ),
    )
    const temps = {}
    const details = {}
    responses.forEach((res, index) => {
        const region = koreaRegions[index]
        const temp = Math.round(res.data.main.temp)
        temps[region.id] = temp
        details[region.id] = {
            name: region.name,
            station: res.data.name,
            temp,
            humidity: res.data.main.humidity,
            wind: res.data.wind.speed,
        }
    })
    tempMap.value = temps
    weatherMap.value = details
}

const baseDateTime = () => {
    const now = new Date(Date.now() - 40 * 60 * 1000)
    const pad = (n) => String(n).padStart(2, '0')
    const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
    const time = `${pad(now.getHours())}00`
    return { date, time }
}

const fetchRain = async () => {
    const { date, time } = baseDateTime()
    const rains = {}
    const ptys = {}

    for (const region of koreaRegions) {
        try {
            const res = await axios.get(PROXY_URL, {
                params: {
                    source: 'kma',
                    dataType: 'JSON',
                    numOfRows: 100,
                    pageNo: 1,
                    base_date: date,
                    base_time: time,
                    nx: region.nx,
                    ny: region.ny,
                },
            })
            const items = res.data?.response?.body?.items?.item ?? []

            const rn1 = items.find((it) => it.category === 'RN1')
            const raw = Number(rn1?.obsrValue)
            rains[region.id] = Number.isFinite(raw) ? raw : 0

            const pty = items.find((it) => it.category === 'PTY')
            if (pty) {
                ptys[region.id] = describePrecipitation(pty.obsrValue, rains[region.id])
            }
        } catch (error) {
            console.warn(`${region.name} 강수량 조회 실패, 건너뜀:`, error.message)
        }
    }

    rainMap.value = rains
    ptyMap.value = ptys
}

const fetchDust = async () => {
    const latitude = koreaRegions.map((r) => r.lat).join(',')
    const longitude = koreaRegions.map((r) => r.lon).join(',')

    const res = await axios.get(AIR_URL, {
        params: { latitude, longitude, current: 'pm2_5' },
    })

    const dusts = {}
    res.data.forEach((item, index) => {
        const value = item?.current?.pm2_5
        if (Number.isFinite(value)) {
            dusts[koreaRegions[index].id] = Math.round(value)
        }
    })

    dustMap.value = dusts
}

const fetchAll = async () => {
    isLoading.value = true
    messages.value = []

    try {
        await fetchTemp()
    } catch (error) {
        console.error('기온 조회 실패:', error)
        messages.value.push(`기온 조회 실패 (${error.response?.status ?? '네트워크 오류'})`)
    }

    try {
        await fetchRain()
    } catch (error) {
        console.error('강수량 조회 실패:', error)
        messages.value.push('강수량 조회 실패 (기상청)')
    }

    try {
        await fetchDust()
    } catch (error) {
        console.error('미세먼지 조회 실패:', error)
        messages.value.push('미세먼지 조회 실패 (Open-Meteo)')
    }

    isLoading.value = false
}

const handleSelectRegion = (region) => {
    selectedId.value = region.id
}

onMounted(fetchAll)
</script>

<template>
    <div class="practice-section">
        <h2>과제6: 날씨 지도</h2>

        <div class="toolbar">
            <button
                v-for="item in MODES"
                :key="item.key"
                :class="{ active: mode === item.key }"
                @click="mode = item.key"
            >
                {{ item.label }}
            </button>
            <button @click="fetchAll" :disabled="isLoading">
                {{ isLoading ? '조회 중...' : '새로고침' }}
            </button>
        </div>

        <p v-for="msg in messages" :key="msg" class="notice">{{ msg }}</p>

        <div class="map-layout">
            <KoreaMap
                :mode="mode"
                :value-map="valueMap"
                :selected-id="selectedId"
                @select-region="handleSelectRegion"
            />

            <div class="info-panel">
                <div v-if="weatherMap[selectedId]" class="detail-card">
                    <div class="detail-header" :class="`mode-${mode} lv-${heroLevel}`">
                        <p class="detail-region">{{ weatherMap[selectedId].name }}</p>
                        <p class="detail-hero">{{ heroValue }}<span class="detail-hero-unit">{{ heroUnit }}</span></p>
                        <p class="detail-hero-label">{{ heroLabel }}</p>
                    </div>

                    <div class="detail-body">
                        <div class="detail-row" v-if="ptyMap[selectedId] !== undefined">
                            <span class="detail-icon">🌤️</span>
                            <span class="detail-label">강수 형태</span>
                            <span class="detail-value">{{ ptyMap[selectedId] }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-icon">🌡️</span>
                            <span class="detail-label">기온</span>
                            <span class="detail-value">
                                {{ displayTemp(weatherMap[selectedId].temp) }}{{ configStore.unitSymbol }}
                            </span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-icon">💧</span>
                            <span class="detail-label">습도</span>
                            <span class="detail-value">{{ weatherMap[selectedId].humidity }}%</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-icon">🍃</span>
                            <span class="detail-label">풍속</span>
                            <span class="detail-value">{{ weatherMap[selectedId].wind }}m/s</span>
                        </div>
                        <div class="detail-row" v-if="rainMap[selectedId] !== undefined">
                            <span class="detail-icon">☔</span>
                            <span class="detail-label">시간당 강수량</span>
                            <span class="detail-value">{{ rainMap[selectedId] }}mm</span>
                        </div>
                        <div class="detail-row" v-if="dustMap[selectedId] !== undefined">
                            <span class="detail-icon">🌫️</span>
                            <span class="detail-label">초미세먼지</span>
                            <span class="detail-value">{{ dustMap[selectedId] }}㎍/㎥</span>
                        </div>
                    </div>

                    <p class="detail-station">관측 지점: {{ weatherMap[selectedId].station }}</p>
                </div>
                <div v-else class="detail-placeholder">
                    <p class="detail-placeholder-icon">🗺️</p>
                    <p>지도에서 지역을 클릭해 보세요.</p>
                </div>

                <ul class="legend">
                    <li v-for="item in legend" :key="item.text">
                        <span :class="item.cls"></span> {{ item.text }}
                    </li>
                </ul>

                <p class="source">
                    기온 OpenWeatherMap · 강수량 기상청 · 미세먼지 Open-Meteo
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.toolbar {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 0.75rem;
}

.toolbar button.active {
    font-weight: bold;
    border: 2px solid #212529;
}

.notice {
    font-size: 0.9rem;
    color: #c92a2a;
}

.map-layout {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    align-items: flex-start;
    margin-top: 1rem;
}

.info-panel {
    width: 280px;
    flex-shrink: 0;
}

.detail-card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-background-soft);
    box-shadow: var(--shadow-md);
    overflow: hidden;
}

.detail-header {
    padding: 1.25rem 1.25rem 1.5rem;
    color: #ffffff;
    background: #adb5bd;
}

.detail-header.mode-temp.lv-1 { background: linear-gradient(135deg, #74c0fc, #4dabf7); }
.detail-header.mode-temp.lv-2 { background: linear-gradient(135deg, #ffe066, #fcc419); }
.detail-header.mode-temp.lv-3 { background: linear-gradient(135deg, #ffa94d, #fd7e14); }
.detail-header.mode-temp.lv-4 { background: linear-gradient(135deg, #ff8787, #fa5252); }

.detail-header.mode-rain.lv-1 { background: linear-gradient(135deg, #ced4da, #adb5bd); }
.detail-header.mode-rain.lv-2 { background: linear-gradient(135deg, #a5d8ff, #74c0fc); }
.detail-header.mode-rain.lv-3 { background: linear-gradient(135deg, #4dabf7, #339af0); }
.detail-header.mode-rain.lv-4 { background: linear-gradient(135deg, #339af0, #1864ab); }
.detail-header.mode-rain.lv-5 { background: linear-gradient(135deg, #1864ab, #0b3866); }

.detail-header.mode-dust.lv-1 { background: linear-gradient(135deg, #63e6be, #38d9a9); }
.detail-header.mode-dust.lv-2 { background: linear-gradient(135deg, #ffe066, #fcc419); }
.detail-header.mode-dust.lv-3 { background: linear-gradient(135deg, #ffa94d, #fd7e14); }
.detail-header.mode-dust.lv-4 { background: linear-gradient(135deg, #ff8787, #fa5252); }

.detail-region {
    font-size: 1.1rem;
    font-weight: 700;
}

.detail-hero {
    margin-top: 0.5rem;
    font-size: 2.6rem;
    font-weight: 800;
    line-height: 1;
}

.detail-hero-unit {
    font-size: 1.2rem;
    font-weight: 600;
    margin-left: 0.15rem;
    opacity: 0.9;
}

.detail-hero-label {
    margin-top: 0.35rem;
    font-size: 0.82rem;
    opacity: 0.9;
}

.detail-body {
    padding: 0.9rem 1.25rem;
}

.detail-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--color-border);
    font-size: 0.88rem;
}

.detail-row:last-child {
    border-bottom: none;
}

.detail-icon {
    font-size: 1rem;
}

.detail-label {
    color: var(--color-text);
    opacity: 0.75;
}

.detail-value {
    margin-left: auto;
    font-weight: 600;
    color: var(--color-heading);
}

.detail-station {
    padding: 0.7rem 1.25rem;
    font-size: 0.78rem;
    color: var(--color-text);
    opacity: 0.7;
    border-top: 1px solid var(--color-border);
}

.detail-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 3rem 1rem;
    text-align: center;
    color: var(--color-text);
    opacity: 0.7;
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-md);
}

.detail-placeholder-icon {
    font-size: 2rem;
}

.legend {
    list-style: none;
    padding: 0;
    margin-top: 1.25rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.35rem 0.7rem;
    font-size: 0.72rem;
}

.legend li {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0;
    border: none;
    border-radius: 0;
    background: none;
    box-shadow: none;
    color: var(--color-text);
    opacity: 0.8;
}

.legend span {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    background-color: #cdcccc;
}

.source {
    margin-top: 1.5rem;
    font-size: 0.78rem;
    color: #868e96;
}

.mode-temp.lv-1 { background-color: #74c0fc; }
.mode-temp.lv-2 { background-color: #ffe066; }
.mode-temp.lv-3 { background-color: #ffa94d; }
.mode-temp.lv-4 { background-color: #ff6b6b; }

.mode-rain.lv-1 { background-color: #e9ecef; }
.mode-rain.lv-2 { background-color: #a5d8ff; }
.mode-rain.lv-3 { background-color: #4dabf7; }
.mode-rain.lv-4 { background-color: #1c7ed6; }
.mode-rain.lv-5 { background-color: #0b4a8f; }

.mode-dust.lv-1 { background-color: #63e6be; }
.mode-dust.lv-2 { background-color: #ffe066; }
.mode-dust.lv-3 { background-color: #ffa94d; }
.mode-dust.lv-4 { background-color: #ff6b6b; }
</style>
