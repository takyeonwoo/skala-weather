<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">과제 목록</RouterLink>
      <RouterLink to="/compare/city_01/city_03">도시 비교</RouterLink>
      <RouterLink to="/about">서비스 소개</RouterLink>
    </nav>
    <UnitToggler />
  </header>

  <RouterView />
</template>