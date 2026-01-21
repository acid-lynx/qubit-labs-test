import { createStore } from 'vuex'

export interface State {
  count: number
}

export default createStore<State>({
  state: {
    count: 0,
  },
  getters: {
    doubleCount(state): number {
      return state.count * 2
    },
  },
  mutations: {
    increment(state) {
      state.count++
    },
    decrement(state) {
      state.count--
    },
    setCount(state, payload: number) {
      state.count = payload
    },
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    },
  },
  modules: {},
})
