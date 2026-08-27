<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const mockWeatherData = [
    { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 45, wind: 2.1 },
    { id: 'city_02', name: '수원', temp: 24, status: '비',   humidity: 82, wind: 3.4 },
    { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 68, wind: 4.2 },
    { id: 'city_04', name: '대전', temp: 22, status: '흐림', humidity: 71, wind: 1.8 },
    { id: 'city_05', name: '대구', temp: 31, status: '맑음', humidity: 38, wind: 1.2 },
    { id: 'city_06', name: '광주', temp: 27, status: '구름', humidity: 60, wind: 2.6 },
    { id: 'city_07', name: '강릉', temp: 21, status: '비',   humidity: 88, wind: 5.1 },
    { id: 'city_08', name: '제주', temp: 29, status: '맑음', humidity: 74, wind: 6.3 },
]

const cityA = computed(() => mockWeatherData.find((c) => c.id === route.params.cityA))
const cityB = computed(() => mockWeatherData.find((c) => c.id === route.params.cityB))

const selectedA = ref(route.params.cityA)
const selectedB = ref(route.params.cityB)

const goCompare = () => {
    router.push({ name: 'compare', params: { cityA: selectedA.value, cityB: selectedB.value } })
}

watch(
    () => route.params,
    (params) => {
        selectedA.value = params.cityA
        selectedB.value = params.cityB
    },
)
</script>

<template>
    <div class="practice-section">
        <h2>과제4: 라우터 적용</h2>
        <h3>도시 비교</h3>

        <div>
            <select v-model="selectedA">
                <option v-for="city in mockWeatherData" :key="city.id" :value="city.id">
                    {{ city.name }}
                </option>
            </select>
            <select v-model="selectedB">
                <option v-for="city in mockWeatherData" :key="city.id" :value="city.id">
                    {{ city.name }}
                </option>
            </select>
            <button @click="goCompare">비교하기</button>
        </div>

        <div v-if="cityA && cityB">
            <table>
                <thead>
                    <tr>
                        <th>항목</th>
                        <th>{{ cityA.name }}</th>
                        <th>{{ cityB.name }}</th>
                        <th>차이</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>기온</td>
                        <td>{{ cityA.temp }}도</td>
                        <td>{{ cityB.temp }}도</td>
                        <td>{{ Math.abs(cityA.temp - cityB.temp) }}도</td>
                    </tr>
                    <tr>
                        <td>습도</td>
                        <td>{{ cityA.humidity }}%</td>
                        <td>{{ cityB.humidity }}%</td>
                        <td>{{ Math.abs(cityA.humidity - cityB.humidity) }}%p</td>
                    </tr>
                    <tr>
                        <td>풍속</td>
                        <td>{{ cityA.wind }}m/s</td>
                        <td>{{ cityB.wind }}m/s</td>
                        <td>{{ Math.abs(cityA.wind - cityB.wind).toFixed(1) }}m/s</td>
                    </tr>
                    <tr>
                        <td>기상</td>
                        <td>{{ cityA.status }}</td>
                        <td>{{ cityB.status }}</td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
            <p>더 더운 도시: {{ cityA.temp >= cityB.temp ? cityA.name : cityB.name }}</p>
        </div>
        <p v-else>비교할 도시를 찾을 수 없습니다.</p>
    </div>
</template>