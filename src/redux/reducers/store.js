import {createStore} from 'redux';
 
function counter(state = 0, action) {
    switch (action.type) {
      case 'ДОБАВИТЬ':
        return state + 1
      case 'УМЕНЬШИТЬ':
        return state - 1
      default:
        return state
    }
  }