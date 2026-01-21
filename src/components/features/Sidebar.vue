<script setup lang="ts">
import InfoList from '@/components/shared/InfoList.vue';
import type { RaceHorse, RaceResult } from '@/utils/types';
</script>

<template>
  <div class="sidebar">
    <div class="program">
      <InfoList title="Program" :items="(round) => round.horsesPerRound">
        <template #default="{ item }">
          <span class="name">{{ (item as RaceHorse).name }}</span>
        </template>
      </InfoList>
    </div>

    <div class="results">
      <InfoList title="Results" :items="(round) => round.results">
        <template #default="{ item }">
          <span class="name">{{ (item as RaceResult).horseName }}</span>
        </template>
      </InfoList>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  display: flex;

  .results {
    margin-left: 10px;
  }
}
</style>
