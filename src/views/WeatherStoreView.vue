<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import WeatherCardUnit from '../components/exercise/WeatherCardUnit.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import DisplaySettings from '../components/exercise/DisplaySettings.vue'
import { useRouter } from 'vue-router'
import { useFavoriteStore } from '@/stores/favoriteStore.js'

const router = useRouter()
const favoriteStore = useFavoriteStore()

const weatherList = ref([
    { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 45, wind: 2.1 },
    { id: 'city_02', name: '수원', temp: 24, status: '비',   humidity: 82, wind: 3.4 },
    { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 68, wind: 4.2 },
    { id: 'city_04', name: '대전', temp: 22, status: '흐림', humidity: 71, wind: 1.8 },
    { id: 'city_05', name: '대구', temp: 31, status: '맑음', humidity: 38, wind: 1.2 },
    { id: 'city_06', name: '광주', temp: 27, status: '구름', humidity: 60, wind: 2.6 },
    { id: 'city_07', name: '강릉', temp: 21, status: '비',   humidity: 88, wind: 5.1 },
    { id: 'city_08', name: '제주', temp: 29, status: '맑음', humidity: 74, wind: 6.3 },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const showDetails = ref(false)
const sortByTemp = ref(false)
const filteredWeatherList = computed(() => {
    return weatherList.value.filter((city) => city.name.includes(searchQuery.value))
})
const sortedWeatherList = computed(() => {
    const list = [...filteredWeatherList.value]
    return sortByTemp.value ? list.sort((a, b) => b.temp - a.temp) : list
})

watch(selectedCityInfo, (newValue, oldValue) => {
    console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newValue}" (이전: "${oldValue}")`)
})
watchEffect(() => {
    console.log(`[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다...`)
})
watch(sortByTemp, (newValue, oldValue) => {
    console.log(`[본인 watch] 정렬 기준 변경: ${oldValue} → ${newValue} (${newValue ? '기온 높은순' : '기본순'})`)
})

const selectCity = (cityName) => {
    selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}

const goToDetail = (cityName) => {
    const city = weatherList.value.find((c) => c.name === cityName)
    router.push('/weather5/' + city.id)
}

const handleUpdateQuery = (newValue) => {
    searchQuery.value = newValue
}

const handleUpdateShowDetails = (value) => {
    showDetails.value = value
}

const handleUpdateSort = (value) => {
    sortByTemp.value = value
}

</script>

<template>
    <div class="practice-section">
        <h2>종합실습5: 스토어 적용</h2>

        <p>즐겨찾기: {{ favoriteStore.favoriteCount }}개</p>
        
        <BaseDashboardCard title="도시 검색">
            <SearchBar :search-query="searchQuery" @update-query="handleUpdateQuery" />
        </BaseDashboardCard>

        <BaseDashboardCard title="표시 설정">
            <DisplaySettings
                :show-details="showDetails"
                :sort-by-temp="sortByTemp"
                @update-show-details="handleUpdateShowDetails"
                @update-sort="handleUpdateSort"
            />
        </BaseDashboardCard>

        <BaseDashboardCard title="지역별 날씨 현황">
            <ul v-if="filteredWeatherList.length > 0">
                <WeatherCardUnit
                    v-for="city in sortedWeatherList"
                    :key="city.id"
                    :city-item="city"
                    :show-details="showDetails"
                    @select-card="selectCity"
                    @click-detail="goToDetail"
                />
            </ul>
            <p v-else>검색 결과와 일치하는 도시가 없습니다.</p>
        </BaseDashboardCard>

        <p class="status-bar">{{ selectedCityInfo }}</p>
    </div>
</template>