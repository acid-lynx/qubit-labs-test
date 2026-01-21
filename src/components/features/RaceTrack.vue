<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/store';
import type { Round } from '@/utils/types';
import HorseIcon from '@/components/shared/HorseIcon.vue';

const store = useStore();

const rounds = computed(() => store.state.race.rounds);
const currentRoundIndex = computed(() => store.state.race.currentRoundIndex);
const getCurrentRound = computed(
  () => store.getters['race/getCurrentRound'] as Round | undefined
);
</script>

<template>
  <div class="race-track-container">
    <div class="title">Screen</div>
    <div class="lanes-wrapper">
      <div
        class="lane"
        v-for="(horse, index) in rounds[currentRoundIndex]?.horsesPerRound"
        :key="index"
      >
        <HorseIcon
          class="horse"
          :width="40"
          :height="40"
          :color="horse.color"
          :style="{ left: `${horse.progress}%` }"
        />
        <div class="path" />
      </div>
    </div>

    <div class="track-footer" v-if="getCurrentRound">
      <span class="lap-info">
        Lap #{{ getCurrentRound.lap }} - {{ getCurrentRound.distance }}m
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.race-track-container {
  margin-right: 30px;
  width: 670px;
}
.title {
  margin-bottom: 10px;
  font-weight: bold;
}

.lanes-wrapper {
  background: lightgray;
  padding-right: 45px;
  border-bottom: 2px solid black;
}

.lane {
  position: relative;
  height: 50px;
  background: lightgray;
  border-bottom: 1px solid black;
  border-right: 2px solid darkred;

  &:last-child {
    border-bottom: none;
  }

  &-number {
    font-size: 20px;
  }
}

.horse {
  position: absolute;
  bottom: 0;
  transition: left 0.2s linear;
}

.track-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 68px;
  background: #222222;
  padding: 10px;
  text-align: center;
}
</style>
