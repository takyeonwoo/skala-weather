<script setup>
import { ref } from 'vue'

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

const text = ref('')
const statusMessage = ref('카드를 클릭하거나 검색해 보세요.')
const showDetails = ref(false)

const selectCity = (cityName) => {
    statusMessage.value =`${cityName}이 선택되었습니다.`
}

const showDetail = (cityName, status) => {
    window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

</script>

<template>
    <div class="practice-section">
        <h2>과제1: 날씨 (Mockup)</h2>
        <h3>표시 설정</h3>
        <label>
            <input type="checkbox" v-model="showDetails" />상세 정보 표시</label>
        <h3>지역별 날씨 현황</h3>
        <ul>
            <li v-for="city in weatherList" :key="city.id" @click="selectCity(city.name)">
                <p>{{ city.name }} ({{ city.status }})</p>
                <p>현재 기온: {{ city.temp }}도</p>
                <p v-show="showDetails">습도 {{ city.humidity }}% · 바람 {{ city.wind }}m/s</p>
                <span v-if="city.temp >= 25" class="badge hot">더움 (25도 이상)</span>
                <span v-else class="badge cool">선선함 (25도 미만)</span>
                <button @click.stop="showDetail(city.name, city.status)">상세보기</button>
            </li>
        </ul>
        <br />
        <h3>도시 검색</h3>
        <input type="text" :value="text" @input="(e) => (text = e.target.value)" placeholder="검색할 도시 이름 입력"/>
        <p>검색 중인 도시: {{ text }}</p>
        <p class="status-bar">{{ statusMessage }}</p>
    </div>
</template>
