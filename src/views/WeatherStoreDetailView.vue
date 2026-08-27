<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore.js'
import { useFavoriteStore } from '@/stores/favoriteStore.js'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()

const displayTemp = computed(() => {
    if (!cityDetail.value) return null
    const rawTemp = cityDetail.value.temp
    if (configStore.unit === 'fahrenheit') {
        return Math.round((rawTemp * 9) / 5 + 32)
    }
    return rawTemp
})

const mockWeatherData = [
    { id: 'city_01', name: '서울', region: '대한민국 서울특별시', temp: 28, status: '맑음', humidity: 45, wind: 2.1 },
    { id: 'city_02', name: '수원', region: '대한민국 경기도 수원시', temp: 24, status: '비',   humidity: 82, wind: 3.4 },
    { id: 'city_03', name: '부산', region: '대한민국 부산광역시', temp: 26, status: '구름', humidity: 68, wind: 4.2 },
    { id: 'city_04', name: '대전', region: '대한민국 대전광역시', temp: 22, status: '흐림', humidity: 71, wind: 1.8 },
    { id: 'city_05', name: '대구', region: '대한민국 대구광역시', temp: 31, status: '맑음', humidity: 38, wind: 1.2 },
    { id: 'city_06', name: '광주', region: '대한민국 광주광역시', temp: 27, status: '구름', humidity: 60, wind: 2.6 },
    { id: 'city_07', name: '강릉', region: '대한민국 강원도 강릉시', temp: 21, status: '비',   humidity: 88, wind: 5.1 },
    { id: 'city_08', name: '제주', region: '대한민국 제주특별자치도', temp: 29, status: '맑음', humidity: 74, wind: 6.3 },
]

const cityDetail = ref(null)

onMounted(() => {
    cityDetail.value = mockWeatherData.find((city) => city.id === route.params.cityId)
})

const goHome = () => {
    router.push('/weather5')
}
</script>

<template>
    <div class="practice-section">
        <h2>종합실습5: 스토어 적용</h2>
        <h3>지역별 상세 기상 관측 정보</h3>
        <p>즐겨찾기: {{ favoriteStore.favoriteCount }}개</p>
        <div v-if="cityDetail">
            <p>지정 지역: {{ cityDetail.region }}</p>
            <p>실시간 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
            <p>기상 현황: {{ cityDetail.status }}</p>
            <p>대기 습도: {{ cityDetail.humidity }}%</p>
            <p>현재 풍속: {{ cityDetail.wind }}m/s</p>
            <button @click="favoriteStore.toggleFavorite(cityDetail.id)">
                {{ favoriteStore.isFavorite(cityDetail.id) ? '★ 즐겨찾기 해제' : '☆ 즐겨찾기 추가' }}
            </button>
        </div>
        <p v-else>해당 도시 정보를 찾을 수 없습니다. (cityId: {{ route.params.cityId }})</p>

        <button @click="goHome">← 메인 대시보드로 돌아가기</button>
    </div>
</template>