import React from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'

const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

// This function is pretty the much the same as Redux createStore.
// Expect for a couple of edge cases and error handling.
const createStore = (reducer) => {
  let state
  let listeners = []

  const getState = () => state

  // Update state with reducer and notify the listeners.
  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }

  // Listeners will be run everytime dispatch() is called.
  const subscribe = (listener) => {
    listeners.push(listener)
    // Return a function that unsubscribes the listener.
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }

  // Initialize store state with a dummy action.
  dispatch({})

  return { getState, dispatch, subscribe }
}

const Counter = ({ 
  value,
  onIncrement,
  onDecrement
}) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
)

const store = createStore(counter)
const render = () => {
  ReactDOM.render(
    <Counter 
      value={store.getState()} 
      onIncrement={() => {
        store.dispatch({
          type: 'INCREMENT'
        })
      }}
      onDecrement={() => {
        store.dispatch({
          type: 'DECREMENT'
        })
      }}
      />,
    document.getElementById('root')
  )
}

store.subscribe(render)
render()

expect(
  counter(0, { type: 'INCREMENT' })
).toEqual(1)

expect(
  counter(1, { type: 'INCREMENT' })
).toEqual(2)

expect(
  counter(1, { type: 'DECREMENT' })
).toEqual(0)

expect(
  counter(1, { type: 'SOMETHING_ELSE' })
).toEqual(1)

expect(
  counter(undefined, {})
).toEqual(0)


console.log('Tests passed!')