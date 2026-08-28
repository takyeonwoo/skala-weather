<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import axios from 'axios'
import { useConfigStore } from '@/stores/configStore.js'

const route = useRoute()
const configStore = useConfigStore()

const cityList = [
    { id: 'city_01', name: '서울', query: 'Seoul' },
    { id: 'city_02', name: '수원', query: 'Suwon' },
    { id: 'city_03', name: '부산', query: 'Busan' },
    { id: 'city_04', name: '대전', query: 'Daejeon' },
    { id: 'city_05', name: '대구', query: 'Daegu' },
    { id: 'city_06', name: '광주', query: 'Gwangju' },
    { id: 'city_07', name: '강릉', query: 'Gangneung' },
    { id: 'city_08', name: '제주', query: 'Jeju' },
]

const FORECAST_URL = '/api/weather'

const cityInfo = ref(null)
const forecastList = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const fetchForecast = async () => {
    cityInfo.value = cityList.find((c) => c.id === route.params.cityId)
    if (!cityInfo.value) {
        errorMessage.value = '알 수 없는 도시입니다.'
        return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
        const res = await axios.get(FORECAST_URL, {
            params: { source: 'forecast', q: cityInfo.value.query, units: 'metric', lang: 'kr' },
        })

        forecastList.value = res.data.list
            .filter((item) => item.dt_txt.includes('12:00:00'))
            .map((item) => ({
                date: item.dt_txt.split(' ')[0],
                temp: Math.round(item.main.temp),
                status: item.weather[0].description,
                humidity: item.main.humidity,
            }))

        console.log('Forecast 응답:', res.data)
    } catch (error) {
        console.error('예보 조회 실패:', error)
        errorMessage.value = `예보를 가져오지 못했습니다. (${error.response?.status ?? '네트워크 오류'})`
    } finally {
        isLoading.value = false
    }
}

const displayTemp = (temp) => {
    if (configStore.unit === 'fahrenheit') {
        return Math.round((temp * 9) / 5 + 32)
    }
    return temp
}

onMounted(fetchForecast)
</script>

<template>
    <div class="practice-section">
        <h2>과제6: 실시간 날씨 (Axios)</h2>
        <h3>{{ cityInfo ? cityInfo.name : '' }} 5일 예보</h3>

        <p v-if="isLoading">예보 로딩 중...</p>
        <p v-else-if="errorMessage">{{ errorMessage }}</p>

        <ul v-else-if="forecastList.length > 0">
            <li v-for="day in forecastList" :key="day.date">
                <p>{{ day.date }}</p>
                <p>{{ displayTemp(day.temp) }}{{ configStore.unitSymbol }} · {{ day.status }} · 습도 {{ day.humidity }}%</p>
            </li>
        </ul>
        <p v-else>예보 데이터가 없습니다.</p>

        <RouterLink to="/weather6">← 실시간 날씨 목록으로</RouterLink>
    </div>
</template>