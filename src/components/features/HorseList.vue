<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/store';

const store = useStore();
const horses = computed(() => store.state.horses.horsesList);
</script>

<template>
  <div class="horse-list">
    <div class="title">Name & Condition</div>
    <div class="container">
      <div class="horse-info" v-for="item in horses" :key="item.id">
        <div class="color" :style="{ background: item.color }" />
        <div class="name">{{ item.name }}</div>
        <div class="condition">{{ item.condition }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.horse-list {
  max-width: 250px;

  .container {
    display: flex;
    flex-direction: column;
    height: 580px;
    overflow-x: auto;
    overflow-y: auto;
    margin-right: 40px;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .title {
    margin-bottom: 10px;
    font-weight: bold;
  }

  .horse-info {
    display: flex;
    margin-bottom: 10px;
    font-size: 14px;

    .name {
      flex: 1;
      width: 140px;
    }

    .color {
      height: 20px;
      width: 20px;
      margin-right: 10px;
    }
  }
}
</style>
