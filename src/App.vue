<script setup lang="ts">
import { useStore } from "@/store";
import { onMounted } from "vue";
import NavHeader from "@/components/features/NavHeader.vue";
import HorseList from "@/components/features/HorseList.vue";
import RaceTrack from "@/components/features/RaceTrack.vue";
import Sidebar from "@/components/features/Sidebar.vue";
import { Actions } from "@/store/types";

const store = useStore();

onMounted(() => {
  store.dispatch(`race/${Actions.GENERATE_PROGRAM}`);
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
