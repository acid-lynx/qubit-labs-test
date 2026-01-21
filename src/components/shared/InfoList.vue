<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/store';
import type { Round } from '@/utils/types';

defineProps<{
  title: string;
  items: (round: Round) => unknown[];
}>();

defineSlots<{
  default: (props: { item: unknown }) => void;
}>();

const store = useStore();

const rounds = computed(() => store.state.race.rounds);
</script>

<template>
  <div>
    <div class="title">{{ title }}</div>
    <div class="round-list">
      <div
        class="round"
        v-for="(round, roundIndex) in rounds"
        :key="roundIndex"
      >
        <span class="round_lap">
          Lap #{{ round.lap }} - {{ round.distance }}m
        </span>
        <div class="round_card">
          <div
            class="round_item"
            v-for="(item, index) in items(round)"
            :key="index"
          >
            <span class="round_item-number"> {{ index + 1 }}. </span>
            <slot :item="item">{{ item }}</slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  margin-bottom: 10px;
  font-weight: bold;
}

.round-list {
  height: 580px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
}

.round {
  &_card {
    width: 170px;
    border: 1px solid pink;
    margin-bottom: 10px;
    padding: 15px;
  }

  &_item {
    display: flex;
    font-size: 14px;
  }

  &_item-number {
    margin-right: 10px;
  }
}
</style>
