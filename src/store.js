import { configureStore } from '@reduxjs/toolkit'
import  keySlice  from './sclices/privateKeySlice'

export const store = configureStore({
  reducer: {
    key:keySlice,
  },
})