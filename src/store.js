import { configureStore } from 'redux-starter-kit'
import ctReducer from "./_reducers/root";


const store = configureStore({
  reducer: ctReducer
})

export default store