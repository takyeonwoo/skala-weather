<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <div class="practice-section">
        <h2>페이지를 찾을 수 없습니다.</h2>
        <p>요청하신 주소가 존재하지 않거나, 아직 개발되지 않았습니다.</p>
        <RouterLink to="/weather4">날씨 메인으로 이동</RouterLink>
    </div>
</template>