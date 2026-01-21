import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import HelloWorld from './HelloWorld.vue'

const createTestStore = () => {
  return createStore({
    state: {
      count: 0,
    },
    mutations: {
      increment(state) {
        state.count++
      },
    },
  })
}

describe('HelloWorld', () => {
  it('renders properly', () => {
    const store = createTestStore()
    const wrapper = mount(HelloWorld, {
      props: {
        msg: 'Hello Vitest',
      },
      global: {
        plugins: [store],
      },
    })
    expect(wrapper.text()).toContain('Hello Vitest')
  })

  it('displays the count from store', () => {
    const store = createTestStore()
    const wrapper = mount(HelloWorld, {
      props: {
        msg: 'Test',
      },
      global: {
        plugins: [store],
      },
    })
    expect(wrapper.text()).toContain('Count: 0')
  })

  it('increments count when button is clicked', async () => {
    const store = createTestStore()
    const wrapper = mount(HelloWorld, {
      props: {
        msg: 'Test',
      },
      global: {
        plugins: [store],
      },
    })

    await wrapper.find('button').trigger('click')
    expect(store.state.count).toBe(1)
  })
})
