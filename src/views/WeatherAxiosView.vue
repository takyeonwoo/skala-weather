<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'
import { useConfigStore } from '@/stores/configStore.js'

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

const weatherList = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

const fetchWeather = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
        const requests = cityList.map((city) =>
            axios.get(BASE_URL, {
                params: { q: city.query, appid: API_KEY, units: 'metric', lang: 'kr' },
            }),
        )

        const responses = await Promise.all(requests)

        weatherList.value = responses.map((res, index) => ({
            id: cityList[index].id,
            name: cityList[index].name,
            query: cityList[index].query,
            temp: Math.round(res.data.main.temp),
            status: res.data.weather[0].description,
            humidity: res.data.main.humidity,
            wind: res.data.wind.speed,
        }))

        console.log('OpenWeatherMap 응답 예시:', responses[0].data)
    } catch (error) {
        console.error('통신 중 에러가 발생했습니다:', error)
        errorMessage.value = `데이터를 가져오지 못했습니다. (${error.response?.status ?? '네트워크 오류'})`
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

onMounted(fetchWeather)
</script>

<template>
    <div class="practice-section" v-loading="isLoading" element-loading-text="데이터 로딩 중...">
        <h2>과제6: 실시간 날씨 (Axios)</h2>

        <el-button type="primary" @click="fetchWeather" :disabled="isLoading">
            실시간 날씨 새로고침
        </el-button>

        <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon class="weather-alert" />

        <div v-else-if="weatherList.length > 0" class="card-grid">
            <el-card v-for="city in weatherList" :key="city.id" shadow="hover">
                <p>{{ city.name }} ({{ city.status }})</p>
                <p>현재 기온: {{ displayTemp(city.temp) }}{{ configStore.unitSymbol }}</p>
                <p>습도 {{ city.humidity }}% · 바람 {{ city.wind }}m/s</p>
                <el-tag v-if="city.temp >= 25" type="danger">더움 (25도 이상)</el-tag>
                <el-tag v-else type="info">선선함 (25도 미만)</el-tag>
                <RouterLink :to="`/weather6/${city.id}`">예보보기</RouterLink>
            </el-card>
        </div>
        <p v-else-if="!isLoading">아직 가져온 데이터가 없습니다.</p>
    </div>
</template>

<style scoped>
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.weather-alert {
    margin-top: 1rem;
}
</style>