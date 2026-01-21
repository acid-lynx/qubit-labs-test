<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

defineProps<{
  msg: string
}>()

const store = useStore()
const count = computed(() => store.state.count)

const increment = () => {
  store.commit('increment')
}
</script>

<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<style scoped>
.hello {
  padding: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
}

button:hover {
  background-color: #3aa876;
}
</style>
