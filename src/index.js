import { createStore } from 'redux'
import expect from 'expect'
import deepFreeze from 'deep-freeze'

const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      }
    case 'TOGGLE_TODO':
      if ( state.id === action.id ) {
        return { 
          ...state, 
          completed: !state.completed 
        }
      }
      return state
    default: 
      return state
  }
}

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ]
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action))
    default:
      return state
  }
}

const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch(action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

// Composing several reducers into one.
// This is the same what combineReducers does.
const todoApp = (state = {}, action) => {
  return {
    todos: todos(
      state.todos,
      action
    ),
    visibilityFilter: visibilityFilter(
      state.visibilityFilter,
      action
    )
  }
}

const store = createStore(todoApp)
console.log('Initial state:')
console.log(store.getState())
console.log('--------------')

console.log('dispatching ADD_TODO')
store.dispatch({ 
  type: 'ADD_TODO',
  id: 0,
  text: 'Learn Redux'
})

console.log('Current state:')
console.log(store.getState())
console.log('--------------')

console.log('dispatching ADD_TODO')
store.dispatch({ 
  type: 'ADD_TODO',
  id: 1,
  text: 'Go running'
})

console.log('Current state:')
console.log(store.getState())
console.log('--------------')

console.log('dispatching TOGGLE_TODO 1')
store.dispatch({ 
  type: 'TOGGLE_TODO',
  id: 1
})


console.log('Current state:')
console.log(store.getState())
console.log('--------------')

console.log('dispatching SET_VISIBILITY_FILTER')
store.dispatch({ 
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
})

console.log('Current state:')
console.log(store.getState())
console.log('--------------')

const testAddTodo = () => {
  const stateBefore = []
  const action = {
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
  }

  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    }
  ]

  deepFreeze(stateBefore)
  deepFreeze(action)

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter)
}

const testToggleTodo = () => {
  const stateBefore = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    },
        {
      id: 1,
      text: 'Goto 10',
      completed: false
    }
  ]
  const action = {
    type: 'TOGGLE_TODO',
    id: 1
  }
  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    },
        {
      id: 1,
      text: 'Goto 10',
      completed: true
    }
  ]

  deepFreeze(stateBefore)
  deepFreeze(action)
  
  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter)
}

testAddTodo()
testToggleTodo()
console.log('All tests passed!')
