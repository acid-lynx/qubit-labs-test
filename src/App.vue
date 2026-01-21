<script setup lang="ts">
import { useStore } from "@/store";
import { onMounted } from "vue";
import NavHeader from "@/components/features/NavHeader.vue";
import HorseList from "@/components/features/HorseList.vue";
import RaceTrack from "@/components/features/RaceTrack.vue";
import Sidebar from "@/components/features/Sidebar.vue";

const store = useStore();

onMounted(() => {
  store.dispatch('race/generateProgram');
});
</script>

<template>
  <div id="app">
    <NavHeader />
    <main class="container">
      <HorseList />
      <RaceTrack />
      <Sidebar />
    </main>
  </div>
</template>

<style>
.container {
  display: flex;
}
</style>
