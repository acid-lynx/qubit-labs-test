<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/store';
import { Getters, Actions } from '@/store/types';

const store = useStore();

const currentRoundIndex = computed(() => store.state.race.currentRoundIndex);
const isRacing = computed(() => store.state.race.isRacing);
const isStartDisabled = computed(
  () => store.getters[`race/${Getters.IS_START_DISABLED}`] as boolean
);

const generateProgram = (): void => {
  store.dispatch(`race/${Actions.GENERATE_PROGRAM}`);
};
const startRace = (roundIndex: number): void => {
  store.dispatch(`race/${Actions.START_RACE}`, roundIndex);
};
</script>

<template>
  <header class="header">
    <div class="title">Horse racing</div>
    <div class="header_btn-block">
      <button
        class="header_btn generate"
        :disabled="isRacing"
        @click="generateProgram"
      >
        Generate program
      </button>
      <button
        class="header_btn start"
        :disabled="isStartDisabled"
        @click="startRace(currentRoundIndex)"
      >
        Start
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  padding: 15px 30px;
  justify-content: space-between;
  background: navy;
  margin-bottom: 10px;

  .title {
    text-transform: uppercase;
    color: white;
  }

  &_btn {
    padding: 5px 10px;
  }

  &_btn-block {
    .generate {
      margin-right: 20px;
    }
  }
}
</style>
