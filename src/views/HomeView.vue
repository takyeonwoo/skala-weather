<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="practice-section">
    <h2>Front-Framework: Vue.js 실습 과제</h2>
    <h3>판교 1반 P032 탁연우</h3>
    <ul>
      <li><RouterLink to="/weather">과제 1 — 날씨 Mockup</RouterLink></li>
      <li><RouterLink to="/weather2">과제 2 — 날씨 (컴포지션)</RouterLink></li>
      <li><RouterLink to="/weather3">과제 3 — 날씨 (컴포넌트)</RouterLink></li>
      <li><RouterLink to="/weather4">과제 4 — 라우터 적용</RouterLink></li>
      <li><RouterLink to="/weather5">과제 5 — 날씨 (스토어)</RouterLink></li>
      <li><RouterLink to="/weather6">과제 6 — 실시간 날씨 (Axios)</RouterLink></li>
      <li><RouterLink to="/weather-map">Appendix — 날씨 지도</RouterLink></li>
    </ul>
  </div>
</template>