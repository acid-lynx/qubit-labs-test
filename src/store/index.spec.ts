import { describe, it, expect } from 'vitest'
import store from './index'

describe('Vuex Store', () => {
  it('has initial count of 0', () => {
    expect(store.state.count).toBe(0)
  })

  it('increments count', () => {
    const initialCount = store.state.count
    store.commit('increment')
    expect(store.state.count).toBe(initialCount + 1)
  })

  it('decrements count', () => {
    const initialCount = store.state.count
    store.commit('decrement')
    expect(store.state.count).toBe(initialCount - 1)
  })

  it('sets count with setCount mutation', () => {
    store.commit('setCount', 10)
    expect(store.state.count).toBe(10)
  })

  it('returns double count from getter', () => {
    store.commit('setCount', 5)
    expect(store.getters.doubleCount).toBe(10)
  })
})
